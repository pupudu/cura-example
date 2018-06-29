/**
 * Action Creator factory for reducing boilerplate
 * Created by pubudud on 3/30/17.
 */

import {REDUX_ACTIONS} from './constants';

/**
 * The factory for generic action creator
 * This is supposed to be used only internally, but exposed just in case someone needs it
 *
 * @param {string} type - action type
 * @param {*} argNames - action payload(s) names
 * @returns {function} - Redux action creator
 */
export const makeActionCreator = (type, ...argNames) => (...args) => {
  const action = {type};
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

/**
 * Template for action creators with an expected second argument of key
 * @param {string} type - action type
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @return {function} - Redux action creator
 */
const makeGenericFetcherTemplate = (type, key, ...argNames) => makeActionCreator(type, "key", ...argNames);

/**
 * Action Creator factory for FETCH actions which accepts a compulsory 'key' attribute
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @returns {function} - Redux action creator
 */
export const makeGenericFetcher = (key, ...argNames) => makeGenericFetcherTemplate(REDUX_ACTIONS.FETCH, key, ...argNames);

/**
 * Similar to the makeGenericFetcher factory. But will cancel previous fetch when a similar request is made
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @returns {function} - Redux action creator
 */
export const makeGenericLatestFetcher = (key, ...argNames) => makeGenericFetcherTemplate(REDUX_ACTIONS.FETCH_LATEST, key, ...argNames);

/**
 * Similar to the makeGenericFetcher factory. But will cancel FUTURE requests until the current task is finished
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {*} argNames - action payload(s) names
 * @returns {function} - Redux action creator
 */
export const makeGenericLeadingFetcher = (key, ...argNames) => makeGenericFetcherTemplate(REDUX_ACTIONS.FETCH_LEADING, key, ...argNames);

/**
 * Make an opinionated actionCreator with embedded type, key, payload and postAction.
 * The action creator will accept two optional arguments which will be used for the Fetch call from the fetch saga
 * and to callback
 *
 * @param {string} type - action type
 * @param {string} key - fetch key to identify the corresponding metadata entry
 * @param {function} [callback] - function to execute after the fetch call. This function will receive any error and fetch response data arguments
 *
 * @returns {function(*, *): {type: string, key: *, payload: *, callback: *}}
 */
const makeFetcherTemplate = (type, key, callback) => (payload, callbackInAction) => {
  // Give precedence to the callback in action
  callback = callbackInAction || callback;

  return {
    type,
    key,
    payload,
    callback
  };
};

// We export the fetchers created from the fetcher template

/**
 * Opinionated factory for fetcher which accepts a key for identifying the fetch metadata
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {function} [callback] - error first function to execute after the fetch call. This function will receive any error and fetch response data arguments
 * @return {function(*, *)} - opinionated action creator
 */
export const makeFetcher = (key, callback) => makeFetcherTemplate(REDUX_ACTIONS.FETCH, key, callback);

/**
 * Similar to makeFetcher, cancel previous unfulfilled fetch calls
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {function} [callback] - error first function to execute after the fetch call. This function will receive any error and fetch response data arguments
 * @return {function(*, *)} - opinionated action creator
 */
export const makeLatestFetcher = (key, callback) => makeFetcherTemplate(REDUX_ACTIONS.FETCH_LATEST, key, callback);

/**
 * Similar to makeFetcher, cancel future actions until current fetch has completed
 *
 * @param {string} key - fetch key to identify corresponding metadata entry
 * @param {function} [callback] - error first function to execute after the fetch call. This function will receive any error and fetch response data arguments
 * @return {function(*, *)} - opinionated action creator
 */
export const makeLeadingFetcher = (key, callback) => makeFetcherTemplate(REDUX_ACTIONS.FETCH_LEADING, key, callback);
