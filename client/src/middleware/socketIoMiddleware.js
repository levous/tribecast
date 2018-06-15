import {member_action_types, member_data_sources} from '../actions/member-actions';
import {user_action_types} from '../actions/user-actions';
import Auth from '../modules/Auth';
import Logger from '../modules/Logger';

const socketIoMiddleware = store => {

  const auth = new Auth(store);
  // socket IO
  const socket = io();
  socket.on('init', payload => console.log(payload));
  socket.on('member:update', payload => {
    const data = payload.data;
    // TODO: enahnce this to allow the editing user to passed along.  If an edit is received on a record being edited, notify the user who is editing it.
    if(data.editingUserID !== auth.loggedInUserID()){
      store.dispatch({
        type: member_action_types.UPDATE_SUCCESS_RECEIVED,
        id:  data.member.id,
        member: data.member
      });
    }
  });
  socket.on('member:delete', payload => {
    
    const data = payload.data;
    // TODO: enahnce this to allow the editing user to passed along.  If an edit is received on a record being edited, notify the user who is editing it.
    if(data.editingUserID !== auth.loggedInUserID()){
      store.dispatch({
        type: member_action_types.DELETE_SUCCESS_RECEIVED,
        id:  data.memberId
      });
      Logger.logInfo({source: 'socketIoMiddleware:member:delete', description: 'delete notification', payload: payload});
    }
  });
  socket.on('member:new', payload => {
    Logger.logInfo({source: 'socketIoMiddleware:member:new', description: 'delete notification', payload: payload});
  });




  return (next => action => {
    // Pass all actions through by default
    next(action);

    switch (action.type) {

      // Get all members
      case user_action_types.USER_LOGGED_IN:
        if(action.userData.roles && action.userData.roles.length) store.dispatch({type: member_action_types.GET_ALL});

        socket.emit('login');
        return next(action);
      // Already passed action along so no need to pass through again.
      default:
        return;
    }
  });
};

export default socketIoMiddleware;
