import {call, put, takeEvery, takeLatest, takeLeading} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {REDUX_ACTIONS} from './constants';
import {fetchHandler} from './sagaHandlers';


let preProcessors = [];

/**
 * Pre process the corresponding fetch metadata entry with previously registered pre processors
 * @param entry - fetch metadata entry
 */
function preProcess(entry) {
  return preProcessors.reduce((processedEntry, {flag, handler}) => {
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
 * Dispatch a generic action from provided metadata corresponding to the dispatched fetch action
 *
 * @param {string} type - action type to be dispatched
 * @param {any} payload - response data payload from the fetch
 * @param {object} error - any errors occurred during the fetch
 * @param {object} args - default data provided in metadata to be shipped with the action
 */
function dispatchAction(type, payload, error, args = {}) {
  put({
    type,
    payload,
    error,
    ...args
  });
}

/**
 * Analyze the reply action and dispatch actions from metadata accordingly
 *
 * @param {object} reply - success or failure reply from the fetch handler
 */
function dispatchReplies(reply) {
  if (!reply.replyAction) {
    return;
  }

  // Treat non array replies as an array with one element (to make the preceding code more meaningful)
  let replyActions = Array.isArray(reply.replyAction) ? reply.replyAction : [reply.replyAction];

  replyActions.forEach(replyAction => {

    // If the reply action is a string, we will follow default behavior
    if (typeof replyAction === "string") {
      dispatchAction(replyAction, reply.data, reply.error)
    }

    // If the reply action is an object, and it has a field: "type" we merge it with the dispatched action
    if (typeof replyAction === "object" && replyAction.type) {
      let metadataAction = {...replyAction};
      delete metadataAction.type;
      dispatchAction(replyAction.type, reply.data, reply.error, metadataAction);
    }
  });
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
    yield call(dispatchReplies, reply);

    // Call post fetch handler, if provided
    // Here we do not bind anything besides the response data assuming the post action is a closure
    if (action.postAction) {
      yield call(action.postAction, reply.data);
    }

    // Save fetch status to redirect later
    fetchStatus = true;

  } catch (error) {
    // Fire action to be used by the fetch statuses reducer
    yield put({...action, type: REDUX_ACTIONS.FETCH_FAILED});

    // Fire reply action from metadata. Here we pass the error instead of payload
    yield call(dispatchReplies, error);

    // Save fetch status to redirect later
    fetchStatus = false;
  }

  if (fetchStatus === true && entry.successRedirect) {
    put(push(entry.successRedirect));
  } else if (entry.failureRedirect) {
    put(push(entry.failureRedirect));
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