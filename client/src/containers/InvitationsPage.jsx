import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import defaults from '../../../config/community-defaults';

class InvitationsPage extends React.Component {
  render() {
    if(!this.props.invites_loading){
      return <div className='jumbotron'>Loading...</div>
    }
    return (
      <div className='jumbotron'>
        <p>An email was dispatched from the server!  For your convenience, here is a copy.  You can send it personally.  The embedded link is specific to the recipient's account.</p>
        {this.props.invites.message}
        {this.props.invites.data.map((invite, i) => (
          <div key={`invite${i}`} style={{border: '1px solid #ffffff', borderRadius: '10px', margin: '20px', padding: '20px'}}>
            <p>Dear {invite.name || 'Friend'},</p>
            <p>You've been invited to {defaults.name}!  Please follow the <a href={`${defaults.urlRoot}/invite/${invite.inviteToken}`}>Invite Link</a> to create your password and activate your user account.</p>
            <p style={{paddingLeft: '300px'}}>Warm regards,</p>
            <p style={{paddingLeft: '300px'}}>{this.props.user.name}</p>
          </div>
        ))
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    invites: state.memberApp.invites,
    invites_loading: state.memberApp.invites_loading,
    user: state.userApp.userData
  };
}

export default connect(mapStateToProps)(InvitationsPage);
