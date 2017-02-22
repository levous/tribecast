import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import persistState, {mergePersistedState} from 'redux-localstorage';
// import filter from 'redux-localstorage-filter';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import thunk from 'redux-thunk';
import promiseMiddleware from '../middleware/promiseMiddleware'
import dataService from '../middleware/dataService';

 
export default function configureStore() {

  /*
    Store
    Redux apps have a single store which takes
    1. All Reducers which we combined into `rootReducer`
    2. An optional starting state - similar to React's getInitialState
  */

  //TODO: helful to add Chrome dev tools?
  /*
  // Chrome dev tools
  window.devToolsExtension ? window.devToolsExtension() : f => f
  */

  // use local storage for locally persisted state
  const reducer = compose(
      mergePersistedState()
  )(rootReducer); // no initial state needed

  const storage = compose()(adapter(window.localStorage));

  const enhancers = compose(
    applyMiddleware(dataService, thunk, promiseMiddleware),
    persistState(storage, 'redux-localstorage'),
    (process.env.NODE_ENV !== 'production' && window.devToolsExtension) ? window.devToolsExtension() : f => f
  );

  const store = createStore(
    reducer,
    {},
    enhancers
  );

  if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default;
        store.replaceReducer(nextReducer);
      });
  }

  return store;

}
