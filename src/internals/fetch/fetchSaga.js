import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {REDUX_ACTIONS} from './constants';
import {fetchHandler} from './sagaHandlers';


let preProcessors = [];

/**
 * Pre process the corresponding fetch metadata entry with previously registered pre processors
 * @param entry - fetch metadata entry
 */
function preProcess(entry) {
  return preProcessors.reduce((processedEntry, {flag, handler})=>{
    if (entry[flag]) {
      return handler(processedEntry);
    }
  }, entry);
}

/**
 * Register a middleware to modify the metadata entry before making the fetch call
 * @param flag - a flag to check if we need to call the handler or not
 * @param handler - pre processor to do exactly what it means
 */
export function registerPreProcessor(flag, handler) {
  preProcessors.push({
    flag,
    handler
  })
}

/**
 * Saga Side-Effects Handler
 * @param {object} metadata - fetch metadata object
 * @param {string} metadata.key - key of the request type to get required metadata for the request
 * @param {object} metadata.payload - fetch body or params
 * @param {object} action - redux action
 */
function* fetchActionHandler(metadata, action) {

  let fetchStatus;
  let entry = metadata[action.key];

  // Handle the fetch call
  try {
    const reply = yield call(fetchHandler, preProcess(entry), action.payload);

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

    // Save fetch status to redirect later
    fetchStatus = true;

  } catch (error) {
    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_FAILED});

    // Fire reply action from metadata. Here we pass the error instead of payload
    yield put({
      type: error.replyAction,
      error: error.err,
      args: {...action.payload, ...action.args}
    });

    // Save fetch status to redirect later
    fetchStatus = false;
  }

  if (fetchStatus === true && entry.successRedirect) {
    put(push(entry.successRedirect ));
  } else if (entry.failureRedirect){
    put(push(entry.failureRedirect ));
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