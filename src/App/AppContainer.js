import App from './App'
import {bindActionCreators} from '../internals/reactools/reduxPatches/bindActionCreators';
import {connectWithRouter} from '../internals/reactools/reduxPatches/connect';

let exampleKey = "exampleKey";

let mapStateToProps = ({fetchData, fetchStatus}) => ({
  fetchData: fetchData[exampleKey],
  fetchStatus: fetchStatus[exampleKey]
});

let mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);


export default connectWithRouter(mapStateToProps, mapDispatchToProps)(App);