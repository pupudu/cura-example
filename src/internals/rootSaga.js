import { all } from 'redux-saga/effects';

// Import your Sagas here
import { createFetchSaga } from './reactools/fetch/fetchSaga';
import fetchMetadata from './rootMetadata';
import { registerPreProcessor } from './reactools/fetch/preProcess';

// Create a fetch saga
let fetchSaga = createFetchSaga(fetchMetadata);

// Register a pre processor for attaching a token for authenticated routes automatically
registerPreProcessor('auth', options => {
  options.headers = {
    ...(options.headers || {}),
    token: '***********__ JWT TOKEN __****************'
  };
  return options;
});

/**
 * Combine all your sagas here
 */
export default function* rootSaga() {
  yield all([fetchSaga()]);
}
