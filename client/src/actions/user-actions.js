export const user_action_types = {
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS'
};

export function userLoggedIn(userData) {
  return {
    type: user_action_types.USER_LOGGED_IN,
    userData
  };
}

export function userLoggedOut() {
  return {type: user_action_types.USER_LOGGED_OUT};
}

export function updateUserPassword(password, resetToken) {
  return {
    type: user_action_types.UPDATE_PASSWORD,
    password,
    resetToken
  };
}
