import {all, call, put, takeEvery, takeLatest, takeLeading} from 'redux-saga/effects';
import {REDUX_ACTIONS} from '../constants';
import {doFetch, getReplyActions} from './fetchHandlers';
import {preProcess} from './preProcess';


/**
 * Saga Side-Effects Handler
 * @param {object} metadata - fetch metadata object
 * @param {string} metadata.key - key of the request type to get required metadata for the request
 * @param {object} metadata.payload - fetch body or params
 * @param {object} action - redux action
 */
function* fetchActionHandler(metadata, action) {

  let reply = {};
  let err = null;
  let entry = metadata[action.key];

  // Handle the fetch call
  try {
    // Dispatch INIT action to signal the supporting reducers/middleware if any
    yield put({...action, type: REDUX_ACTIONS.FETCH_INIT});

    reply = yield call(doFetch, preProcess(entry), action.payload);

    // If the code reaches this point, rather than going to the catch, that is an indication that the fetch is a success
    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_SUCCESS});

    // Fire reply action(s) from metadata
    let replyActions = yield call(getReplyActions, reply);
    yield all(replyActions.map(action => put(action)));

  } catch (error) {
    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_FAILED});

    // Fire reply action from metadata. Here we pass the error instead of payload
    let replyActions = yield call(getReplyActions, error);
    yield all(replyActions.map(action => put(action)));

    // Save error to conditionally redirect later
    err = error;
  }

  // Call post fetch handler callback, if provided
  // Here we do not bind anything besides the response error data assuming the post action is a closure
  if (action.callback) {
    yield call(action.callback, err, reply.data);
  }
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
 * Saga: Capture the last FETCH_LATEST action to handle side-effects
 */
export function createFetchLatestSaga(metadata) {
  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }
  return function* takeLatestFetchSaga() {
    yield takeLatest(REDUX_ACTIONS.FETCH_LATEST, fetchActionHandler, metadata);
  }
}


/**
 * Saga: Capture the last FETCH_LEADING action to handle side-effects
 */
export function createFetchLeadingSaga(metadata) {
  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }
  return function* takeLatestFetchSaga() {
    yield takeLeading(REDUX_ACTIONS.FETCH_LEADING, fetchActionHandler, metadata);
  }
}

export default createFetchSaga;
