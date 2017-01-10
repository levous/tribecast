import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import thunk from 'redux-thunk';
import promiseMiddleware from '../middleware/promiseMiddleware'

const finalCreateStore = compose(
  applyMiddleware(thunk, promiseMiddleware)
)(createStore);

export default function configureStore(initialState) {
    /*const reducer = compose(
        mergePersistedState()
    )(rootReducer, initialState);

    const storage = adapter(window.localStorage);

    const createPersistentStore = compose(
        persistState(storage, 'state')
    )(createStore);

    const store = createPersistentStore(reducer);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
          const nextReducer = require('../reducers').default;
          store.replaceReducer(nextReducer);
        });
    }*/

// bail
    const store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers');
        store.replaceReducer(nextRootReducer);
      });
    }

    return store;
}
