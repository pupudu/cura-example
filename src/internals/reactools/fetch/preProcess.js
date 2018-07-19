let preProcessors = {};

/**
 * Pre process the corresponding fetch metadata entry with previously registered pre processors
 * @param entry - fetch metadata entry
 */
export function preProcess(entry) {
  if (!entry.preProcessors) {
    return entry;
  }
  const entryProcessors = Array.isArray(entry.preProcessors) ? entry.preProcessors : [entry.preProcessors];
  return entryProcessors.reduce((processedEntry, key) => {
    return {
      ...processedEntry,
      options: preProcessors[key](processedEntry.options) || processedEntry.options
    }
  }, entry);
}

/**
 * Register a middleware to modify the metadata entry before making the fetch call
 * @param flag - a flag to check if we need to call the handler or not
 * @param handler - pre processor to do exactly what it means
 */
export function registerPreProcessor(flag, handler) {
  preProcessors[flag] = handler;
}
