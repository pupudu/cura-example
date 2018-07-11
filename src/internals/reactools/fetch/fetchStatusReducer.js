/**
 * This module exposes a special reducer for handling the fetch status of any fetch action processed by our fetch saga.
 *
 * The key based reducer doesn't require any kind of manual configurations. Works out of the box with the fetch saga.
 *
 * The fetch key based reducer is for handling cases where we might want to handle the fetch status based on an
 * attribute of the fetch request/response payload.
 * Thus to use this reducer, we need to define the fetchKey in the metadata file.
 * If not specified, this will default to the key based reducer.
 *
 * Created by pubudud.
 */

import {REDUX_ACTIONS, FETCH_STATUSES} from '../constants';

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

/**
 * Default reducer for handling fetch status. Updates the status against the key in corresponding metadata entry
 *
 * @param {object} state - redux store branch for fetch status
 * @param {object} action - redux action
 * @return {*} - reduced state
 */
const keyBasedReducer = (state, action) => {
  switch (action.type) {
    case REDUX_ACTIONS.FETCH_INIT:
      return getKeyBasedState(state, action, FETCH_STATUSES.IN_PROGRESS);
    case REDUX_ACTIONS.FETCH_SUCCESS:
      return getKeyBasedState(state, action, FETCH_STATUSES.SUCCESS);
    case REDUX_ACTIONS.FETCH_FAILED:
      return getKeyBasedState(state, action, FETCH_STATUSES.FAILED);
    default:
      return state;
  }
};

/**
 * fetch key based reducer for cases where the same key in the metadata file is used for fetching data related
 * to different entities. In this case, we need to instruct the reducer which attribute to consider for
 * saving the status against.
 *
 * @param {object} state - redux store branch for fetch status
 * @param {object} action - redux action
 * @return {*} - reduced state
 */
const fetchKeyBasedReducer = (state, action) => {
  switch (action.type) {
    case REDUX_ACTIONS.FETCH_INIT:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.IN_PROGRESS);
    case REDUX_ACTIONS.FETCH_SUCCESS:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.SUCCESS);
    case REDUX_ACTIONS.FETCH_FAILED:
      return getFetchKeyBasedState(state, action, FETCH_STATUSES.FAILED);
    default:
      return state;
  }
};

/**
 * Reducer factory for initializing the fetch status reducer
 * @param {object} metadata - root fetch metadata
 * @return {Function} - fetch status reducer
 *
 * TODO: rename fetchKey to fetchAttribute or something more meaningful
 */
export function createFetchStatusReducer(metadata) {
  return (state = {}, action) => {
    if (!action.key || !metadata[action.key])
      return state;

    const fetchKey = metadata[action.key].fetchKey;

    // If a fetchKey is defined in the corresponding metadata entry, we invoke the fetchKey based reducer
    if (fetchKey) {
      return fetchKeyBasedReducer(state, {...action, fetchKey});
    }

    // Default to key based reducer
    return keyBasedReducer(state, action);
  };
}
