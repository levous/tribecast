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

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.auth = new Auth(context.store);
  }

  componentWillMount(){
    const {members, userData, auth} = this.props;

    if(!userData.memberUserKey) NotificationManager.warning("Your user account has no member listing referenced", "Missing Reference");
    const userMember = members.find(m => m.memberUserKey == userData.memberUserKey);
    if(userData.memberUserKey && !userMember) NotificationManager.warning("I couldn't find the member listing associated with your user account");
    const canEditUserMember = this.auth.userCanEditMember(userData, userMember);
    this.setState({userMember, canEditUserMember});
  }

  handleUpdate(member){
    this.props.actions.updateMember(member);
  }

  render() {
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
                  canEdit={canEditUserMember}
                  style={{postion: 'relative'}}
                  onUpdate={(member) => this.handleUpdate(member)}
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

MembershipPage.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage);