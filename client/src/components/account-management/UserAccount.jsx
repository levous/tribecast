import React, {PropTypes} from 'react';
import StyledLabel from '../forms/StyledLabel';

const UserAccountView = ({
  user
}) => (
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
  </div>
);

UserAccountView.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserAccountView;
