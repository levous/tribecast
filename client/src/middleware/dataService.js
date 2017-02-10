// dataService as middleware adapted from this awesome article: http://rabbitfighter.net/?p=1137 derived from this awesome article: http://www.sohamkamani.com/blog/2016/06/05/redux-apis/
//  and this git repos: https://github.com/rabbitfighter81/yodagram

import fetch from 'isomorphic-fetch';
import Auth from '../modules/Auth';
import ApiResponseHandler from '../modules/api-response-handler';
import {member_action_types, member_data_sources} from '../actions/member-actions';

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
      .then(ApiResponseHandler.handleFetchResponse)
      .then(apiResponse => {
        if(apiResponse.error) return Promise.reject(apiResponse.error);
        return apiResponse.json;
      })
      .then(responseJson => {
        const members = responseJson.data;

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

    case member_action_types.ADD:
      //TODO: Discuss: Should this instead just be an origin_id?  Persist that with the document?  tempId works but smells funny
      const tempId = action.member.id;
      return fetch('/api/members', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(action.member)
      })
      .then(ApiResponseHandler.handleFetchResponse)
      .then(apiResponse => {
        if(apiResponse.error) return Promise.reject(apiResponse.error);
        return apiResponse.json;
      })
      .then(responseJson => {
        let newMember = responseJson.data;

        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: tempId,
          member: newMember
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });

    case member_action_types.UPDATE:
    //TODO: Fix this so it works.  Only update when datasource is API
      /*if(action.member_data_sources !== member_data_sources.API){
        return Promise.resolve().then({
          return next();
        });
      }*/

      const member = action.member;
      return fetch(`/api/members/${member._id}`, {
        method: 'put',
        headers: authHeaders,
        body: JSON.stringify(member)
      })
      .then(ApiResponseHandler.handleFetchResponse)
      .then(apiResponse => {
        if(apiResponse.error) return Promise.reject(apiResponse.error);
        return apiResponse.json;
      })
      .then(responseJson => {
        let updatedMember = responseJson.data;
        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: updatedMember._id,
          member: updatedMember
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    case member_action_types.UPLOAD_PUBLISH:

      return fetch(`/api/members/publish`, {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(action.members)
      })
      .then(ApiResponseHandler.handleFetchResponse)
      .then(apiResponse => {
        if(apiResponse.error) return Promise.reject(apiResponse.error);
        return apiResponse.json;
      })
      .then(responseJson => {
        let updatedMember = responseJson.data;
        return next({
          type: member_action_types.GET_ALL
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
      // Default case allows all other actions to pass through...
    default:
      break;
  }

};

export default dataService;
