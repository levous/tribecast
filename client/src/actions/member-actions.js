
import fetch from 'isomorphic-fetch';
import {NotificationManager} from 'react-notifications';
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
    const tempId = member.id;
    dispatch(addMember(member));
    const auth_token = Auth.getToken();
    //TODO: refactor into MemberStore
    return fetch('/api/members', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify(member)
    })
    .then(response => {
      if (response.status >= 400) {
        NotificationManager.error(`${member.firstName} ${member.lastName} server save failed!`);
        console.log(response.json());
        throw new Error("Bad response from server");
      }
      //dispatch(addMember(newMember));
      return response.json();
    })
    .then(responseJson => {
      let newMember = responseJson.data;
      console.log('update', newMember);
      if(!newMember.id) newMember.id = tempId;
      dispatch(updateMember(newMember));
      NotificationManager.success(`${member.firstName} ${member.lastName} server saved!`);
    })
    .catch(error => {
      throw error;
    });
  }
}

export function saveMember(member) {
  return dispatch => {
    dispatch(updateMember(member));
    const auth_token = Auth.getToken();
    //TODO: refactor into MemberStore
    return fetch(`/api/members/${member._id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify(member)
    })
    .then(response => {
      if (response.status >= 400) {
        NotificationManager.error(`${member.firstName} ${member.lastName} server save failed!`);
        console.log(response.json());
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(responseJson => {
      let newMember = responseJson.data;
      dispatch(updateMember(newMember));
      NotificationManager.success(`${member.firstName} ${member.lastName} server saved!`);
    })
    .catch(error => {throw error});
  }
}
