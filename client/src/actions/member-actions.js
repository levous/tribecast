
import fetch from 'isomorphic-fetch';
import Auth from '../modules/Auth';

export const member_action_types = {
  ADD: 'ADD_MEMBER',
  UPDATE: 'UPDATE_MEMBER',
  SELECT_MEMBER: 'SELECT_MEMBER'
};

function addMember(member) {
  return {
    type: member_action_types.ADD,
    member: member
  };
}

export function updateMember(member){
  return {type: member_action_types.UPDATE, member};
}

export function selectMember(member){
  return {type: member_action_types.SELECT_MEMBER, member};
}

export function createMember(member) {
  return dispatch => {
    debugger;
    dispatch(addMember(member));
    const auth_token = Auth.getToken();

    return fetch('/api/members', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify({'data': member})
    })
    .then(result => {
      console.log(result);
      debugger;
    }) //TODO: remove this "then()"
    .catch(error => {throw error});
  }
}
