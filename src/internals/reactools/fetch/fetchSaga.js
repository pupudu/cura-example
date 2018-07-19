import {put, take, takeEvery, takeLatest, takeLeading} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {REDUX_ACTIONS} from '../constants';
import {getFetchHandler, setupFetch} from "./fetchHandlers";


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
 * Create a fetch saga based on fetch action type and corresponding saga effect
 *    fetch - handle all such fetch calls
 *    fetchLatest - terminate all incomplete previous fetches upon a new one
 *    fetchLeading - ignore all future requests until the current fetch request has finished
 *
 * @param {object} metadata - fetch metadata file
 * @param {object} options - options to modify fetch behavior
 * @param {string} fetchActionType - accepting fetch action type
 * @param {function} sagaEffect - effect to call from redux-saga
 * @return {Function} - saga
 */
function createSaga(metadata, options, fetchActionType, sagaEffect) {
  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }

  // setup custom fetch behavior as required
  setupFetch(options);

  return function* () {
    yield sagaEffect(fetchActionType, fetchActionHandler, metadata);
  }
}

/**
 * Saga: Capture all FETCH actions to handle side-effects
 */
export const createFetchSaga = (metadata, options) => createSaga(metadata, options, REDUX_ACTIONS.FETCH, takeEvery);

/**
 * Saga: Capture the last FETCH_LATEST action to handle side-effects
 */
export const createFetchLatestSaga = (metadata, options) => createSaga(metadata, options, REDUX_ACTIONS.FETCH_LATEST, takeLatest);

/**
 * Saga: Capture the last FETCH_LEADING action to handle side-effects
 */
export const createFetchLeadingSaga = (metadata, options) => createSaga(metadata, options, REDUX_ACTIONS.FETCH_LEADING, takeLeading);

export default createFetchSaga;

// TODO - can we create a throttled saga? which will process a bounded number of fetch calls at a time, queue the rest