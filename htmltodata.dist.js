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
var data_categories = require('./bootstrap').requireOneOf(['./aditional_info/data_categories.json', './aditional_info/data_categories.dist.json']);
//var default_category_alias = 'uncategorised';
var default_category_id = 2;
var default_created_at = '2016-01-01 12:00:00';
var default_author_alias = null;
var default_author_id = 255;


/**
 * Convert Author Alias to an Author ID
 * @param   {String}   author_alias
 * @returns {Number}
 */
function ArticleAuthorId(author_alias) {

  // If you really want this, you can copy same logic as ArticleCategoryId.
  // but for this author, just use a default author is sufficient.
  return default_author_id;
}

/**
 * Convert one url to article Slug
 * Change if you need
 *
 * @example
 * ArticleSlug('/path/to/article-alias-123') // article-alias
 * ArticleSlug('/path/to/article-alias123') // article-alias123
 * 
 * @param   {String}  url
 * @returns {String}
 */
function ArticleSlug(url) {
  var slug = null, urlParts, urlParts2, tmp, tmp2;
  if (url && url.split) {
    urlParts = url.split('/');
    if (urlParts.length > 1) {
      tmp = urlParts[urlParts.length - 1];
      urlParts2 = tmp.split('-');

      // If last part of URL is integer, ignore from alias
      if (parseInt(urlParts2[urlParts2.length - 1], 10)) {
        urlParts2.pop();
        slug = urlParts2.join('-');
      } else {
        slug = urlParts2.join('-');
      }
    }
  }
  return slug;
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
function ArticleCategoryId(category_alias) {
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
function ArticleId(url) {
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
 * On this example, files for URLs /folder/article-123 was saved as 
 * /folder/article-123.html, so we reverse this logic
 *
 * @param   {String}  relativePath
 * @returns {String}
 */
function  ArticleUrl(relativePath) {

  if (relativePath.slice(-5) === '.html') {
    return relativePath.slice(0, -5);
  }

  return relativePath;
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
//    if (htmlData.id && htmlData.title && htmlData.text) {
    if (htmlData.id && parseInt(htmlData.id, 10)
            && htmlData.title && htmlData.title.length > 2
            && htmlData.text) {
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
function DOMToMetadata1($, url, id) {
  var htmlData = {}, urlParts, articleRoot = $('#k2Container', {decodeEntities: true});

  if ($('#k2Container .itemTitle').length) {
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
    htmlData.catid = ArticleCategoryId(htmlData.category_raw);
  }

  htmlData.created_at = default_created_at;
  //htmlData.modified_at = default_created_at;

  htmlData.slug = ArticleSlug(url);
  htmlData.created_by = ArticleAuthorId(htmlData.author_raw);
  htmlData.url_raw = url;
  htmlData.id = id;

  return htmlData;
}

/**
 * Placeholder. Create your custom parsers
 *
 * @returns {String}
 */
function DOMToMetadata2() {
  return "@todo create your own DOM to Article Metadata";
}

module.exports.parse = function (cb, htmlstring, relativepath) {
  var error = null, htmlData = null, /*isArticle, articleRoot, */$ = cheerio.load(htmlstring);

  // Simple check if this is a parseable page that DOMToMetadata1() know
  if ($('#k2Container .itemFullText').length) {
    htmlData = DOMToMetadata1($, ArticleUrl(relativepath), ArticleId(ArticleUrl(relativepath)));
  }

  // Now you can create new checks or even create new parser DOMToMetadata2

  htmlData = filterPageResult(htmlData);

  cb(!htmlData, htmlData);
};

console.log((new Date()).toJSON() + '> DEBUG: loaded htmltodata.js');