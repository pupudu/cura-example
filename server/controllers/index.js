import express from "express";
import {createMemoryHistory} from 'history';
const path = require("path");

import createUniversalRenderer from '../reactools-express/createUniversalRenderer';
import createStore from '../../src/internals/store';
import App from '../../src/App'

// get the html file created with the create-react-app build
const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');
const manifest = require(`../../${"build"}/asset-manifest.json`); // import the manifest generated with the create-react-app build

const router = express.Router();

const history = createMemoryHistory();
const store = createStore({}, history);
const serverRenderer = createUniversalRenderer({App, index: filePath, manifest, store});

const actionIndex = (req, res, next) => {
  // Can dispatch a fetch action, then call next inside the action callback
  next();
};

router.use(express.static(
// other static resources should just be served as they are
path.resolve(__dirname, '..', '..', 'build'),
{ maxAge: '30d' },
));

router.get('/exampleEndpoint', (req, res)=>{
  console.log(req.headers.token);
  setTimeout(()=>{
    res.json({
      message: "Hello Universal App"
    })
  }, 5000);
});

// root (/) should always serve our server rendered page
router.use('^/', serverRenderer);


export default router;
