// dataService as middleware adapted from this awesome article: http://rabbitfighter.net/?p=1137 derived from this awesome article: http://www.sohamkamani.com/blog/2016/06/05/redux-apis/
//  and this git repos: https://github.com/rabbitfighter81/yodagram

import fetch from 'isomorphic-fetch';
import qs from 'qs';
import moment from 'moment';
import Auth from '../modules/Auth';
import ApiResponseHandler from '../modules/api-response-handler';
import {member_action_types, member_data_sources} from '../actions/member-actions';
import {user_action_types} from '../actions/user-actions';
import {poll_action_types} from '../actions/poll-actions';
import errors from '../modules/client-errors';

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
        //console.log('members', members);

        // cache the newest save for next check
        const latestSavedAt = store.getState().userApp.newestApiRecordSavedAt || new Date(1975, 1, 1);

        let newestUpdatedAt = members.reduce(
          (newest, member) => newest.isBefore(member.updatedAt) ? moment(member.updatedAt) : newest,
          moment(latestSavedAt)
        ).toDate();

        store.dispatch({type: user_action_types.CACHE_NEWEST_API_RECORD_SAVED_AT, newestApiRecordSavedAt: newestUpdatedAt});
        
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
      return fetch(`/api/members/${member.id}`, {
        method: 'put',
        headers: authHeaders,
        body: JSON.stringify(member)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let updatedMember = responseJson.data;
        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: updatedMember.id,
          member: updatedMember
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    
    case member_action_types.RESET_MEMBER_USER_ACCOUNT:{
      // only dispatch api call if data source is API
      if(store.getState().memberApp.dataSource !== member_data_sources.API) {
        return Promise.resolve();
      }

      const member = action.member;
      return fetch('/api/members/reset-member-user-account', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify({id: member.id})
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let updatedMember = responseJson.data;
 
        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: updatedMember.id,
          member: updatedMember
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    }

    case member_action_types.DELETE:{

      // only dispatch api call if data source is API
      if(store.getState().memberApp.dataSource !== member_data_sources.API) {
        return Promise.resolve();
      }

      const member = action.member;
      return fetch(`/api/members/${member.id}`, {
        method: 'delete',
        headers: authHeaders,
        body: JSON.stringify(member)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let deletedMemberId = responseJson.data.memberId;
        return next({
          type: member_action_types.DELETE_SUCCESS_RECEIVED,
          id: deletedMemberId
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    }
    case member_action_types.UPDATE_PROFILE_IMAGE: {

      // only dispatch api call if data source is API
      if(store.getState().memberApp.dataSource !== member_data_sources.API) {
        return Promise.resolve();
      }

      const member = action.member;
      const url = `/api/members/${member.id}/profile-photo`;
      const formdata = new FormData();
      formdata.append('profile-photo', action.fullsizeImage);
      formdata.append('extra', 'forces multipart');
      const authHeadersNoJson = { 'Authorization': authHeaders.Authorization };
      return fetch(url, {
        method: 'post',
        headers: authHeadersNoJson,
        body: formdata
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let updatedMember = responseJson.data;
        return next({
          type: member_action_types.UPDATE_SUCCESS_RECEIVED,
          id: updatedMember.id,
          member: updatedMember
        });
      })
      .catch(err => {
        return next({
          type: member_action_types.UPDATE_FAILURE_RECEIVED,
          err
        });
      });
    }
    case member_action_types.UPLOAD_PUBLISH:
      const publishMembers = action.members.map(member => {
        
        if(member.apiMatch && member.apiMatch.apiRecord){
          // apply only fields with values that aren't null
          // note: this is only a shallow check
          const newRecord = Object.assign({}, member);
          for(const prop in newRecord){
            if(newRecord[prop] === null){
              delete newRecord[prop];
            }
          }
          const recordOriginNote = `${member.apiMatch.apiRecord.recordOriginNote}\n${member.importNote}`;
          const mergedMember = Object.assign({}, member.apiMatch.apiRecord, newRecord, {recordOriginNote: recordOriginNote});
          return mergedMember;
        }
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
    case user_action_types.GET_ALL:

      if(!auth.isUserAdmin()){
        return next({
          type: user_action_types.USER_DATA_FAILED,
          err: new errors.NotAuthorizedError('Sorry, you aren\'t authorized to view the user records.')
        });
      }
      return fetch('/api/users', {
        method: 'get',
        headers: authHeaders
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        const users = responseJson.data;

        return next({
          type: user_action_types.USER_DATA_RECEIVED,
          users
        });
      })
      .catch(err => {
        return next({
          type: user_action_types.USER_DATA_FAILED,
          err
        });
      });
      break;

    case user_action_types.UPDATE_USER:

      if(!auth.isUserAdmin()){
        return next({
          type: user_action_types.USER_DATA_FAILED,
          err: new errors.NotAuthorizedError('Sorry, you aren\'t authorized to update the user records.')
        });
      }

      const user = action.user;
      return fetch(`/api/users/${user._id}`, {
        method: 'put',
        headers: authHeaders,
        body: JSON.stringify(user)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        let updatedUser = responseJson.data;
        return next({
          type: user_action_types.UPDATE_USER_SUCCESS,
          id: updatedUser.id,
          user: updatedUser
        });
      })
      .catch(err => {
        return next({
          type: user_action_types.USER_DATA_FAILED,
          err
        });
      });

    case user_action_types.LOG_IN_USER:
      const {userData} = action;

      return fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
          email: userData.email,
          password: userData.password
        })
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        auth.authenticateUser(responseJson.token);
        return next({
          type: user_action_types.USER_LOGGED_IN,
          user: responseJson.user
        });
      })
      .catch(err => {
        return next({
          type: user_action_types.USER_LOG_IN_FAILED,
          error: err
        });
      });

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
        auth.authenticateUser(responseJson.token);
        store.dispatch({type: user_action_types.UPDATE_PASSWORD_SUCCESS, user: responseJson.user, message: responseJson.message});
        return next(action);
      })
      .catch(err => {
        return next({
          type: user_action_types.USER_DATA_FAILED,
          err
        });
      });

    case user_action_types.RESET_PASSWORD:

      const accountEmail = action.email;

      return fetch('/auth/forgot-password', {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify({email: accountEmail})
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
        store.dispatch({type: user_action_types.RESET_PASSWORD_RESPONSE_RECEIVED, resetResponse: responseJson});
        return next(action);
      })
      .catch(err => {
        // need something more specific?
        return next({
          //TODO: better failure respone
          type: user_action_types.USER_DATA_FAILED,
          err
        });
      });


    case user_action_types.TOGGLE_USER_ROLE: {
      const {user, role} = action;
      const jsonBody = {
        email: user.email,
        role: role
      };

      const apiEndPoint = user.roles.includes(role) ? '/api/users/remove-user-from-role' : '/api/users/assign-user-to-role'

      return fetch(apiEndPoint,
        {
          method: 'post',
          headers: authHeaders,
          body: JSON.stringify(jsonBody)
        })
        .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
        .then(responseJson => {

          const message = responseJson.message;
          user.roles = responseJson.data;
          store.dispatch({type: user_action_types.UPDATE_USER_SUCCESS, user: user});
          return next(action);
        })
        .catch(err => {

          return next({
            type: user_action_types.USER_DATA_FAILED,
            err
          });
        });
    }

    case poll_action_types.DISPATCH_API_SYNC: {
      const state = store.getState()
      // don't check api if data source is not API
      if(state.memberApp.dataSource !== member_data_sources.API) return Promise.resolve()
      // retrieve cached date or default to very long ago
      const jsonBody = {
        since: state.userApp.newestApiRecordSavedAt || new Date(1975, 1, 1)
      }

      return fetch('/api/updates-since',
      {
        method: 'post',
        headers: authHeaders,
        body: JSON.stringify(jsonBody)
      })
      .then(ApiResponseHandler.handleFetchResponseRejectOrJson)
      .then(responseJson => {
       
        const message = responseJson.message
        const members = responseJson.members
        const users = responseJson.users
        // find the most recent member updatedAt
        let newestUpdatedAt = members.reduce(
          (newest, member) => newest.isBefore(member.updatedAt) ? moment(member.updatedAt) : newest,
          moment(jsonBody.since)
        )

        // find the most recent overall updatedAt
        newestUpdatedAt = users.reduce(
          (newest, user) => newest.isBefore(user.updatedAt) ? moment(user.updatedAt) : newest,
          newestUpdatedAt
        ).toDate()
        // send users and/or members received

        // cache the newest save for next check
        store.dispatch({type: user_action_types.CACHE_NEWEST_API_RECORD_SAVED_AT, newestApiRecordSavedAt: newestUpdatedAt});
        return next(action);
      })
      /*.catch(err => {
        //HACK: NotificationManager should probably be wired as middleware and sent messages explicitly.
        // for now, use member action types to send failure
        return next({
          type: member_action_types.MEMBER_DATA_FAILED,
          err
        })
      })*/
    }
    // Already passed action along so no need to pass through again.
    default:
      return;
    }
};

export default dataService;
