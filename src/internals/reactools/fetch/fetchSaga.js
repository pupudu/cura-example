import {put, take, takeEvery, takeLatest, takeLeading} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {REDUX_ACTIONS} from '../constants';
import {getFetchHandler} from './fetchMiddleware';


/**
 * Saga Side-Effects Handler
 * @param {object} metadata - fetch metadata object
 * @param {string} metadata.key - key of the request type to get required metadata for the request
 * @param {object} metadata.payload - fetch body or params
 * @param {object} action - redux action
 */
function* fetchActionHandler(metadata, action) {
  let handler = getFetchHandler(action, metadata);

  // Create an event channel to let the async-await based fetch middleware to take control of the saga effects
  let fetchEvenChannel = eventChannel(emit => {
    handler((event) => {
      // Use a setTimeout to delay operation to next tick
      // Without this, immediate events emitted from the handler will not be passed into emit
      setTimeout(() => {
        emit(event)
      });
    });

    // As the unsubscribe function of the event channel, we just void the functionality of the handler
    // Currently, the unsubscribe function is not used anywhere
    // This might be converted to a more meaningful function if there is an actual need to unsubscribe
    return () => {
      handler = () => undefined;
    };
  });

  // Watch for events emitted from the fetchEvent channel and dispatch actual redux actions
  while (true) {
    let channelAction = yield take(fetchEvenChannel);
    yield put(channelAction);
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
