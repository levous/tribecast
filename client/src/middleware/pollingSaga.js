import { delay, takeEvery } from 'redux-saga'
import { all, call, put, take, race, select } from 'redux-saga/effects'
import { poll_action_types, dispatchApiSync, apiSyncFailure } from '../actions/poll-actions'

export function* apiSync() {
  yield put(dispatchApiSync())
}

function* watchRequestApiSync() {
  yield takeEvery(poll_action_types.REQUEST_API_SYNC, apiSync)
}

/**
 * Saga worker.
 */
function* pollSaga(action) {
  while (true) {
    try {
      
      yield call(apiSync)
      const pollFrequencySeconds = yield select(state => state.userApp.pollFrequencySeconds)
      console.log('poll seconds', pollFrequencySeconds)
      yield call(delay, ((pollFrequencySeconds || 120) * 1000))
      
    } catch (err) {
     
      yield put(apiSyncFailure(err))
      
      yield call(delay, 1000)
      
    }
  }
}

/**
 * Saga watcher.
 */
function* watchPollSaga() {
	while (true) {
    yield take(poll_action_types.POLL_START);
    console.log('received start poll')
    yield race([
      call(pollSaga),
      take(poll_action_types.POLL_STOP)
    ]);
  }
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    watchPollSaga()
  ])
}