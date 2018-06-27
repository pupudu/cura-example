/**
 * Created by pubudud.
 */

import {REDUX_ACTIONS, FETCH_STATUSES} from './constants';

const getSingleFetchKeyBasedState = (state, action, status) => ({
  ...state,
  [action.key]: {
    ...state[action.key],
    [action.payload[action.fetchKey]]: status
  }
});

const getMultipleFetchKeysBasedState = (state, action, status) => {
  let reducedKey = {...action.payload};
  action.fetchKey.forEach((subKey) => {
    reducedKey = reducedKey[subKey];
  });
  return {
    ...state,
    [action.key]: {
      ...state[action.key],
      [reducedKey]: status
    }
  };
};

const getFetchKeyBasedState = (state, action, status) =>
  Array.isArray(action.fetchKey) ? getMultipleFetchKeysBasedState(state, action, status)
    : getSingleFetchKeyBasedState(state, action, status);


const getKeyBasedState = (state, action, status) => ({
  ...state,
  [action.key]: status
});

const keyBasedReducer = (state, action) => {
  switch (action.type) {
    case REDUX_ACTIONS.FETCH:
    case REDUX_ACTIONS.FETCH_LATEST:
      return getKeyBasedState(state, action, FETCH_STATUSES.IN_PROGRESS);
    case REDUX_ACTIONS.FETCH_SUCCESS:
      return getKeyBasedState(state, action, FETCH_STATUSES.SUCCESS);
    case REDUX_ACTIONS.FETCH_FAILED:
      return getKeyBasedState(state, action, FETCH_STATUSES.FAILED);
    default:
      return state;
  }
};

const fetchKeyBasedReducer = (state, action) => {
  switch (action.type) {
    case REDUX_ACTIONS.FETCH:
    case REDUX_ACTIONS.FETCH_LATEST:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.IN_PROGRESS);
    case REDUX_ACTIONS.FETCH_SUCCESS:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.SUCCESS);
    case REDUX_ACTIONS.FETCH_FAILED:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.FAILED);
    default:
      return state;
  }
};

export function createFetchStatusReducer(metadata) {
  return (state = {}, action) => {
    if (!action.key || !metadata[action.key])
      return state;

    const fetchKey = metadata[action.key].fetchKey;

    if (fetchKey) {
      return fetchKeyBasedReducer(state, {...action, fetchKey});
    }
    return keyBasedReducer(state, action);
  };
}
