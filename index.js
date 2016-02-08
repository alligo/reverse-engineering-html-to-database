/**
 * Main file. Run with command `node index.js`
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

// node index.js --max-old-space-size=8192 --max-stack-size 32000
// node index.js --max-old-space-size=8192 --stack_size 32000

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

  nOk += 1;
}).on('warn', function (err) {
  nErrors += 1;
  //console.error('non-fatal error', err);
}).on('error', function (err) {
  nErrors += 1;
  //console.error('fatal error', err);
}).on('end', function (xpto) {

  processFiles(validFiles);
  console.log((new Date()).toJSON() + '> INFO: HTMLtoDB OK ' + nOk + ', Errors ' + nErrors);
});

// Main function to receive all paths
function processFiles(validFiles) {
  var validFile = null, htmlString = null;
  if (validFiles && validFiles.length) {
    //console.log((new Date()).toJSON() + '> INFO: processFiles remaining ', validFiles.length);
    validFile = validFiles.shift();

    htmlString = fs.readFileSync(validFile.fullPath);
    HTMLToData.parse(function (err, htmlData) {
      if (err) {
        //console.log('HTMLtoDB: HTMLToData.parse ERROR for ' + validFile.path + ': ' + JSON.stringify(err));
        //processFiles(validFiles);
        setImmediate(function() {processFiles(validFiles);});
      } else {
        if (htmlData && htmlData.id) {
          console.log((new Date()).toJSON() + '> INFO processFiles will try save [' + htmlData.id + '] ' + validFile.path);

          // save htmlData
          DataToDb.save(function (err2) {
            if (err2) {
              console.log((new Date()).toJSON() + '> ERROR HTMLtoDB: DataToDb.save for ' + validFile.path + ': ' + JSON.stringify(err));
            }
            //processFiles(validFiles);
            setImmediate(function() {processFiles(validFiles);});
          }, htmlData);
        } else {
          console.log((new Date()).toJSON() + '> NOTICE processFiles cannot extract metadada from ' + validFile.path);
          //processFiles(validFiles);
          setImmediate(function() {processFiles(validFiles);});
        }
      }
      //processFiles(validFiles);
    }, htmlString, config.htmls_path_prefix + validFile.path);
  } else {
    console.log((new Date()).toJSON() + '> INFO HTMLtoDB: processFiles (loop only) end');
  }
}