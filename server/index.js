import express from 'express';
import Loadable from 'react-loadable';
import path from 'path';

import routes from './router';
import serverRenderer from './universalMiddleware';

const PORT = 3000;

// initialize the application and create the routes
const app = express();

const actionIndex = (req, res, next) => {
  // Can dispatch a fetch action, then call next inside the action callback
  next();
};

app.use(routes);

// root (/) should always serve our server rendered page
// Without this line, express will serve the index.html file as a static file before the app is server rendered
app.use('^/$', actionIndex, serverRenderer);

// other static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), {
    maxAge: '30d'
  })
);

// Now we serve our app for all cases where a static resource or an API route is not found
app.use('^/', actionIndex, serverRenderer);

// start the app
Loadable.preloadAll().then(() => {
  app.listen(PORT, error => {
    if (error) {
      return console.log('something bad happened', error);
    }

    console.log('listening on ' + PORT + '...');
  });
});
