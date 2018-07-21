import fetch from './adapters/fetchApi';
import axios from './adapters/axios';

/**
 * Create a map of API adapters to allow users to switch them based on a string key
 * @type {{fetch: Function, axios: Function}}
 */
const apiMap = {
  fetch,
  axios
};

/**
 * API Mapper for allowing users to change the api on the fly
 */
class Mapper {
  /**
   * Set the API to be fetch API by default
   */
  constructor() {
    this.api = fetch;
  }

  /**
   * Set a custom API
   * @param {function|string} api - ,
   * @return {*}
   */
  setApi(api) {
    // if function, we assume it to be the adapter
    // We do not validate whether the api is a proper adapter. We pass that responsibility to the user
    if (typeof api === 'function') {
      this.api = api;
      return;
    }
    // If not a function or string, user must have sent an invalid argument
    if (typeof api !== 'string') {
      throw new Error('Invalid API or API adapter supplied');
    }
    // if string, we map the adapter from the map
    if (apiMap[api]) {
      this.api = apiMap[api];
      return;
    }
    // If string and no mapping adapter found, the user must have done a typo or something
    throw new Error(`No inbuilt adapter found for API of type: ${api}`);
  }

  /**
   * Return the current API
   * @return {function} - api adapter
   */
  getApi() {
    return this.api;
  }
}

let mapper = new Mapper();

export const setApi = mapper.setApi.bind(mapper);
export const getApi = mapper.getApi.bind(mapper);
