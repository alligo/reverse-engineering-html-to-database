/**
 * File that receives HTML string and convert, if possible, to useful data.
 * To customize, copy this file to htmltodata.js and make your changes
 * 
 * @package       reverse-engineering-html-to-database
 * @copyright     Copyright (C) 2016 Alligo LTDA.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */
var cheerio = require('cheerio');
var HTMLToData;

function pageType1($) {

}

module.exports.parse = function (cb, htmlstring, relativepath) {
  var error = null, htmlData = null, isArticle, articleRoot, $ = cheerio.load(htmlstring);
  isArticle = $('#k2Container.itemView');
  articleRoot = $('#k2Container');
  if (isArticle.length) {
    console.log('INFO:   OK     articleRoot', relativepath);
  } else {
    console.log('INFO:   SKIP   ', relativepath);
  }
  //console.log('@todo HTMLToData.parse', htmlstring, relativepath);
  cb(error, htmlData);
};

console.log('DEBUG: loaded htmltodata.js');