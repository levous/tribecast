export const user_action_types = {
  GET_ALL: 'GET_USERS',
  LOG_IN_USER: 'USER_LOG_IN',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  USER_LOG_IN_FAILED: 'USER_LOG_IN_FAILED',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  UPDATE_USER: 'UPDATE_USER',
  LOG_IN_MAGIC_LINK: 'LOG_IN_MAGIC_LINK',
  SEND_MAGIC_LINK: 'SEND_MAGIC_LINK',
  SEND_MAGIC_LINK_RESPONSE_RECEIVED: 'SEND_MAGIC_LINK_RESPONSE_RECEIVED',
  RESET_PASSWORD: 'RESET_PASSWORD',
  RESET_PASSWORD_RESPONSE_RECEIVED: 'RESET_PASSWORD_RESPONSE_RECEIVED',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  SELECT_USER_ACCOUNT: 'SELECT_USER_ACCOUNT',
  SELECT_USER_ACCOUNT_BY_MEMBER_USER_KEY: 'SELECT_USER_ACCOUNT_BY_MEMBER_USER_KEY',
  USER_DATA_RECEIVED: 'USER_DATA_RECEIVED',
  USER_DATA_FAILED: 'USER_DATA_FAILED',
  TOGGLE_USER_ROLE: 'TOGGLE_USER_ROLE',
  CACHE_NEWEST_API_RECORD_SAVED_AT: 'CACHE_NEWEST_API_RECORD_SAVED_AT'
};

export const user_sort_keys = {
  NAME: 'NAME',
  EMAIL: 'EMAIL'
};

export function getAllUsers() {
  return {
    type: user_action_types.GET_ALL
  };
};

export function logInUser(userData) {
  return {
    type: user_action_types.LOG_IN_USER,
    userData
  };
};

export function logInMagicLink(magicLinkToken) {
  return {
    type: user_action_types.LOG_IN_MAGIC_LINK,
    magicLinkToken
  };
};

export function userLoggedIn(userData) {
  return {
    type: user_action_types.USER_LOGGED_IN,
    userData
  };
};

export function userLoggedOut() {
  return {type: user_action_types.USER_LOGGED_OUT};
};

export function resetPassword(email) {
  return {
    type: user_action_types.RESET_PASSWORD,
    email
  };
};

export function sendMagicLink(email) {
  return {
    type: user_action_types.SEND_MAGIC_LINK,
    email
  };
};

export function updateUserPassword(password, resetToken) {
  return {
    type: user_action_types.UPDATE_PASSWORD,
    password,
    resetToken
  };
};

export function updateUser(user) {
  return {
    type: user_action_types.UPDATE_USER,
    user
  };
};

export function toggleUserRole(user, role) {
  return {
    type: user_action_types.TOGGLE_USER_ROLE,
    user,
    role
  };
};

export function selectUserAccount(user) {
  return {
    type: user_action_types.SELECT_USER_ACCOUNT,
    user
  };
};

export function selectUserAccountByMemberUserKey(memberUserKey) {
  return {
    type: user_action_types.SELECT_USER_ACCOUNT_BY_MEMBER_USER_KEY,
    memberUserKey
  };
};
