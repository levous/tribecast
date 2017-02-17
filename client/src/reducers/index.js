import {combineReducers} from 'redux';

import memberApp from './members';
import userApp from './users';

const rootReducer = combineReducers({
  memberApp,
  userApp
});

export default rootReducer;
