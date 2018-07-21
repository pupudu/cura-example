import { combineReducers } from 'redux';
import { createFetchStatusReducer } from './reactools/fetch/fetchStatusReducer';
import { fetchDataSetterReducer } from './reactools/reducerFactory';
import fetchMetadata from './rootMetadata';

let fetchStatus = createFetchStatusReducer(fetchMetadata);

export default combineReducers({
  fetchStatus,
  fetchData: fetchDataSetterReducer
});
