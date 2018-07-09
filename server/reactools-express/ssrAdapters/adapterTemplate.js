import React from 'react';

class Adapter {

  constructor() {

  }

  init() {

  }

  replacer() {
    return [
      'TEXT_IN_HTML', `TEXT_TO_SUBSTITUTE`
    ]
  }

  render(children, req, res, next) {
    return children;
  }

  middleware(req, res, next) {

  }
}

export default new Adapter();