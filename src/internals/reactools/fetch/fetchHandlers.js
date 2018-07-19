import {getApi, setApi} from './api';
import {HTTP_METHODS, HTTP_CODES, REDUX_ACTIONS} from '../constants';
import {preProcess} from "./preProcess";

/**
 * Process fetchMetadata entry and action payload to derive the url and request options for the fetch call to be made
 *
 * @param {object} entry - fetch metadata entry
 * @param {object} payload - fetch action payload
 * @return {object} url and options as an object
 */
function deriveUrlAndPayload(entry, payload) {
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
  return {
    url,
    options: optionsClone
  }
}

/**
 * Perform a fetch based on the meta data available corresponding to the request type
 * Currently based on the fetch API. May need to update to support axios or any other alternative.
 *
 * @param {object} entry - fetch metadata object entry
 * @param {object} payload - Query params or post body(Will be switched based on HTTP method)
 * @returns {Promise} - response data from backend
 */
export async function doFetch(entry, payload) {

  let {url, options} = deriveUrlAndPayload(entry, payload);
  let err;

  try {
    const res = await getApi()(url, options);

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


/**
 * Create a generic action from provided metadata corresponding to the dispatched fetch action
 *
 * @param {string} type - action type to be dispatched
 * @param {any} payload - response data payload from the fetch
 * @param {object} error - any errors occurred during the fetch
 * @param {object} args - default data provided in metadata to be shipped with the action
 * @return {object} redux action
 */
function createReplyAction(type, payload, error, args = {}) {
  return {
    type,
    payload,
    error,
    ...args
  };
}

/**
 * Analyze the reply action and create actions from metadata accordingly
 *
 * @param {object} reply - success or failure reply from the fetch handler
 * @return {Array} redux actions array
 */
export function getReplyActions(reply) {

  let replyActions = [];

  if (!reply.replyAction) {
    return replyActions;
  }

  // Treat non array replies as an array with one element (to make the preceding code more meaningful)
  let replies = Array.isArray(reply.replyAction) ? reply.replyAction : [reply.replyAction];

  replies.forEach(replyAction => {

    // If the reply action is a string, we will follow default behavior
    if (typeof replyAction === "string") {
      replyActions.push(createReplyAction(replyAction, reply.data, reply.error));
    }

    // If the reply action is an object, and it has a field: "type" we merge it with the dispatched action
    if (typeof replyAction === "object" && replyAction.type) {
      let metadataAction = {...replyAction};
      delete metadataAction.type;
      replyActions.push(createReplyAction(replyAction.type, reply.data, reply.error, metadataAction));
    }
  });

  return replyActions;
}


/**
 * Customize the default fetch behavior based on user options
 * @param {object} options - user options to update fetch behavior
 */
export function setupFetch(options) {
  // Set custom API for fetch requests
  if (options.api)
    setApi(options.api);
}


/**
 * Create a fetchHandler which fires reply actions based on fetch call status and corresponding metadata.
 * This was created after the fetchSaga module, to produce the same behavior without redux-saga
 *
 * @param {object} action - redux fetch action
 * @param {object} metadata - fetch metadata
 * @return {Function} - fetchHandler
 */
export const getFetchHandler = (action, metadata) => dispatch => {
  let reply = {};
  let err = null;
  const entry = metadata[action.key];

  // Dispatch INIT action to signal the supporting reducers/middleware if any
  dispatch({
    ...action,
    type: REDUX_ACTIONS.FETCH_INIT
  });

  (async () => {
    try {
      reply = await doFetch(preProcess(entry), action.payload);

      // If the code reaches this point, rather than going to the catch, that is an indication that the fetch is a success
      // Fire action to be used by the fetch statuses reducer
      dispatch({...action, type: REDUX_ACTIONS.FETCH_SUCCESS});

      // Fire reply action(s) from metadata
      getReplyActions(reply).map(action => dispatch(action));

    } catch (error) {
      // Fire action to be used by the fetch statuses reducer
      dispatch({...action, type: REDUX_ACTIONS.FETCH_FAILED});

      // Fire reply action from metadata. Here we pass the error instead of payload
      getReplyActions(error).map(action => dispatch(action));

      // Save error to conditionally redirect later
      err = error;
    }

    // Call post fetch handler callback, if provided
    // Here we do not bind anything besides the response error data assuming the post action is a closure
    if (action.callback) {
      action.callback(err, reply.data);
    }
  })();
};
