import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

// I don't think this is used 6/8/2018 RZ import promiseMiddleware from '../middleware/promiseMiddleware';
import dataService from '../middleware/dataService';
import socketIoMiddleware from '../middleware/socketIoMiddleware';

import createSagaMiddleware from 'redux-saga'
import rootSaga from '../middleware/pollingSaga'
const sagaMiddleware = createSagaMiddleware();

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

  const enhancers = composeWithDevTools(
    applyMiddleware(dataService, socketIoMiddleware, sagaMiddleware),
    persistState(storage, 'redux-localstorage')
  );

  const store = createStore(
    reducer,
    {},
    enhancers
  );

  sagaMiddleware.run(rootSaga)

  if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default;
        store.replaceReducer(nextReducer);
      });
  }

  return store;

}
