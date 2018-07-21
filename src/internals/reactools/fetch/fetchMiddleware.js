import { REDUX_ACTIONS } from '../constants';
import { getFetchHandler, setupFetch } from './fetchHandlers';

/**
 * Create a plain redux middleware to handle fetch calls
 *
 * @param {object} metadata - fetch metadata
 * @param {object} options - options to modify fetch behavior
 * @return {function(*=): function(*): Function} redux middleware
 */
export const createFetchMiddleware = (metadata, options) => {
  if (!metadata) {
    throw new Error('Fetch metadata cannot be empty!');
  }

  // setup custom fetch behavior as required
  setupFetch(options);

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
