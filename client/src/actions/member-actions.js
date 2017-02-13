
import fetch from 'isomorphic-fetch';
import {NotificationManager} from 'react-notifications';
import Auth from '../modules/Auth';

export const member_action_types = {
  ADD: 'ADD_MEMBER',
  UPDATE: 'UPDATE_MEMBER',
  SELECT_MEMBER: 'SELECT_MEMBER',
  GET_ALL: 'GET_MEMBERS',
  MEMBER_DATA_RECEIVED: 'MEMBER_DATA_RECEIVED',
  UPLOAD_DATA_RECEIVED: 'UPLOAD_DATA_RECEIVED',
  UPLOAD_PUBLISH: 'UPLOAD_PUBLISH',
  MEMBER_DATA_FAILED: 'MEMBER_DATA_FAILED',
  UPDATE_SUCCESS_RECEIVED: 'MEMBER_UPDATE_SUCCESS',
  UPDATE_FAILURE_RECEIVED: 'MEMBER_UPDATE_FAILURE',
  CACHE_USER_DATA: 'CACHE_USER_DATA',
  ASSIGN_USER_MEMBER: 'ASSIGN_USER_MEMBER'
};

export const member_data_sources = {
  SEED: 'SEED',
  CSV_IMPORT: 'IMPORT',
  API: 'API'
}

export function addMember(member) {
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

export function importCsv(data){
  return {type: member_action_types.UPLOAD_DATA_RECEIVED, data};
}

export function publishMembers(members){
  return {type: member_action_types.UPLOAD_PUBLISH, members};
}

export function refreshMembersFromServer() {
  return {
    type: member_action_types.GET_ALL
  };
}

//TODO: should this really be in member actions?
export function cacheUserData(userData) {
  return {
    type: member_action_types.CACHE_USER_DATA,
    userData
  };
}

export function assignUserMember(member){
  return {type: member_action_types.ASSIGN_USER_MEMBER, member};
}
