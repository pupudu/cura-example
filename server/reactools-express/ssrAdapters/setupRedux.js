import React from 'react';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';

class SetupRedux {
  init(store) {
    this.store = store;
  }

  replacer() {
    const reduxState = this.store.getState();

    return ['__INITIAL_STATE__={}', `__INITIAL_STATE__=${serialize(reduxState)}`];
  }

  render(children) {
    return <Provider store={this.store}>{children}</Provider>;
  }
}

export default new SetupRedux();
