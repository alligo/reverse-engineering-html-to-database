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
var data_categories = require('./bootstrap').requireOneOf(['./data_categories.json', './data_categories.dist.json']);
//var default_category_alias = 'uncategorised';
var default_category_id = 2;
var default_created_at = '2016-01-01 12:00:00';
var default_author_alias = null;
var default_author_id = 255;

//console.log(data_categories.rows);

function authorId(author_alias) {
  return default_author_id;
}

/**
 * This function read on JSON array, like data_categories.dist.json
 * and try to convert one article alias to ID. If you want to rebuild
 * your site, fist try to create all categories, and then parse the HTML files
 * 
 * PROTIP: data_categories.dist.json was generated with HeidSQL, query
 * "SELECT id, alias FROM tb_categories" and JSON export feature
 * 
 * @param   {String}   category_alias
 * @returns {Integer}
 */
function categoryId(category_alias) {
  var i;
  if (data_categories && data_categories.rows) {
    for (i = 0; i < data_categories.rows.length; i++) {
      if (data_categories.rows[i].alias === category_alias) {
        return parseInt(data_categories.rows[i].id, 10);
      }
    }
  }
  return default_category_id;
}

/**
 * On this example, files for URLs article IDs was at the end of a parsed URL,
 * like /folder/article-123
 *
 * @param   {String}  url
 * @returns {String}
 */
function id(url) {
  var uid = null, temp;
  if (url && url.split) {
    temp = url.split('-').pop();
    if (parseInt(temp, 10)) {
      uid = parseInt(temp, 10);
    }
  }
  return uid;
}

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
 * For htmlData parsed from a page, check if have at least some basic fields.
 * If not, will return null
 *
 * @param   {Object}  htmlData
 * @returns {Object}
 */
function filterPageResult(htmlData) {
  if (htmlData) {
    if (htmlData.id && htmlData.title && htmlData.text) {
      return htmlData;
    }
    //console.log((new Date()).toJSON() + '> NOTICE: filterPageResult ignoring parsed data (no ID / title / text)');
  }
  return null;
}

/**
 * Scrap article data from page of type 1
 * 
 * @param   {\cheerio}   $    cheerio loaded with full htmlstring
 * @param   {String}     url  
 * @param   {Integer}    id  
 * @returns {Object}
 */
function pageType1($, url, id) {
  var htmlData = {}, urlParts, articleRoot = $('#k2Container', {decodeEntities: true});

  if ($('#k2Container .itemTitle').length) {
    //console.log($('#k2Container .itemTitle').text());
    //console.log($('#k2Container .itemTitle').clone().children().remove().end().text());
    htmlData.title = clearTrash($('#k2Container .itemTitle').clone().children().remove().end().text());
  }
  if ($('#k2Container .itemAuthor').length) {
    htmlData.author_raw = clearTrash($('#k2Container .itemAuthor').text());
  }
  if ($('#k2Container .itemFullText').length) {
    htmlData.text = clearTrash($('#k2Container .itemFullText').html());
  }

  // O this demo, category ID is the upper path (if exist)
  // /blablala/category-name/article-name-123
  urlParts = url.split('/');
  if (urlParts.length > 1) {
    htmlData.category_raw = urlParts[urlParts.length - 2];
    htmlData.catid = categoryId(htmlData.category_raw);
  }
  htmlData.created_at = default_created_at;
  //htmlData.modified_at = default_created_at;

  htmlData.created_by = authorId(htmlData.author_raw);
  htmlData.url_raw = url;
  htmlData.id = id;

//   -- OK -- `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   -- OK -- `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
//   -- OK -- `text` text COLLATE utf8_unicode_ci NOT NULL,
//   -- OK -- `url_raw` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//   -- OK -- `category_raw` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//  `tags_raw` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//   -- OK -- `author_raw` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//  `created_at` datetime NOT NULL,
//  `modified_at` datetime NOT NULL,
//  console.log((new Date()).toJSON() + '> htmlData', htmlData);

  //return $.html();
  return htmlData;
}

/**
 * On this example, files for URLs /folder/article-123 was saved as 
 * /folder/article-123.html, so we reverse this logic
 *
 * @param   {String}  relativePath
 * @returns {String}
 */
function url(relativePath) {

  if (relativePath.slice(-5) === '.html') {
    return relativePath.slice(0, -5);
  }

  return relativePath;
}

module.exports.parse = function (cb, htmlstring, relativepath) {
  var error = null, htmlData = null, isArticle, articleRoot, $ = cheerio.load(htmlstring);
  isArticle = $('#k2Container.itemView');
  articleRoot = $('#k2Container');
  if (isArticle.length) {
    //console.log((new Date()).toJSON() + '> INFO:   OK     articleRoot', relativepath);
  } else {
    //console.log((new Date()).toJSON() + '> INFO:   SKIP   ', relativepath);
  }

  //if ($('#k2Container.itemView').length) {
  if ($('#k2Container.colunistas-page').length) {
    //htmlData = pageType1($('#k2Container'));
    //htmlData = pageType1(htmlstring);
    htmlData = pageType1($, url(relativepath), id(url(relativepath)));
    //htmlData = pageType1($, relativepath);
    //console.log(relativepath, htmlData);
  } else {
    // ...
  }
  //htmlData = filterPageResult(htmlData);

  //console.log('@todo HTMLToData.parse', htmlstring, relativepath);
  cb(!htmlData, htmlData);
};

console.log((new Date()).toJSON() + '> DEBUG: loaded htmltodata.js');