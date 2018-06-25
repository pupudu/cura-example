import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'connected-react-router';

import fetch from './fetchApi';
import {REDUX_ACTIONS, HTTP_METHODS, HTTP_CODES} from './constants';


/**
 * Perform a fetch based on the meta data available corresponding to the request type
 *
 * @param {object} metadata - fetch metadata object
 * @param {string} key - key of the request type to get required metadata for the request
 * @param {object} payload - Query params or post body(Will be switched based on HTTP method)
 * @returns {Promise} - response data from backend
 */
async function fetchHandler(metadata, {key, payload}) {

  let {url, options} = metadata[key];
  // Note - metadata will not be validated here expecting that the metadata file is perfect and predictable

  // Cloned to avoid later assigned values being persistent across requests
  const optionsClone = {...options},
    payloadClone = {...payload},
    pathTokens = url.split('/:');

  // Cater for path parameters
  // Note - This code block must appear before params/body is assigned to optionsClone object
  if (url.indexOf('/:') !== 0) {
    pathTokens.shift();
  }

  pathTokens.forEach((token) => {
    const paramKey = token.split('/')[0];
    url = url.replace(`/:${paramKey}`, `/${payloadClone[paramKey]}`);

    // Assume that same data will not be sent as both path param and query/body
    delete payloadClone[paramKey];
  });

  if (optionsClone.method === HTTP_METHODS.GET) {
    optionsClone.params = {...payloadClone, ...optionsClone.params};
  } else {
    optionsClone.body = {...payloadClone, ...optionsClone.body};
  }

  let err;

  try {
    const res = await fetch(url, optionsClone);

    // Handle success case
    if (res.status === HTTP_CODES.SUCCESS) {

      // Important that we return here. Otherwise the method will throw at the end
      return {
        replyAction: metadata[key].replies[res.status],
        res: res.data
      };
    }

    // Since the fetch status is not success, we will assign a new error to err, which will be thrown later.
    err = new Error("Fetch failed");
    err.data = res.data;

    // Check if a dedicated failure action is available
    if (metadata[key].replies[res.status]) {
      err.replyAction = metadata[key].replies[res.status];
    }
  } catch(e) {
    e.replyAction = e.replyAction || metadata[key].replies.failure;

    // Assign fetch error to err to be thrown at the end
    err = e;
  }

  throw err;
}

function redirectHandler(status, metadata, {key}) {
  if (!metadata[key]) {
    return;
  }
  let redirect = status === true ? metadata[key].successRedirect : metadata[key].failureRedirect;
  put(push(redirect));
}

/**
 * Saga Side-Effects Handler
 * @param {object} metadata - fetch metadata object
 * @param {object} action - redux action
 */
function* fetchActionHandler(metadata, action) {

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
    yield call(redirectHandler, true, metadata, action);

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
    yield call(redirectHandler, false, metadata, action);
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