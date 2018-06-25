import {appReducer} from "../App/appReducer";
import {combineReducers} from "redux";
import {createFetchStatusReducer} from './fetch/fetchStatusReducer';


let fetchStatus = createFetchStatusReducer({});

export default combineReducers({
  app: appReducer,
  fetchStatus
});