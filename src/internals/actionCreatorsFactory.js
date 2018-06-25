/**
 * Action Creator factory for reducing boilerplate
 * Created by pubudud on 3/30/17.
 */

import {REDUX_ACTIONS} from './fetch/constants';

/**
 * @param {string} type - action type
 * @param {*} argNames - action payload(s) names
 * @returns {object} - Redux action creator
 */
export default (type, ...argNames) => (...args) => {
  const action = {type};
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

/**
 * Action Creator factory for FETCH actions which accepts a compulsory 'key' attribute
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @returns {object} - Redux action creator
 */
export const makeGenericFetcher = (key, ...argNames) => (...args) => {
  const action = {type: REDUX_ACTIONS.FETCH, key};
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

/**
 * Similar to the makeGenericFetcher factory. But will cancel previous fetch when a similar request is made
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @returns {object} - Redux action creator
 */
export const makeLatestFetcher = (key, ...argNames) => (...args) => {
  const action = {type: REDUX_ACTIONS.FETCH_LATEST, key};
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

/**
 * Make an opinionated actionCreator with embedded key, payload and postAction.
 * The action creator will accept one argument which will be used for the Fetch call from the fetch saga
 *
 * @param key - fetch key to identify the corresponding metadata entry
 * @param postAction - callback like function to execute after the fetch call. This function will receive fetch response data and original payload as arguments
 *
 * @returns {function(*): {type: string, key: *, payload: *, postAction: *}}
 */
export const makeFetcher = (key, postAction) => (payload) => {
  return {
    type: REDUX_ACTIONS.FETCH,
    key,
    payload,
    postAction
  };
};
