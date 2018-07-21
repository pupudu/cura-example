import React from 'react';
import Loadable from 'react-loadable';

// function to extract js assets from the manifest
const extractAssets = (assets, chunks) =>
  Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
    .map(k => assets[k]);

class SetupLoadable {
  constructor() {
    this.modules = [];
  }

  init(manifest) {
    this.manifest = manifest;
  }

  replacer() {
    // map required assets to script tags
    const extraChunks = extractAssets(this.manifest, this.modules).map(
      c => `<script type="text/javascript" src="${c}"></script>`
    );

    return ['</body>', `${extraChunks.join('')} </body>`];
  }

  render(children) {
    return <Loadable.Capture report={m => this.modules.push(m)}>{children}</Loadable.Capture>;
  }
}

export default new SetupLoadable();
