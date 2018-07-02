export default (metadataMap) =>
  Object.keys(metadataMap).reduce((metadata, key) => ({
    ...metadata,
    ...metadataMap[key].default
  }), {})