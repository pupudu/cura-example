import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {REDUX_ACTIONS} from './constants';
import {fetchHandler, redirectHandler} from './sagaHandlers';


/**
 * Saga Side-Effects Handler
 * @param {object} metadata - fetch metadata object
 * @param {object} action - redux action
 */
function* fetchActionHandler(metadata, action) {

  let redirectUrl;

  // Handle the fetch call
  try {
    const reply = yield call(fetchHandler, metadata, action);

    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_SUCCESS});

    // Fire reply action from metadata
    yield put({
      type: reply.replyAction,
      payload: reply.res,
      args: {...action.payload, ...action.args}
    });

    // Call post fetch handler, if provided
    if (action.postAction) {
      yield call(action.postAction, action.payload, reply.res);
    }

    // Handle redirection with status set to true
    redirectUrl = yield call(redirectHandler, true, metadata, action);

  } catch (error) {
    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_FAILED});

    // Fire reply action from metadata. Here we pass the error instead of payload
    yield put({
      type: error.replyAction,
      error: error.err,
      args: {...action.payload, ...action.args}
    });

    // Handle redirection with status set to false
    redirectUrl = yield call(redirectHandler, false, metadata, action);
  }

  put(push(redirectUrl));
}

/**
 * Saga: Capture all FETCH actions to handle side-effects
 */
export function createFetchSaga(metadata) {
  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }
  return function* takeEveryFetchSaga() {
    yield takeEvery(REDUX_ACTIONS.FETCH, fetchActionHandler, metadata);
  }
}

/**
 * Saga: Capture the last FETCH_LAST action to handle side-effects
 */
export function createFetchLatestSaga(metadata) {
  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }
  return function* takeLatestFetchSaga() {
    yield takeLatest(REDUX_ACTIONS.FETCH_LATEST, fetchActionHandler, metadata);
  }
}

export default createFetchSaga;