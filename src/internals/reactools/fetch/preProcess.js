let preProcessors = [];

/**
 * Pre process the corresponding fetch metadata entry with previously registered pre processors
 * @param entry - fetch metadata entry
 */
export function preProcess(entry) {
  return preProcessors.reduce((processedEntry, {flag, handler}) => {
    if (entry[flag]) {
      return {
        ...processedEntry,
        options: handler(processedEntry.options) || processedEntry.options
      };
    }
    return processedEntry;
  }, entry);
}

/**
 * Register a middleware to modify the metadata entry before making the fetch call
 * @param flag - a flag to check if we need to call the handler or not
 * @param handler - pre processor to do exactly what it means
 */
export function registerPreProcessor(flag, handler) {
  preProcessors.push({
    flag,
    handler
  })
}
