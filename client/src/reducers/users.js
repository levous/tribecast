  import {user_action_types} from '../actions/user-actions.js';
import {NotificationManager} from 'react-notifications';

const initialState = {
  userData: undefined,
  passwordResetSucceeded: undefined
};

let userApp = function(state = initialState, action) {
  switch (action.type) {
    case user_action_types.USER_LOGGED_IN:
      return Object.assign({}, state, {
        userData: action.userData,
        passwordResetSucceeded: undefined
      });
    case user_action_types.USER_LOGGED_OUT:
      return Object.assign({}, state, {
        userData: null,
        passwordResetSucceeded: undefined
      });
    case user_action_types.UPDATE_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        passwordResetSucceeded: true
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
        NotificationManager.success(`${action.resetResponse.message}\n Please check your email for a reset link.`);
      }
      return state;
    case user_action_types.SELECT_USER_ACCOUNT:
      
      return Object.assign({}, state, {
        selectedUser: action.user
      });
    default:
      return state;
  }
}


export default userApp;
