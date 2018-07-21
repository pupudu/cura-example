/**
 * Create a reducer which will replace the initial value on SET action
 * @param {string} actionType - Type of the SET action
 * @param {*} initialState - initial value can be of any type
 * @param {string} attribute - Attribute to be selected from action
 * @returns {function} - replacer reducer
 */
export const createSetterReducer = (actionType, initialState, attribute = 'payload') => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actionType:
      return action[attribute];
    default:
      return state;
  }
};

/**
 * Create a reducer which will merge the current state and the action payload on SET action
 * @param {string} actionType - Type of the SET action
 * @param {Object} initialState - initial value of the reducer (MUST be an Object)
 * @param {string} attribute - Attribute to be selected from action
 * @returns {function} - merger reducer
 */
export const createObjMergerReducer = (actionType, initialState, attribute = 'payload') => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actionType:
      return { ...state, ...action[attribute] };
    default:
      return state;
  }
};

/**
 * Create a reducer which will merge the current state and the action payload on SET action
 * @param {string} actionType - Type of the SET action
 * @param {Array} initialState - initial value of the reducer (MUST be an Array)
 * @param {string} attribute - Attribute to be selected from action
 * @returns {function} - merger reducer
 */
export const createArrayMergerReducer = (actionType, initialState, attribute = 'payload') => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actionType:
      return [...state, ...(action[attribute] || [])];
    default:
      return state;
  }
};

/**
 * Create a generic reducer based on any given set of handlers
 * @param initialState
 * @param handlers
 * @returns {function} - generic handler based reducer
 */
export const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }
    return state;
  };
};

/**
 * Create a setter reducer for fetch actions
 * @param actionType
 * @param initialState
 * @param attribute
 * @param setAttribute
 * @returns {Function} - opinionated fetch data setter reducer
 */
export const createFetchDataSetterReducer = (
  actionType,
  initialState = {},
  attribute = 'payload',
  setAttribute = 'setKey'
) => (state = initialState, action) => {
  if (!action[setAttribute]) {
    return state;
  }
  switch (action.type) {
    case actionType:
      return {
        ...state,
        [action[setAttribute]]: action[attribute]
      };
    default:
      return state;
  }
};

export const fetchDataSetterReducer = createFetchDataSetterReducer('SET_ITEMS');
