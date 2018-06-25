import express from "express";
import {createMemoryHistory} from 'history';
const path = require("path");

import createUniversalRenderer from '../middleware/createUniversalRenderer';
import createStore from '../../src/internals/store';
import { setAsyncMessage } from '../../src/App/appReducer';
import App from '../../src/App'

// get the html file created with the create-react-app build
const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');
const manifest = require(`../../${"build"}/asset-manifest.json`); // import the manifest generated with the create-react-app build

const router = express.Router();

const history = createMemoryHistory();
const store = createStore({}, history);
const serverRenderer = createUniversalRenderer({App, index: filePath, manifest, store});

const actionIndex = (req, res, next) => {
  // store.dispatch(setAsyncMessage("Hi, I'm from server!"))
  //   .then(() => {
  //     next();
  //   });
  next();
};


// root (/) should always serve our server rendered page
router.use('^/$', actionIndex, serverRenderer);

// other static resources should just be served as they are
router.use(express.static(
  path.resolve(__dirname, '..', '..', 'build'),
  { maxAge: '30d' },
));

export default router;
