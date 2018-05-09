import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import StyledLabel from '../forms/StyledLabel';
import user_roles from '../../../../config/user_roles';
import FlatButton from 'material-ui/FlatButton';

const UserAccountView = ({
  user,
  onToggleRole,
  onViewUserMember
}) => {
  const roles = Object.keys(user_roles).map(function(key) { return user_roles[key] });
  
  const MemberAccount = () => {
    if(user.memberUserKey) {
      return <FlatButton label="View Member Record" onClick={(button) => onViewUserMember(user)} />
    }else{
      return <small>no associated member record</small>
    }
  }
  return (
  <div>
    <div>
      <StyledLabel htmlFor='userName' text='user name' />
      <p>
        {user.name}
      </p>
    </div>
    <div>
      <StyledLabel htmlFor='email' text='email address' />
      <p>
        {user.email}
      </p>
    </div>
    <div>
      <StyledLabel htmlFor='roles' text='Roles' />
      <div className='checkbox-group'>
        {
          roles.map((role, i) => { return <div key={i}><label><input type='checkbox' onChange={()=>{onToggleRole(user, role)}} checked={user.roles && user.roles.includes(role)} /><span>{role}</span></label></div> })
        }
      </div>
    </div>
    <div>
      <StyledLabel htmlFor='member-account' text='member account' />
      <p> 
        <MemberAccount />
      </p>
    </div>
    <div>
      <StyledLabel htmlFor='dates' text='dates' />
      <p style={{float: 'left', marginRight: '10px'}}> 
        <span style={{marginRight: '10px', fontSize:'0.8em'}}>created:</span>
        {moment(user.createdAt).format('LLL')}
      </p>
      <p> 
        <span style={{marginRight: '10px', fontSize:'0.8em'}}>last login:</span>
        {user.lastAuthCheckAt ? moment(user.lastAuthCheckAt).format('LLL') : 'unknown'}
      </p>
    
    </div>

  </div>
  )
};

UserAccountView.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserAccountView;
