import {TODO_ACTION_TYPES} from '../actions/todo-actions.js'

const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
];

export default function todos(state = initialState, action) {
  switch (action.type) {
    case TODO_ACTION_TYPES.ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        },
        ...state
      ];

    case TODO_ACTION_TYPES.DELETE_TODO:
      return state.filter(todo =>
        todo.id !== action.id
      );

    case TODO_ACTION_TYPES.EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, {text: action.text}) :
          todo
      );

    case TODO_ACTION_TYPES.COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ?
          Object.assign({}, todo, {completed: !todo.completed}) :
          todo
      );

    case TODO_ACTION_TYPES.COMPLETE_ALL_TODOS: {
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => Object.assign({}, todo, {
        completed: !areAllMarked
      }));
    }

    case TODO_ACTION_TYPES.CLEAR_COMPLETED_TODOS:
      return state.filter(todo => todo.completed === false);

    default:
      return state;
  }
}
