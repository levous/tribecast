import React, {PropTypes} from 'react';
import StyledLabel from '../forms/StyledLabel';
import user_roles from '../../../../config/user_roles';

const UserAccountView = ({
  user,
  onToggleRole
}) => {
  const roles = Object.keys(user_roles).map(function(key) { return user_roles[key] });
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
      <p>
        {
          roles.map((role, i) => { return <div key={i}><input type='checkbox' onClick={()=>{onToggleRole(user, role)}} checked={user.roles && user.roles.includes(role)} /><span>{role}</span></div> })
        }
      </p>
    </div>
  </div>
  )
};

UserAccountView.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserAccountView;
