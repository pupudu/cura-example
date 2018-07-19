import axios from 'axios';

/**
 * Adapter for axios to be used as the api for the doFetch handler
 *
 * Basically, here we map the options passed from the fetch handler to the expected axios options format
 *
 * @param {string} url - resource url
 * @param {object} options - options from fetch handler
 * @return {AxiosPromise<any>}
 */
export default (url, options) =>
  axios.request({
    url, // axios accepts url as an options object attribute
    ...options,
    data: options.body, // axios treats api body as data
    body: undefined // invalidate the body attribute spread from the options object
  });