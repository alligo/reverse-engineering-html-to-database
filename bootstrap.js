/**
 * Common rountines
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var startTime = null;

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
  console.log((new Date()).toJSON() + '> ERROR requireOneOf: No file to load', filepaths);
  return false;
}

function start() {
  startTime = new Date();
}

function totalTime(jobsNumber, info) {
  var end = new Date();
  var time = ((end.getTime() - startTime.getTime()) / 1000 / 60); // min
  console.log((new Date()).toJSON() + '> INFO : totalTime ' + info + ' '+ time.toFixed(2) + 'min. ' + (jobsNumber / time).toFixed(2) + ' jobs/min');
}

module.exports = {
  requireOneOf: requireOneOf,
  start: start,
  totalTime: totalTime
};
