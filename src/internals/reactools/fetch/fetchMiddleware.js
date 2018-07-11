import {REDUX_ACTIONS} from '../constants';
import {doFetch, getReplyActions} from './fetchHandlers';
import {preProcess} from './preProcess';


// TODO - Try to merge this and fetchActionHandler in fetchSaga, so we don't have to deal with inconsistency issues
/**
 * Create a fetchHandler which fires reply actions based on fetch call status and corresponding metadata.
 * This was created after the fetchSaga module, to produce the same behavior without redux-saga
 *
 * @param {object} action - redux fetch action
 * @param {object} metadata - fetch metadata
 * @return {Function} - fetchHandler
 */
export const getFetchHandler = (action, metadata) => dispatch => {
  let reply = {};
  let err = null;
  const entry = metadata[action.key];

  // Dispatch INIT action to signal the supporting reducers/middleware if any
  dispatch({
    ...action,
    type: REDUX_ACTIONS.FETCH_INIT
  });

  (async () => {
    try {
      reply = await doFetch(preProcess(entry), action.payload);

      // If the code reaches this point, rather than going to the catch, that is an indication that the fetch is a success
      // Fire action to be used by the fetch statuses reducer
      dispatch({...action, type: REDUX_ACTIONS.FETCH_SUCCESS});

      // Fire reply action(s) from metadata
      getReplyActions(reply).map(action => dispatch(action));

    } catch (error) {
      // Fire action to be used by the fetch statuses reducer
      dispatch({...action, type: REDUX_ACTIONS.FETCH_FAILED});

      // Fire reply action from metadata. Here we pass the error instead of payload
      getReplyActions(error).map(action => dispatch(action));

      // Save error to conditionally redirect later
      err = error;
    }

    // Call post fetch handler callback, if provided
    // Here we do not bind anything besides the response error data assuming the post action is a closure
    if (action.callback) {
      action.callback(err, reply.data);
    }
  })();
};


/**
 * Create a plain redux middleware to handle fetch calls
 *
 * @param {object} metadata - fetch metadata
 * @return {function(*=): function(*): Function} redux middleware
 */
export const createFetchMiddleware = metadata => {

  if (!metadata) {
    throw new Error("Fetch metadata cannot be empty!");
  }

  return store => next => action => {
    // First call the next middleware with the same action
    // That is, we always forward the action to other middleware, even if it is fetch related or not
    next(action);

    // If it is a fetch action, we handle it
    if (action.type === REDUX_ACTIONS.FETCH) {
      // Note: pass store.dispatch instead of next, so that the middleware order doesn't matter
      getFetchHandler(action, metadata)(store.dispatch);
    }
  };
};

// TODO: Need to find a way to replicate fetchLatest and fetchLeading behavior without the sagas