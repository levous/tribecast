import { put, takeEvery, all } from 'redux-saga/effects'
import {poll_action_types, dispatchApiSync} from '../actions/poll-actions'

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
      yield call(apiSync());
      yield call(delay, 4000);
    } catch (err) {
      yield put(getDataFailureAction(err));
    }
  }
}

/**
 * Saga watcher.
 */
function* watchPollSaga() {
	while (true) {
  	yield take(poll_action_types.POLL_START);
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