import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap'
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedMember: null
    }
  }

  handleMemberItemSelection(member){
    this.setState({
      selectedMember: member
    })
  }

  handleUpdate(member){
    this.setState({
      selectedMember: member
    })
  }

  render() {
    const {selectedMember} = this.state
    const {actions, members} = this.props;
    return (
      <div>
        <h2 className="text-center">Members</h2>
        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={4}>
              <MemberList members={members} onSelectItem={(member) => this.handleMemberItemSelection(member)}/>
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
    members: state.members,
    selectedMember: state.selectedMember
  };
}

export default connect(
  mapStateToProps
)(MembershipPage);
