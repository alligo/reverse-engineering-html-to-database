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
    database: Conf.database
  });
  //console.log('DEBUG: datatodb ', conn);
};

module.exports.save = function (article) {
  console.log('@todo', article);
};
module.exports.end = function () {
  conn.end();
};

console.log('DEBUG: loaded datatodb.js');
