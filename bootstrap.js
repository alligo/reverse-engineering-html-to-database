/**
 * Common rountines
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */


/**
 * Like require, but try different files, in order
 *
 * @param   {Array} filepaths
 * @returns \require|false
 */
function requireOneOf(filepaths) {
  var fs = require('fs'), i, n = filepaths.length;
  function exists(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  }
  for (i = 0; i < n; i++) {
    if (exists(filepaths[i])) {
      return require(filepaths[i]);
    }
  }
  console.log('Error! No file to load', filepaths);
  return false;
}

module.exports = {
  requireOneOf: requireOneOf
};
