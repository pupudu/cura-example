import {makeFetcher} from '../actionCreatorsFactory';

/**
 * This module exports the same bindActionCreators function in redux, with a slight modification
 * to return a promise, instead of just returning from the function in bindActionCreator
 */

/**
 * This is a very similar implementation to the bindActionCreator in redux.
 * The only difference is that, here we return a promise rather than just returning from the method.
 *
 * @param actionCreator
 * @param dispatch
 * @return {function(): Promise<any>}
 */
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    // Clone the arguments into an array, to modify later
    let args = Array.from(arguments);

    // Return a promise, so the components can do, someMethodCall().then().catch() or async await.
    return new Promise((resolve, reject) => {

      // We append the resolve and reject calls to the argument list, so a reducer or a middleware can
      // ...call them, after an async operation, to signal the method caller about the status of the operation
      args.push(resolve, reject);

      // Same step as original redux function
      return dispatch(actionCreator.apply(this, args));
    });
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
export function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
        }. ` +
      `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    );
  }

  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

export function bindFetchActionCreators(actionKeys, dispatch) {
  if (typeof actionKeys === 'string') {
    return bindActionCreators(makeFetcher(actionKeys), dispatch);
  }

  if (typeof actionKeys !== 'object' || actionKeys === null) {
    throw new Error('bindFetchActionCreators expected an object or a string');
  }

  return bindActionCreators(
    Object.keys(actionKeys)
      .reduce((actionCreators, key) => {
        return {
          ...actionCreators,
          [key]: makeFetcher(actionKeys[key])
        }
      }, {}),
    dispatch
  );
}
