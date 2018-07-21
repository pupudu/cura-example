import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

import { processHTML } from './utils';

export default ({ App, index, features = [], adapters = {} }) => (req, res, next) => {
  fs.readFile(index, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('err', err);
      return res.status(404).end();
    }

    // render the app as a string
    const AppString = ReactDOMServer.renderToString(
      features.reduce((bundle, feature) => {
        return adapters[feature].render(bundle, req, res);
      }, <App />)
    );

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      if (adapters[feature].adapterDidMount) {
        let status = adapters[feature].adapterDidMount(req, res);
        if (status === false) {
          return;
        }
      }
    }

    htmlData = processHTML(htmlData, features, adapters);

    // now inject the rendered app into our html and send it to the client
    return res.send(
      htmlData
        // write the React app
        .replace('<div id="root"></div>', `<div id="root">${AppString}</div>`)
    );
  });
};
