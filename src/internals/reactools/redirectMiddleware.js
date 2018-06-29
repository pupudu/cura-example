import {push} from 'connected-react-router';

export const createRedirectMiddleware = (actionType) => {
  return store => next => action => {
    if (action.type === actionType) {
      if (action.url) {
        next(push(action.url))
      }
    }
    return next(action);
  }
};

export default createRedirectMiddleware("REDIRECT");
