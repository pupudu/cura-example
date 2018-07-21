import React from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

class SetupStyledComponents {
  constructor() {
    this.sheet = new ServerStyleSheet();
  }

  replacer() {
    return ['<style class="_styled_hydrate_"></style>', `${this.sheet.getStyleTags()}`];
  }

  render(children) {
    return <StyleSheetManager sheet={this.sheet.instance}>{children}</StyleSheetManager>;
  }
}

export default new SetupStyledComponents();
