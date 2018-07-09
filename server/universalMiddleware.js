import path from 'path';
import {createMemoryHistory} from "history";

import createUniversalRenderer from "./reactools-express/createUniversalRenderer";
import App from "../src/App";
import createStore from "../src/internals/store";

import setupRedux from "./reactools-express/ssrAdapters/setupRedux";
import setupHelmet from "./reactools-express/ssrAdapters/setupHelmet";
import setupReactRouter from "./reactools-express/ssrAdapters/setupReactRouter";
import setupLoadable from "./reactools-express/ssrAdapters/setupLoadable";
import setupStyledComponents from './reactools-express/ssrAdapters/setupStyledComponents';


// get the html file created with the create-react-app build
const filePath = path.resolve(__dirname, '..', 'build', 'index.html');
const manifest = require(`../${"build"}/asset-manifest.json`); // import the manifest generated with the create-react-app build

// Setup the redux store and initialize the redux adapter
const history = createMemoryHistory();
const store = createStore({}, history);
setupRedux.init(store);

// Setup the react-loadable adapter
setupLoadable.init(manifest);

export default createUniversalRenderer({
  App,
  index: filePath,
  adapters: {
    router: setupReactRouter,
    redux: setupRedux,
    helmet: setupHelmet,
    styled: setupStyledComponents,
    loadable: setupLoadable,
  },
  features: [
    'router',
    'redux',
    'helmet',
    'styled',
    'loadable',
  ]
});
