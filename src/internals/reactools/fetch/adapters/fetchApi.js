/**
 * A Wrapper for fetch API for allowing query params to be supplied as a params object
 *
 * @param {string} url - base url string
 * @param {object} options - init config for fetch API
 * @returns {Promise} - fetch API response
 */
export default (url, options) =>
  // Using a promise constructor since the promise returned by "fetch" will be executed here
  new Promise((resolve, reject) => {
    if (options && options.params && Object.keys(options.params).length) {
      let keys = Object.keys(options.params),
        searchParams = new URLSearchParams();

      // Build searchParams object using query key-value pairs
      for (let i = 0; i < keys.length; i++) {
        if (options.params[keys[i]]) searchParams.append(keys[i], options.params[keys[i]]);
      }

      // Extract query string
      url = `${url}?${searchParams.toString()}`;
    }

    // Send and Receive cookies to handle user session
    options.credentials = 'include';

    // Assume only json requests will be sent by default
    // TODO: Should we just merge these two instead of conditionally assigning
    options.headers = new Headers(
      options.headers || {
        'Content-Type': 'application/json'
      }
    );

    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }

    fetch(url, options)
      .then(res => {
        // Assume that only json responses will be received
        res
          .json()
          .then(data =>
            resolve({
              ...res,
              data,
              status: res.status
            })
          )
          .catch(err => {
            // Custom error message for simplified debugging
            err = new Error(`Error while parsing fetched data from server: ${err}`);
            return reject(err);
          });
      })
      .catch(reject);
  });
