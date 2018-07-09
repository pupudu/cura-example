
export const replaceHTML = (html, replacer) => html.replace(replacer[0], replacer[1]);

export const processHTML = (htmlData, features, adapters) => features.reduce((processedHtmlData, feature) => {
  if (adapters[feature]) {
    return replaceHTML(processedHtmlData, adapters[feature].replacer());
  }
  return processedHtmlData;
}, htmlData);
