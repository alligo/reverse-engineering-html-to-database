/**
 * Configuration file. Rename to confi.js and change parameters
 *
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var config = {};

config.database = {};
config.database.name = 'db_htmltodb';
config.database.host = 'localhost';
config.database.port = '3306';
config.database.user = 'root';
config.database.password = '';

config.htmls_path = '/path/to/your/htmls/files';
// If parsing a subfolder of your site, but want to prefix the URL with top path:
config.htmls_path_prefix = '';
config.file_filters = ['*.html', '*.htm', '*.php', '*.jsp'];

module.exports = config;

console.log((new Date()).toJSON() + '> DEBUG: loaded config.dist.js');