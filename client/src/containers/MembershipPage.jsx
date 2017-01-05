import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap'
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';
import * as memberActions from '../actions/member-actions'

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
  }

  handleMemberItemSelection(member){
    this.props.actions.selectMember(member);
  }

  handleUpdate(member){
    console.log('handleUpdate', member );
  }

  render() {
    const {members, selectedMember} = this.props;
    const selectedMemberId = selectedMember.id || -1;
    return (
      <div>
        <h2 className="text-center">Members</h2>
        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={4}>
              <MemberList members={members} onSelectItem={(member) => this.handleMemberItemSelection(member)} selectedMemberId={selectedMemberId}/>
            </Col>
            <Col xs={12} md={8}>
              {selectedMember && <Member member={selectedMember} onUpdate={(member) => this.handleUpdate(member)}/> }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    members: state.memberApp.members,
    selectedMember: state.memberApp.selectedMember
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage);
