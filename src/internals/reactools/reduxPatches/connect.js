import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export const connectWithRouter = (...args) => (children) => {
  return withRouter(connect(...args)(children));
};
