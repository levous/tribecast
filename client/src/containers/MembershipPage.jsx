import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
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
    this.props.actions.updateMember(member);
  }

  handleEditButtonTouchTap() {
    let temp = {
      id   : 6767,
      firstName: '$$$$$$$$$$$$$Super',
      lastName: 'Man',
      propertyAddress: {
        street: '99 Serenbe Ln',
        city : 'Palmetto',
        state: 'GA',
        zip  :  '30268'
      }
    };

    this.props.actions.createMember(temp);
  }

  render() {
    const {members, selectedMember} = this.props;
    const selectedMemberId = selectedMember ? selectedMember.id : -1;
    return (
      <div>
        <FlatButton primary={true} label='+' style={{float:'right'}} onTouchTap={() => this.handleEditButtonTouchTap()} />
        <h2 className="text-center">Members</h2>

        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <MemberList {...this.props} onSelectItem={(member) => this.handleMemberItemSelection(member)} selectedMemberId={selectedMemberId}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>
              {selectedMember && <Member key={`memberdiv${selectedMember.id}`} member={selectedMember} style={{postion: 'relative'}} onUpdate={(member) => this.handleUpdate(member)}/> }
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
