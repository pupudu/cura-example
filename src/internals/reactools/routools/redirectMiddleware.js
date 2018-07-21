/**
 * This middleware uses the connected react router to redirect the application based on redux actions
 * To invoke this middleware, define a REDIRECT reply action in any of the fetchMetadata modules
 *
 * The REDIRECT action can be customized using the factory method as required
 */

import { push } from 'connected-react-router';

/**
 * Derive the redirect url based on the redirect action type
 *
 * @param state - current state of the redux store
 * @param action - dispatched redirect action
 * @param redirectAction - action type for full redirect
 * @param redirectAppendAction - action type for append to path
 * @return {string} - redirect url
 */
function getRedirectUrl(state, action, { redirectAction, redirectAppendAction }) {
  switch (action.type) {
    case redirectAction:
      return action.url;
    case redirectAppendAction: {
      // Not checking for undefined, assuming the router is always there
      // Need to reconsider if any bug is reported
      let currentBase = state.router.location.pathname;
      return `${currentBase}/${action.url}`;
    }
    default:
      return '';
  }
}

/**
 * Create a redirect middleware with custom redirect action types
 *
 * @param redirectAction - action type to do a full redirect
 * @param redirectAppendAction - action type to do append new location to current path
 *
 * @return {function} standard redux middleware
 */
export const createRedirectMiddleware = (redirectAction, redirectAppendAction) => {
  return store => next => action => {
    if (action.url) {
      // Get the redirect url based on the dispatched redirect action type
      let redirectUrl = getRedirectUrl(store.getState(), action, {
        redirectAction,
        redirectAppendAction
      });

      // Note: call store.dispatch instead of next, so that the middleware order doesn't matter
      store.dispatch(push(redirectUrl));
    }

    // Call next middleware even if the interested actions are caught,
    // So that this middleware doesn't interrupt the users application in any way
    return next(action);
  };
};

// Expose a default redirect middleware for majority of users
export default createRedirectMiddleware('REDIRECT', 'REDIRECT_APPEND');
