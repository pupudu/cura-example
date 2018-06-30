import preval from 'babel-plugin-preval/macro';


// This should be updated based on the project directory structure. For now we assume everyone using this
// will have a src/ directory and write all the code there
let rootPrefix = "./src/App/";

/**
 * Build a path string to decide how many directories we should go behind to find the root directory
 * Without this, when the location of this file changes, the require(<filePath>) statement will break
 * @return {string}
 */
// function getPathDiff() {
//   // TODO - unused because of how webpack works under the hood. Can we use this so that can do real dynamic imports?
//   let absolutePath = preval`module.exports = __dirname`;
//   let relativePath = absolutePath.substring(absolutePath.indexOf("src/"));
//   let depth = relativePath.split("/").length - 1;
//
//   let pathDiff = "";
//
//   for (let i = 0; i < depth; i++) {
//     pathDiff += "../"
//   }
//
//   return pathDiff;
// }


/**
 * Read the metadata from the given file path
 * Replace the root prefix with the result from getPathDiff because the require is run relative to this module
 * @param {string} path - file path relative to the root of the app
 * @param {string} fileName - default file name of the fetch metadata files
 * @return {*}
 */
function readFile(path, fileName) {
  path = path.replace(rootPrefix, '');
  path = path.replace(`${fileName}.js`, '');

  // It is very important to have the prefix(../../App/) in same line as "require" due to how webpack handles
  // dynamic require statements
  return require(`../../App/${path}${fileName}`).default;
}


/**
 * Read and combine metadata from all the files with the pre defined file name
 * @return combined metadata file
 */
export default function () {

  // Note: currently this cannot be passed as a param due to how the preval macro works
  const fileName = 'fetchMetadata';

  // Since glob works only in Nodejs, pre evaluate the file locations of fetch metadata files at build time
  let files = preval`
    let glob = require('glob');
    module.exports = glob.sync('./src/**/${fileName}.js');
  `;

  files = files || [];

  // Read and combine all metadata files here
  return files.reduce((metadata, path) => {
    // TODO: Throw an exception if duplicate keys are found
    return {
      ...metadata,
      ...readFile(path, fileName)
    }
  }, {});
}

// TODO might be able to simplify all this using import-all.macro :)
