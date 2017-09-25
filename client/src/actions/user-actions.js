export const user_action_types = {
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
  RESET_PASSWORD_RESPONSE_RECEIVED: 'RESET_PASSWORD_RESPONSE_RECEIVED',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
  SELECT_USER_ACCOUNT: 'SELECT_USER_ACCOUNT'
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

export function resetPassword(email) {
  return {
    type: user_action_types.RESET_PASSWORD,
    email
  };
}

export function updateUserPassword(password, resetToken) {
  return {
    type: user_action_types.UPDATE_PASSWORD,
    password,
    resetToken
  };
}

export function selectUserAccount(user) {
  return {
    type: user_action_types.SELECT_USER_ACCOUNT,
    user
  };
}
