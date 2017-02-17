export const user_action_types = {
  CACHE_USER_DATA: 'CACHE_USER_DATA'
};

export function cacheUserData(userData) {
  return {
    type: user_action_types.CACHE_USER_DATA,
    userData
  };
}
