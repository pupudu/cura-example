import {connect} from 'react-redux';
import Example from './Example';

let mapStateToProps = ({fetchData}) => ({
  data: fetchData.exampleKey
});

let mapDispatchToProps = () => {

};

export default connect(mapStateToProps, mapDispatchToProps)(Example)