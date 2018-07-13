/**
 * This middleware uses the connected react router to redirect the application based on redux actions
 * To invoke this middleware, define a REDIRECT reply action in any of the fetchMetadata modules
 *
 * The REDIRECT action can be customized using the factory method as required
 */

import {push} from 'connected-react-router';

export const createRedirectMiddleware = (redirectAction, redirectAppendAction) => {
  return store => next => action => {
    if (action.url) {
      // Note: call store.dispatch instead of next, so that the middleware order doesn't matter
      switch(action.type) {
        case redirectAction:
          store.dispatch(push(action.url));
          break;
        case redirectAppendAction: {
          // Not checking for undefined, assuming the router is always there
          // Need to reconsider if any bug is reported
          let currentBase = store.getState().router.location.pathname;
          store.dispatch(push(`${currentBase}/${action.url}`));
          break;
        }
        default:
          break;
      }
    }

    // Call next middleware even if the interested actions are caught,
    // So that this middleware doesn't interrupt the users application in any way
    return next(action);
  }
};

export default createRedirectMiddleware("REDIRECT", "REDIRECT_APPEND");
