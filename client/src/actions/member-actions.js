
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
  MEMBER_DATA_FAILED: 'MEMBER_DATA_FAILED',
  UPDATE_SUCCESS_RECEIVED: 'MEMBER_UPDATE_SUCCESS',
  UPDATE_FAILURE_RECEIVED: 'MEMBER_UPDATE_FAILURE'
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

export function refreshMembersFromServer() {
  return {
    type: member_action_types.GET_ALL
  };
}
