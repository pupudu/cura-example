import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {Provider} from 'react-redux'
import { ConnectedRouter } from 'connected-react-router';
import {createBrowserHistory} from 'history';

import createStore from './internals/store';
import App from './App';

// import registerServiceWorker from './registerServiceWorker';
//registerServiceWorker();

const history = createBrowserHistory();
const store = createStore(window.__REDUX_STATE__, history);

const AppBundle = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>
);


window.onload = () => {
  Loadable.preloadReady()
    .then(() => {
      ReactDOM.hydrate(
        AppBundle,
        document.getElementById('root')
      );
    });
};