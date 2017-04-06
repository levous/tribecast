// dataService as middleware adapted from this awesome article: http://rabbitfighter.net/?p=1137 derived from this awesome article: http://www.sohamkamani.com/blog/2016/06/05/redux-apis/
//  and this git repos: https://github.com/rabbitfighter81/yodagram

import fetch from 'isomorphic-fetch';
import Auth from '../modules/Auth';
import ApiResponseHandler from '../modules/api-response-handler';
import {member_action_types, member_data_sources} from '../actions/member-actions';
import {user_action_types} from '../actions/user-actions';
import errors from 'restify-errors';

const membersApiURL = '/api/members';

const dataService = store => next => action => {

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
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        const members = responseJson.data;
        console.log('members', members);
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
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
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
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
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
      const publishMembers = action.members.map(member => {
        if(member.apiMatch && member.apiMatch.apiRecord) return Object.assign(member, {_id: member.apiMatch.apiRecord._id, recordOriginNote: `${member.apiMatch.apiRecord.recordOriginNote}\n${member.importNote}`})
        return Object.assign(member, {recordOriginNote: member.importNote});
      });
      return fetch('/api/members/publish', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(publishMembers)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let updatedMember = responseJson.data;

        store.dispatch({type: member_action_types.GET_ALL});
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
          body: JSON.stringify({memberId: userMember.id})
        })
        .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
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

    case member_action_types.INVITE_MEMBER:
      
      // only dispatch api call if data source is API
      if(store.getState().memberApp.dataSource !== member_data_sources.API) {
        const unpublishedMembersError = new errors.PreconditionFailedError('Cannot invite a member using unpublished member.  Publish or cancel any imports first or refresh members from the server.');
        return Promise.reject(unpublishedMembersError);
      }

      const inviteMember = action.member;
      return fetch('/api/members/generate-invite', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify({email: inviteMember.email})
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        store.dispatch({type: member_action_types.INVITE_MEMBER_RESPONSE_RECEIVED, inviteResponse: responseJson});
        return next(action);
      })
      .catch(err => {
        // need something more specific?
        return next({
          //TODO: better failure respone
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    case member_action_types.UPLOAD_DATA_REQUEST_MATCH_CHECK:

      const members = store.getState().memberApp.members;

      return fetch('api/members/match-check', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(members)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        // nothing to do
        store.dispatch({type: member_action_types.UPLOAD_DATA_RECEIVE_MATCH_CHECK, matchResponse: responseJson})
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

    case user_action_types.UPDATE_PASSWORD:
      const {password, resetToken} = action;
      const jsonBody = {newPassword: password};
      console.log('json', jsonBody);

      return fetch(`/auth/reset/${resetToken}`, {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(jsonBody)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        const message = responseJson.message;
        return next(action);
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });

    // Already passed action along so no need to pass through again.
    default:
      return;
  }

};

export default dataService;
