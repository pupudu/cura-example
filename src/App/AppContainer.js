import {connect} from "react-redux";
import App from './App'
import {makeFetcher} from '../internals/reactools/actionCreatorsFactory';
import {bindActionCreators} from 'redux';

let exampleKey = "exampleKey";

let mapStateToProps = ({fetchData, fetchStatus}) => ({
  fetchData: fetchData[exampleKey],
  fetchStatus: fetchStatus[exampleKey]
});

let mapDispatchToProps = dispatch => bindActionCreators({
  updateMessage: makeFetcher(exampleKey),
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(App);