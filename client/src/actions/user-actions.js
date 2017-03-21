export const user_action_types = {
  CACHE_USER_DATA: 'CACHE_USER_DATA',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD'
};

export function cacheUserData(userData) {
  return {
    type: user_action_types.CACHE_USER_DATA,
    userData
  };
}

export function updateUserPassword(password, resetToken) {
  return {
    type: user_action_types.UPDATE_PASSWORD,
    password,
    resetToken
  };
}
