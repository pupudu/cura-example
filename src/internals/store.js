import {createStore as createReduxStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router'

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';


export default function createStore(initialState = {}, history) {

  // Make a createStore factory which can create the store on demand with the middleware
  const sagaMiddleware = createSagaMiddleware();
  const createStoreWithMiddleware = compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      sagaMiddleware
    )
  )(createReduxStore);

  const store = createStoreWithMiddleware(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState
  );

  // Run the redux saga middleware with the root saga
  sagaMiddleware.run(rootSaga);

  return store;
};
