import {user_action_types} from '../actions/user-actions.js'
import {NotificationManager} from 'react-notifications';

const initialState = {
  userData: undefined
};

let userApp = function(state = initialState, action) {
  switch (action.type) {
    case user_action_types.CACHE_USER_DATA:
      return Object.assign({}, state, {
        userData: action.userData
      });
    default:
      return state;
  }
}


export default userApp;
