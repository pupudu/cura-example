import React from 'react';
import Loadable from "react-loadable";

export default Loadable({
  loader: () => import(/* webpackChunkName: "myNamedChunk" */ './ExampleContainer'),
  loading: () => <div>loading...</div>,
  modules: ['myNamedChunk'],
});
