import React from 'react';
import {StaticRouter} from 'react-router';

class SetupReactRouter {

  replacer() {
    return []
  }

  render(children, req) {
    this.context = {};

    return <StaticRouter location={req.url} context={this.context}>
      {children}
    </StaticRouter>
  }

  middleware(req, res) {
    if (this.context.url) {
      res.redirect(this.context.status || 301, this.context.url);
      return false;
    }
  }
}

export default new SetupReactRouter();