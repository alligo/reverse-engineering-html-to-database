/**
 * Logic to save individual parsed files to the database. If want
 * changes, rename to datatodb.js and do it
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var mysql = require('mysql');
var conn;

module.exports.init = function (Conf) {
  conn = require('mysql').createConnection({
    host: Conf.host,
    port: Conf.port,
    user: Conf.user,
    password: Conf.password,
    database: Conf.name
  });
  //console.log('DEBUG: datatodb ', conn);
};

module.exports.save = function (cb, htmlData) {
  var error = null, html = null, query;
  if (htmlData) {
    //console.log((new Date()).toJSON() + '> @todo DataToDb.save', htmlData);
    query = conn.query('REPLACE INTO articles SET ?', htmlData, function (err, result) {
      if (err) {
        console.log((new Date()).toJSON() + '> ERROR: DataToDb inserted ', err);
        //throw err;
      } else {
        console.log((new Date()).toJSON() + '> INFO: DataToDb inserted ', result.insertId);
      }
      
      
      cb && cb(err);
    });
    //console.log((new Date()).toJSON() + '> DEBUG DataToDb query', query);
  } else {
    //console.log((new Date()).toJSON() + '> INFO: DataToDb');
    cb && cb(error);
  }
  
};
module.exports.end = function () {
  conn.end();
};

console.log((new Date()).toJSON() + '> DEBUG: loaded datatodb.js');
