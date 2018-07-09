import React from 'react';
import Helmet from 'react-helmet';

class SetupHelmet {

  replacer() {
    const helmet = Helmet.renderStatic();

    return [
      '<meta name="_helmet_hydrate_">',
      `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      `
    ]
  }

  render(children) {
    return children;
  }

}

export default new SetupHelmet();