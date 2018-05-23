import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import StyledLabel from '../forms/StyledLabel';
import user_roles from '../../../../config/user_roles';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserAccountView = ({
  user,
  onToggleRole,
  onViewUserMember,
  onUpdate
}) => {
  const roles = Object.keys(user_roles).map(function(key) { return user_roles[key] });
  
  const MemberAccount = () => {
    if(user.memberUserKey) {
      return <FlatButton label="View Member Record" onClick={(button) => onViewUserMember(user)} />
    }else{
      return <small>no associated member record</small>
    }
  }

  const AccessExpiration = () => {
    class TheButton extends React.Component {
      render () {return <FlatButton label="Update Expiration" onClick={this.props.onClick} />}
    }

    const expiresAt = user.accessExpiresAt instanceof Date ? user.accessExpiresAt : null;

    return (
      <div>
        <style>
          {'.react-datepicker {font-size: 1.6rem}'}
        </style>
        <DatePicker
          customInput={<TheButton />}
          selected={expiresAt}
          onChange={date => {
            user.accessExpiresAt = date.valueOf();
            onUpdate(user);
            return true;
          }}  
          showYearDropdown
          withPortal
          />
        </div>
    )
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
      <div>
        <MemberAccount />
      </div>
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
      <p style={{float: 'left', marginRight: '10px'}}> 
        <span style={{marginRight: '10px', fontSize:'0.8em'}}>access expires:</span>
        {user.accessExpiresAt ? moment(user.accessExpiresAt).format('LLL') : 'none'}
      </p>

      <AccessExpiration />
    
    </div>

  </div>
  )
};

UserAccountView.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserAccountView;
