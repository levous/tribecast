
export const member_action_types = {
  ADD: 'ADD_MEMBER',
  UPDATE: 'UPDATE_MEMBER',
  DELETE: 'DELETE_MEMBER',
  UPDATE_PROFILE_IMAGE: 'UPDATE_PROFILE_IMAGE',
  SELECT_MEMBER: 'SELECT_MEMBER',
  GET_ALL: 'GET_MEMBERS',
  MEMBER_DATA_RECEIVED: 'MEMBER_DATA_RECEIVED',
  UPLOAD_DATA_RECEIVED: 'MEMBER_UPLOAD_DATA_RECEIVED',
  UPLOAD_PUBLISH: 'MEMBER_UPLOAD_PUBLISH',
  MEMBER_DATA_FAILED: 'MEMBER_DATA_FAILED',
  UPDATE_SUCCESS_RECEIVED: 'MEMBER_UPDATE_SUCCESS',
  DELETE_SUCCESS_RECEIVED: 'DELETE_SUCCESS_RECEIVED',
  UPDATE_FAILURE_RECEIVED: 'MEMBER_UPDATE_FAILURE',
  ASSIGN_USER_MEMBER: 'ASSIGN_USER_MEMBER',
  INVITE_MEMBER: 'INVITE_MEMBER',
  INVITE_MEMBER_RESPONSE_RECEIVED: 'INVITE_MEMBER_RESPONSE_RECEIVED',
  UPLOAD_DATA_REQUEST_MATCH_CHECK: 'MEMBER_UPLOAD_MATCH_CHECK',
  UPLOAD_DATA_RECEIVE_MATCH_CHECK: 'MEMBER_UPLOAD_MATCH_CHECK_RCV',
  CANCEL_LOADING: 'MEMBER_CANCEL_LOADING',
  SET_SORT: 'MEMBER_SET_SORT'
};

export const member_data_sources = {
  SEED: 'SEED',
  CSV_IMPORT: 'IMPORT',
  API: 'API'
}

export const member_sort_keys = {
  NAME: 'NAME',
  ADDRESS: 'ADDRESS'
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

export function deleteMember(member){
  return {type: member_action_types.DELETE, member};
}

export function updateMemberProfileImage(member, thumbnailImage, fullsizeImage, unEditedImage){
  return {type: member_action_types.UPDATE_PROFILE_IMAGE, member, thumbnailImage, fullsizeImage, unEditedImage};
}


export function selectMember(member){
  return {type: member_action_types.SELECT_MEMBER, member};
}

export function importCsv(data, fieldMap, importNote){
  return {type: member_action_types.UPLOAD_DATA_RECEIVED, data, fieldMap, importNote};
}

export function apiMatchCheck(){
  return {type: member_action_types.UPLOAD_DATA_REQUEST_MATCH_CHECK};
}

export function publishMembers(members){
  return {type: member_action_types.UPLOAD_PUBLISH, members};
}

export function refreshMembersFromServer() {
  return {
    type: member_action_types.GET_ALL
  };
}

export function cancelLoading() {
  return {
    type: member_action_types.CANCEL_LOADING
  };
}

export function assignUserMember(member){
  return {type: member_action_types.ASSIGN_USER_MEMBER, member};
}

export function inviteMember(member){
  return {type: member_action_types.INVITE_MEMBER, member};
}

export function setMemberSort(){
  return {type: member_action_types.MEMBER_SET_SORT, sort};
}
