export const TODO_ACTION_TYPES = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  COMPLETE_TODO: 'COMPLETE_TODO',
  COMPLETE_ALL_TODOS: 'COMPLETE_ALL_TODOS',
  CLEAR_COMPLETED_TODOS: 'CLEAR_COMPLETED_TODOS'
};



export function addTodo(text) {
  return {type: types.ADD_TODO, text};
}

export function deleteTodo(id) {
  return {type: types.DELETE_TODO, id};
}

export function editTodo(id, text) {
  return {type: types.EDIT_TODO, id, text};
}

export function completeTodo(id) {
  return {type: types.COMPLETE_TODO, id};
}

export function completeAll() {
  return {type: types.COMPLETE_ALL};
}

export function clearCompleted() {
  return {type: types.CLEAR_COMPLETED};
}
