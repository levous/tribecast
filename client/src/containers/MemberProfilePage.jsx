import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {NotificationManager} from 'react-notifications';
import Member from '../components/membership/Member.jsx';
import * as memberActions from '../actions/member-actions';
import Auth from '../modules/Auth'
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import 'react-notifications/lib/notifications.css';

class MemberProfilePage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      editingSelectedMember: false
    }
    this.auth = new Auth(context.store);
  }

  componentWillMount(){
    const {members, userData, auth} = this.props;

    if(!userData.memberUserKey || userData.memberUserKey.length < 1){
      NotificationManager.warning("Your user account has no member listing referenced", "Missing Reference");
      return;
    }

    const userMember = members.find(m => m.memberUserKey == userData.memberUserKey);
    if(userData.memberUserKey && !userMember) return NotificationManager.warning("I couldn't find the member listing associated with your user account");

    const canEditUserMember = this.auth.userCanEditMember(userData, userMember);
    this.setState({userMember, canEditUserMember});
  }

  handleUpdate(member){
    this.props.actions.updateMember(member);
  }

  handleMemberEditing(editing) {
    this.setState({editingSelectedMember: editing});
  }

  handleProfileImageChanged(thumbnailImage, fullsizeImage, unEditedImage){
    this.props.actions.updateMemberProfileImage(this.state.userMember, thumbnailImage, fullsizeImage, unEditedImage);
  }


  render() {
    if(!(this.state && this.state.userMember)) return <div className='jumbotron'>Sorry, I don't have a member record matched to your user account.</div>
    const {userMember, canEditUserMember} = this.state;

    return (
      <div className="jumbotron">
        <h1>My Profile</h1>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>
              {userMember && (
                <Member key={`memberdiv${userMember.id}`}
                  member={userMember}
                  editing={this.state.editingSelectedMember}
                  canEdit={canEditUserMember}
                  style={{postion: 'relative'}}
                  onUpdate={(member) => this.handleUpdate(member)}
                  onEditing={(editing) => this.handleMemberEditing(editing)}
                  onProfileImageChanged={(thumbnailImage, fullsizeImage, unEditedImage) => this.handleProfileImageChanged(thumbnailImage, fullsizeImage, unEditedImage)}
                />
              )}
              {!userMember && (<p>No Member Listing to Edit</p>)}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

MemberProfilePage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    members: state.memberApp.members,
    dataSource: state.memberApp.dataSource,
    userData: state.userApp.userData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberProfilePage);
