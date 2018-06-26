/**
 * Metadata required to handle All FETCH operations in the application will be defined here.
 * Each object corresponding to a FETCH-Key must have a url, an options object,
 * and actions for success and failure states based on HTTP codes
 *
 * Created by pubudud.
 */

import {
  FETCH_SAGA_KEYS as KEYS,
  REDUX_ACTIONS as ACTIONS,
  URLS,
  HTTP_METHODS
} from './constants';

export default {
  [KEYS.BOOK_LIST]: {
    url: URLS.BOOK_LIST,
    options: {
      method: HTTP_METHODS.GET,
      params: {
        dashboard: 1,
        development: 0
      }
    },
    replies: {
      200: ACTIONS.SET_BOOK_LIST,
      401: ACTIONS.LOGOUT,
      400: ACTIONS.IGNORE,
      500: ACTIONS.WAIT_AND_RETRY,
      failure: ACTIONS.HANDLE_BOOK_LIST_FETCH_FAILURE
    },
    fetchKey: null,
    successRedirect: "",
    failureRedirect: "",
    headers: {}
  },
  [KEYS.RECENT_BOOK_LIST]: {
    url: URLS.RECENT_BOOK_LIST,
    options: {
      method: HTTP_METHODS.GET
    },
    replies: {
      200: ACTIONS.SET_RECENT_BOOK_LIST,
      failure: ACTIONS.RECENT_BOOK_LIST_FETCH_FAILURE
    }
  }
};
