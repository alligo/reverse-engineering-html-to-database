var config = require('./config');
var readdirp = require('readdirp');
var HTMLToData = require('./htmltodata');

var db = require('mysql').createConnection({
  host     : config.database.host,
  port     : config.database.port,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.database
});

var nOk = 0, nErrors = 0;

readdirp({ root: config.htmls_path, fileFilter: config.file_filters })
  .on('data', function (entry) {
    // do something with each JavaScript file entry
    //console.log(entry.path);
    nOk += 1;
  })
  .on('warn', function (err) { nErrors += 1; console.error('non-fatal error', err); })
  .on('error', function (err) { nErrors += 1; console.error('fatal error', err); })
  .on('end', function (xpto) {
    console.log('HTMLtoDB: OK '  + nOk + ', Errors ' + nErrors);
  })
  ;




//db.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//  if (err) throw err;
//
//  console.log('The solution is: ', rows[0].solution);
//});


db.end();