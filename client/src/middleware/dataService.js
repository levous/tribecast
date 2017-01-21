// dataService as middleware adapted from this awesome article: http://rabbitfighter.net/?p=1137 derived from this awesome article: http://www.sohamkamani.com/blog/2016/06/05/redux-apis/
//  and this git repos: https://github.com/rabbitfighter81/yodagram

import fetch from 'isomorphic-fetch';
import Auth from '../modules/Auth';
import {member_action_types} from '../actions/member-actions';

const membersApiURL = '/api/members';

const dataService = store => next => action => {
  // Pass all actions through by default
  next(action);

  const authToken = Auth.getToken();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + authToken
  };

  switch (action.type) {
    // Get all members
    case member_action_types.GET_ALL:
      return fetch('/api/members', {
        method: 'get',
        headers: authHeaders
      })
      .then(response => {
        if (response.status >= 400) {
          // send get members failed action
          //TODO: response.json() is a promise.  No worky... Need to think this through :)
          const err = response.json();
          console.log(err);
          return next({
            type: member_action_types.MEMBER_DATA_FAILED,
            err
          });
        }
        return response.json();
      })
      .then(responseJson => {
        const members = responseJson.data;
        console.log(members);
        return next({
          type: member_action_types.MEMBER_DATA_RECEIVED,
          members
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.MEMBER_DATA_FAILED,
          err
        });
      });
      break;
    case member_action_types.UPDATE:
      const member = action.member;
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
        let updatedMember = responseJson.data;
        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: updatedMember._id,
          member: updatedMember
        });
      })
      .catch(error => {throw error});

      // Default case allows all other actions to pass through...
    default:
      break;
  }

};

export default dataService;
