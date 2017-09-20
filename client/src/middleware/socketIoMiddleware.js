import {member_action_types, member_data_sources} from '../actions/member-actions';
import {user_action_types} from '../actions/user-actions';



const socketIoMiddleware = store => {

  // socket IO
  const socket = io();
  socket.on('init', data => console.log(data));
  socket.on('member:update', data => {
    console.log(data);
  });
  socket.on('member:new', data => {
    console.log(data);
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
