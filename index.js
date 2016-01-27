/**
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var readdirp = require('readdirp');
var config = require('./bootstrap').requireOneOf(['./config.js', './config.dist.js']);
var HTMLToData = require('./bootstrap').requireOneOf(['./htmltodata.js', './htmltodata.dist.js']);
var DataToDb = require('./bootstrap').requireOneOf(['./datatodb.js', './datatodb.dist.js']);

var db = require('mysql').createConnection({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

var nOk = 0, nErrors = 0;

readdirp({root: config.htmls_path, fileFilter: config.file_filters}).on('data', function (entry) {
  // do something with each JavaScript file entry
  //console.log(entry.path);
  nOk += 1;
}).on('warn', function (err) {
  nErrors += 1;
  //console.error('non-fatal error', err);
}).on('error', function (err) {
  nErrors += 1;
  //console.error('fatal error', err);
}).on('end', function (xpto) {
  console.log('HTMLtoDB: OK ' + nOk + ', Errors ' + nErrors);
});



db.end();