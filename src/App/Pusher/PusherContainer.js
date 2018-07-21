import { connect } from 'react-redux';
import Pusher from './Pusher';
import { bindActionCreators } from '../../internals/reactools/reduxPatches/bindActionCreators';
import { makeFetcher } from '../../internals/reactools/actionCreatorsFactory';

let exampleKey = 'exampleKey';

let mapStateToProps = () => ({});

let mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateMessage: makeFetcher(exampleKey)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pusher);
