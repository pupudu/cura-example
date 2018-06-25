import { all } from 'redux-saga/effects';

// Import your Sagas here
import {createFetchSaga} from './fetch/fetchSaga';

// Create a fetch saga
let fetchSaga = createFetchSaga({});


/**
 * Combine all your sagas here
 */
export default function* rootSaga() {
  yield all([
    fetchSaga(),
  ]);
}
