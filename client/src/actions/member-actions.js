export const MEMBER_ACTION_TYPES = {
  ADD: 'ADD_MEMBER',
  UPDATE: 'UPDATE',
  SELECT_MEMBER: 'SELECT_MEMBER'
};

export function updateMember(member){
  return {type: MEMBER_ACTION_TYPES.UPDATE, member};
}

export function selectMember(member){
  return {type: MEMBER_ACTION_TYPES.SELECT_MEMBER, member};
}
