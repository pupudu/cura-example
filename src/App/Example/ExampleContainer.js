import {connect} from 'react-redux';
import Example from './Example';

let mapStateToProps = ({app}) => ({
  title: app.message
});

let mapDispatchToProps = () => {

};

export default connect(mapStateToProps, mapDispatchToProps)(Example)