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


/**
 * Helper. Remove line breaks and trim
 *
 * @param   {String}   item
 * @returns {String}
 */
function clearTrash(item) {
  var result = null;
  if (item && item.replace) {
    //result = item.replace(/[^a-z0-9\s]/gi, '').trim();
    result = item.replace("\r\n", '').replace("\n", '').trim();
  }

  return result;
}

/**
 * Scrap article data from page of type 1
 * 
 * @param   {\cheerio}   $   cheerio loaded with full htmlstring
 * @returns {Object}
 */
function pageType1($) {
  var htmlData = {}, title, created_at, author, articleRoot = $('#k2Container');

  if ($('#k2Container .itemTitle').length) {
    htmlData.title = clearTrash($('#k2Container .itemTitle').clone().children().remove().end().text());
  }
  if ($('#k2Container .itemAuthor').length) {
    htmlData.author_raw = clearTrash($('#k2Container .itemAuthor').text());
  }
  if ($('#k2Container .itemFullText').length) {
    //htmlData.text = clearTrash($('#k2Container .itemFullText').html());
  }

  console.log(htmlData);

  //return $.html();
  return htmlData;
}

module.exports.parse = function (cb, htmlstring, relativepath) {
  var error = null, htmlData = null, isArticle, articleRoot, $ = cheerio.load(htmlstring);
  isArticle = $('#k2Container.itemView');
  articleRoot = $('#k2Container');
  if (isArticle.length) {
    console.log('INFO:   OK     articleRoot', relativepath);
  } else {
    //console.log('INFO:   SKIP   ', relativepath);
  }

  //if ($('#k2Container.itemView').length) {
  if ($('#k2Container.colunistas-page').length) {
    //htmlData = pageType1($('#k2Container'));
    //htmlData = pageType1(htmlstring);
    htmlData = pageType1($);
    //console.log(relativepath, htmlData);
  } else {
    // ...
  }

  //console.log('@todo HTMLToData.parse', htmlstring, relativepath);
  cb(!htmlData, htmlData);
};

console.log('DEBUG: loaded htmltodata.js');