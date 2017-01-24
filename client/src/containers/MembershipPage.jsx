import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';
import SearchField from '../components/forms/SearchField.jsx';
import * as memberActions from '../actions/member-actions';

import 'react-notifications/lib/notifications.css';

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      filteredList: props.members
    }
  }

  componentDidMount(){
    if(this.props.location.query.notification){
      NotificationManager.info(this.props.location.query.notification);
    }
    if(this.props.location.query.clearLocalStorage){
      debugger;
      localStorage.clear();
    }

  }

  handleMemberItemSelection(member){
    this.props.actions.selectMember(member);
    console.log(member);
  }

  handleUpdate(member){
    console.log('handleUpdate', member );
    this.props.actions.updateMember(member);
  }

  handleAddButtonTouchTap() {
    let temp = {
      id: Math.floor(Date.now() / 1000),
      firstName: '$$$$$$$$$$$$$Super',
      lastName: 'Man',
      propertyAddress: {
        street: '99 Serenbe Ln',
        city : 'Palmetto',
        state: 'GA',
        zip  :  '30268'
      }
    };

    this.props.actions.addMember(temp);
  }

  handleRefreshButtonTouchTap() {
    this.props.actions.refreshMembersFromServer();
  }

  handleFuzzySelected(item){
    console.log(item);
  }

  handleFilteredChanged(results){
    const filteredList = results || this.props.members;
    this.setState({filteredList: filteredList});
  }

  render() {
    const {selectedMember} = this.props;
    const selectedMemberId = selectedMember ? selectedMember.id : -1;
    return (
      <div>
        <FlatButton primary={true} label='+' style={{float:'right'}} onTouchTap={() => this.handleAddButtonTouchTap()} />
        <FlatButton primary={false} label='refresh' style={{float:'right'}} onTouchTap={() => this.handleRefreshButtonTouchTap()} />
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <SearchField
                list={this.props.members}
                keys={['firstName', 'lastName', 'propertyAddress.street', 'neighborhood', 'email']}
                placeholder='fuzzy search'
                style={{width:'100%', border: 'solid 1px rgb(0, 188, 212)', padding: '3px', borderRadius: '5px'}}
                onChange={filteredList => this.handleFilteredChanged(filteredList)} />
              <br/>
              <MemberList {...this.props} members={this.state.filteredList} onSelectItem={(member) => this.handleMemberItemSelection(member)} selectedMemberId={selectedMemberId}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>
              {selectedMember && (
                <Member key={`memberdiv${selectedMember.id}`}
                  member={selectedMember}
                  style={{postion: 'relative'}}
                  onUpdate={(member) => this.handleUpdate(member)}
                />
              )}
            </Col>
          </Row>
        </Grid>
        <NotificationContainer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    members: state.memberApp.members,
    selectedMember: state.memberApp.selectedMember,
    dispatch: PropTypes.func.isRequired,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage);
