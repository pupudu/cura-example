/**
 * This middleware uses the connected react router to redirect the application based on redux actions
 * To invoke this middleware, define a REDIRECT reply action in any of the fetchMetadata modules
 *
 * The REDIRECT action can be customized using the factory method as required
 */

import {push} from 'connected-react-router';

export const createRedirectMiddleware = (actionType) => {
  return store => next => action => {
    if (action.type === actionType) {
      if (action.url) {
        // Note: call store.dispatch instead of next, so that the middleware order doesn't matter
        store.dispatch(push(action.url))
      }
    }
    return next(action);
  }
};

export default createRedirectMiddleware("REDIRECT");
