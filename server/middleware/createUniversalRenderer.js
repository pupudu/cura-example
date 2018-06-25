import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loadable from 'react-loadable';
import { Provider } from 'react-redux'
import {StaticRouter} from 'react-router';
import fs from "fs";

import {extractAssets} from './utils';

export default ({App, index, manifest, store}) => (req, res, next) => {

  fs.readFile(index, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err);
      return res.status(404).end()
    }

    const context = {};
    const modules = [];

    // render the app as a string
    const AppString = ReactDOMServer.renderToString(
      <Loadable.Capture report={m => modules.push(m)}>
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App/>
          </StaticRouter>
        </Provider>
      </Loadable.Capture>
    );

    // get the stringified state
    const reduxState = JSON.stringify(store.getState());

    // map required assets to script tags
    const extraChunks = extractAssets(manifest, modules)
      .map(c => `<script type="text/javascript" src="/${c}"></script>`);

    // now inject the rendered app into our html and send it to the client
    return res.send(
      htmlData
      // write the React app
        .replace('<div id="root"></div>', `<div id="root">${AppString}</div>`)
        // write the string version of our state
        .replace('__INITIAL_STATE__={}', `__INITIAL_STATE__=${reduxState}`)
        // append the extra js assets
        .replace('</body>', extraChunks.join('') + '</body>')
    );
  });
};
