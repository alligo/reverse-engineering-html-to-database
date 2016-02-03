/**
 * Main file. Run with command `node index.js`
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var fs = require('fs');
var readdirp = require('readdirp');
var config = require('./bootstrap').requireOneOf(['./config.js', './config.dist.js']);
var HTMLToData = require('./bootstrap').requireOneOf(['./htmltodata.js', './htmltodata.dist.js']);
var DataToDb = require('./bootstrap').requireOneOf(['./datatodb.js', './datatodb.dist.js']);

DataToDb.init(config.database);

var nOk = 0, nErrors = 0, validFiles = [];

// Read and prepare all filepaths, Async
readdirp({root: config.htmls_path, fileFilter: config.file_filters}).on('data', function (entry) {

  //console.log(entry.path, entry.fullPath);
  validFiles.push({path: entry.path, fullPath: entry.fullPath});
  //var content = fs.readFileSync(entry.fullPath);
  //var metadata = HTMLToData.parse(content, entry.path);
  //if (metadata) {
  //  DataToDb.save(metadata);
  //}

  nOk += 1;
}).on('warn', function (err) {
  nErrors += 1;
  //console.error('non-fatal error', err);
}).on('error', function (err) {
  nErrors += 1;
  //console.error('fatal error', err);
}).on('end', function (xpto) {
  processFiles(validFiles);
  console.log('HTMLtoDB: OK ' + nOk + ', Errors ' + nErrors);
});

// Main function to receive all paths
function processFiles(validFiles) {
  var validFile = null, htmlString = null;
  if (validFiles && validFiles.length) {
    //console.log(validFiles.length);
    validFile = validFiles.shift();
    //console.log(validFile);
    htmlString = fs.readFileSync(validFile.fullPath);
    HTMLToData.parse(function (err, htmlData) {
      if (err) {
        //console.log('HTMLtoDB: HTMLToData.parse ERROR for ' + validFile.path + ': ' + JSON.stringify(err));
      } else {
        // save htmlData
        DataToDb.save(function (err2) {
          if (err2) {
            console.log('HTMLtoDB: DataToDb.save ERROR for ' + validFile.path + ': ' + JSON.stringify(err));
          }
        }, htmlString);
      }
      processFiles(validFiles);
    }, htmlString, validFile.path);
  } else {
    console.log('HTMLtoDB: processFiles end');
  }
}