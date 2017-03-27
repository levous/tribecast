import {user_action_types} from '../actions/user-actions.js';
import {NotificationManager} from 'react-notifications';

const initialState = {
  userData: undefined
};

let userApp = function(state = initialState, action) {
  switch (action.type) {
    case user_action_types.USER_LOGGED_IN:
      return Object.assign({}, state, {
        userData: action.userData
      });
    case user_action_types.USER_LOGGED_OUT:
      return Object.assign({}, state, {
        userData: null
      });
    default:
      return state;
  }
}


export default userApp;
