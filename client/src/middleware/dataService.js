// dataService as middleware adapted from this awesome article: http://rabbitfighter.net/?p=1137 derived from this awesome article: http://www.sohamkamani.com/blog/2016/06/05/redux-apis/
//  and this git repos: https://github.com/rabbitfighter81/yodagram

import fetch from 'isomorphic-fetch';
import Auth from '../modules/Auth';
import ApiResponseHandler from '../modules/api-response-handler';
import {member_action_types, member_data_sources} from '../actions/member-actions';
import errors from 'restify-errors';

const membersApiURL = '/api/members';

const dataService = store => next => action => {
  // Pass all actions through by default
  next(action);

  const auth = new Auth(store);

  const authToken = auth.getToken();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + authToken
  };

  switch (action.type) {

    // Get all members
    case member_action_types.GET_ALL:
      if(!auth.isUserAuthorizedToView()){
        return next({
          type: member_action_types.MEMBER_DATA_FAILED,
          err: new errors.NotAuthorizedError('Sorry, you aren\'t authorized to view the server records.')
        });
      }
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

      // only dispatch api call if data source is API
      if(store.getState().memberApp.dataSource !== member_data_sources.API) {
        return Promise.resolve();
      }

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

      return fetch('/api/members/publish', {
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

        store.dispatch({type: member_action_types.GET_ALL})
        return next(action);
      })
      .catch(err => {
        //TODO: this can't be right.  Desired result: stop current action and dispatch the failure action immediately
        store.dispatch({type: member_action_types.UPDATE_FAILURE_RECEIVED, err});
        return Promise.reject(err)
      });

      case member_action_types.ASSIGN_USER_MEMBER:

        // only dispatch api call if data source is API
        if(store.getState().memberApp.dataSource !== member_data_sources.API) {
          const unpublishedMembersError = new errors.PreconditionFailedError('Cannot assign a member to a user using unpublished member.  Publish or cancel any imports first or refresh members from the server.');
          return Promise.reject(unpublishedMembersError);
        }

        const userMember = action.member;
        return fetch('/api/me/assign-user-member', {
          method: 'post',
          headers: authHeaders,
          body: {memberId: userMember.id}
        })
        .then(ApiResponseHandler.handleFetchResponse)
        .then(apiResponse => {
          if(apiResponse.error) return Promise.reject(apiResponse.error);
          return apiResponse.json;
        })
        .then(responseJson => {
          // nothing to do
          return next(action);
        })
        .catch(err => {
          // need something more specific?
          return next({
            type: member_action_types.UPDATE_FAILURE_RECEIVED,
            err
          });
        });
    case member_action_types.UPLOAD_DATA_REQUEST_MATCH_CHECK:

      const members = JSON.stringify(store.getState().memberApp.members);

      return fetch('api/members/match-check', {
        method: 'post',
        headers: authHeaders,
        body: members
      })
      .then(ApiResponseHandler.handleFetchResponse)
      .then(apiResponse => {
        if(apiResponse.error) return Promise.reject(apiResponse.error);
        return apiResponse.json;
      })
      .then(responseJson => {
        // nothing to do
        console.log('response', responseJson);
        return next(action);
      })
      .catch(err => {
        // need something more specific?
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });

      return next(action);
    // Default case allows all other actions to pass through...
    default:
      return next(action);
  }

};

export default dataService;
