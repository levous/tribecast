import {user_action_types, user_sort_keys} from '../actions/user-actions';
//TODO: refactor poll actions into a separate reducer
import {poll_action_types} from '../actions/poll-actions';

import {NotificationManager} from 'react-notifications';

const initialState = {
  userData: undefined,
  loginFailureMessage: undefined,
  passwordResetSucceeded: undefined,
  loading: false,
  pollFrequencySeconds: 30
};

const sortComparer = sortKey => {
  switch (sortKey){
    case user_sort_keys.EMAIL:
      return (a, b) => a.email.localeCompare(b.email);
    default: //member_sort_keys.NAME:
      return (a, b) => a.name.localeCompare(b.name);
  }
};

let userApp = function(state = initialState, action) {

  const updateUserInList = (state, user) => {
    const userEmails = state.users.map((u)=>{return u.email});
    // find the index by id
    const targetIndex = userEmails.indexOf(user.email);

    // create a new array, containing updated item, using spread and slice
    return [
        ...state.users.slice(0, targetIndex),
        // ensure unspecified props are not accidentally discarded and that stored object is not mutated
        Object.assign({}, state.users[targetIndex], user),
        ...state.users.slice(targetIndex + 1)
      ];
  };

  switch (action.type) {
    case user_action_types.USER_LOGGED_IN:
      return Object.assign({}, state, {
        userData: action.user,
        passwordResetSucceeded: undefined
      });
    case user_action_types.USER_LOGGED_OUT:
      return Object.assign({}, state, {
        userData: null,
        passwordResetSucceeded: undefined
      });
    case user_action_types.USER_LOG_IN_FAILED:
      const error = action.error;
      return Object.assign({}, state, {
        loginFailureMessage: error.message
      });
    case user_action_types.UPDATE_PASSWORD_SUCCESS:
      NotificationManager.success(action.message);

      return Object.assign({}, state, {
        passwordResetSucceeded: true,
        userData: action.user
      });
    case user_action_types.RESET_PASSWORD:
      return Object.assign({}, state, {
        passwordResetSucceeded: undefined
      });
    case user_action_types.RESET_PASSWORD_RESPONSE_RECEIVED:
      if(action.resetResponse.errors){
        const errorMessage = action.resetResponse.errors[0].detail;
        NotificationManager.error(errorMessage, 'Reset Password Failed', 15000);
      }else{
        NotificationManager.success(`${action.resetResponse.message}\n Please check your email for a reset link. (note: it might take a few minutes)`);
      }
      return state;
    case user_action_types.SELECT_USER_ACCOUNT_BY_MEMBER_USER_KEY: {
      const memberUserKey = action.memberUserKey;
      const selectedUser = state.users.find(u => u.memberUserKey === memberUserKey);
      if(!selectedUser) NotificationManager.warn('User account not found.  The login account may have been deleted');
      
      return Object.assign({}, state, {
        selectedUser: selectedUser
      });
    }
    case user_action_types.SELECT_USER_ACCOUNT:

      return Object.assign({}, state, {
        selectedUser: action.user
      });
    case user_action_types.USER_DATA_RECEIVED:

      NotificationManager.success('Server data loaded');

      const patchedUsers = action.users
        .map(user => Object.assign(user, {id: user.email}))
        .sort(sortComparer(user_sort_keys.NAME));

      return Object.assign({}, state, {
        users: patchedUsers,
        loading: false
      });
    case user_action_types.UPDATE_USER_SUCCESS:

      NotificationManager.success('User Updated Successfully');
      const user = action.user;
      if(!state.users || state.users.length == 0) return Object.assign({}, state, {loading: false});
      const updatedUsers = updateUserInList(state, user);
      let selectedUser = state.selectedUser;
      if(selectedUser && selectedUser.email === user.email ){
        selectedUser = user;
      }

      return Object.assign({}, state, {
        users: updatedUsers,
        selectedUser,
        loading: false
      });

    case user_action_types.USER_DATA_FAILED:
      // when triggered by a throw, accessing the error slows the notification presentation such that it flashes too quickly
      NotificationManager.error(action.err.message, 'Server data load failed with error', 15000);
      return Object.assign({}, state, {
        loading: false
      });

    case user_action_types.CACHE_NEWEST_API_RECORD_SAVED_AT:
      return Object.assign({}, state, {
        newestApiRecordSavedAt: action.newestApiRecordSavedAt
      });

    case poll_action_types.SET_POLL_FREQUENCY_SECONDS:
    console.log('Setting poll frequency to %s', action.seconds)
      return Object.assign({}, state, {
        pollFrequencySeconds: action.seconds
      });
      
    default:
      return state;
  }
}


export default userApp;
