import {all} from 'redux-saga/effects';

// Import your Sagas here
import {createFetchSaga, registerPreProcessor} from './reactools/fetch/fetchSaga';
import fetchMetadata from './rootMetadata';

// Create a fetch saga
let fetchSaga = createFetchSaga(fetchMetadata);

// Register Pre Processors
registerPreProcessor("auth", (options) => {
  options.headers = {
    ...(options.headers || {}),
    token: "***********__ JWT TOKEN __****************"
  };
  return options;
});

/**
 * Combine all your sagas here
 */
export default function* rootSaga() {
  yield all([
    fetchSaga(),
  ]);
}
