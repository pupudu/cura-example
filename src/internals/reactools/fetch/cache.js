// Cache store for all fetch calls
// Note: Cannot use a Map here, since the url, options pair will not refer to the same object every time
const cache = {};

// Flag to disable caching for all requests
let rootCacheFlag = true;

/**
 * Set the response data to the cache store
 * @param {string} url - request url
 * @param {object} options - request options
 * @param {object} res - full response object with data, status code etc
 * @param {object} entry - corresponding metadata entry of the request
 */
export function updateCache(url, options, res, entry) {
  // Users can disable caching for all request by providing that option while creating the fetch middleware/saga
  if (!rootCacheFlag) {
    return;
  }

  // If the request method is not GET, we don't cache by default
  // Users can force caching for such requests by setting the cache flag in corresponding metadata entry to true
  if (options.method.toLowerCase() !== 'get' && entry.cache !== true) {
    return;
  }

  // For GET requests, users can disable caching by setting the cache flag to false.
  // Note: Not setting the flag(i.e undefined) will not prevent caching.
  if (entry.cache === false) {
    return;
  }

  // Cache data using url and options as the key
  cache[JSON.stringify({ url, options })] = res;
}

/**
 * Retrieve the data from the cache
 * @param {string} url - request url
 * @param {object} options - request options
 * @return {object} - response data
 */
export function getCachedData(url, options) {
  return cache[JSON.stringify({ url, options })];
}

/**
 * Disable cache for all requests
 */
export function disableCache() {
  rootCacheFlag = false;
}
