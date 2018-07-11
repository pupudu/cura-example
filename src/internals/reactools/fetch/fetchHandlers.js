import fetch from './api';
import {HTTP_METHODS, HTTP_CODES} from '../constants';

/**
 * Perform a fetch based on the meta data available corresponding to the request type
 * Currently based on the fetch API. May need to update to support axios or any other alternative.
 *
 * @param {object} entry - fetch metadata object entry
 * @param {object} payload - Query params or post body(Will be switched based on HTTP method)
 * @returns {Promise} - response data from backend
 */
export async function fetchHandler(entry, payload) {

  let {url, options} = entry;
  // Note - metadata will not be validated here expecting that the metadata file is perfect and predictable

  // Cloned to avoid later assigned values being persistent across requests
  const optionsClone = {...options},
    payloadClone = {...payload},
    pathTokens = url.split('/:');

  // Cater for path parameters
  // Note - This code block must appear before params/body is assigned to optionsClone object
  if (url.indexOf('/:') !== 0) {
    pathTokens.shift();
  }

  pathTokens.forEach((token) => {
    const paramKey = token.split('/')[0];
    url = url.replace(`/:${paramKey}`, `/${payloadClone[paramKey]}`);

    // Assume that same data will not be sent as both path param and query/body
    delete payloadClone[paramKey];
  });

  if (optionsClone.method === HTTP_METHODS.GET) {
    optionsClone.params = {...payloadClone, ...optionsClone.params};
  } else {
    optionsClone.body = {...payloadClone, ...optionsClone.body};
  }

  let err;

  try {
    const res = await fetch(url, optionsClone);

    // Handle success case
    if (res.status === HTTP_CODES.SUCCESS) {

      // Important that we return here. Otherwise the method will throw at the end
      return {
        replyAction: entry.replies[res.status],
        data: res.data
      };
    }

    // Since the fetch status is not success, we will assign a new error to err, which will be thrown later.
    err = new Error("Fetch failed");
    err.data = res.data;

    // Check if a dedicated failure action is available, else assign the default error response
    err.replyAction = entry.replies[res.status] || entry.replies.failure;

  } catch(e) {
    // Assign fetch error to err to be thrown at the end
    err = {
      ...e,
      replyAction: entry.replies.failure
    };
  }

  throw err;
}
