# Reverse Engineering: From HTML to Database v0.4alpha

_Did you lost your site with no Backup? Try [Google Cache Site Recover](https://github.com/alligo/google-cache-site-recover)
to save your entire site in pure HTML files, than use this tool here to convert
back to database._

This is a _work-in-progress_ way to recursively parse all HTMLs in a folder and
save structured data on a database. Since each HTML is unique, is very likely
that you will need make chances to make it work with your HTMLs files and also
with how you would like to store on your database.

## How to install

    git clone https://github.com/alligo/reverse-engineering-html-to-database.git .
    npm install

## Minimum configuration (required)

Copy `config.dist.js` to `config.js` and change the html root folder and how
to access your database

If you will use MySQL to store your data, import to one database the file
`database.sql`

## How to customize HTML parser (required)

By default, it will try use `htmltodata.dist.js`, file that was used to import
HTML saved from a Joomla CMS site with K2 extension. Since this is very 
specific, you should provably copy `htmltodata.dist.js` to `htmltodata.js`, and
make your changes, for your own HTML content.

### Custom mapping (i.g. category alias to category id)
See folder `adicional_info`. If your HTML is very similar to what was used on
this default HTML parser, you can change the JSON files to map categories to
your own category IDs.

In same logic, you can do around the same for another mappings. Maybe user
who created the HTML.

## How to customize database save method (optimal)

You can change the way this tool save your data, and even make it work with
another database, like PostgreSQL or some No-SQL like MongoDB. Just copy
`datatodb.dist.js` to `datatodb.js` and make your changes.

## How to move scrapped data from temporary table to my real database?
This tool was created for parse HTML files and import to one typical Joomla
CMS content table.

After import data to temporaty table (see database/database.sql), you could use 
the next code to extract data from temporaty table and save on your real site
(in this case, a Joomla CMS Content table)

```sql
REPLACE INTO db_joomla.prefix_content (id, title, alias, catid, introtext, `fulltext`, metakey, metadesc, created_by, created_by_alias, created, `language`, access, state)
SELECT id, title, slug, catid, IF(text_intro IS NULL OR text_intro = '', `text`, text_intro), IF(text_intro IS NULL OR text_intro = '', text_intro, `text`), meta_keywords, meta_description, created_by, author_raw, created_at, '*', '1', '1'
FROM db_htmltodb.articles
```

## How fast is?

On a Ubuntu i7-3630QM CPU @ 2.40GHz, 16GB Mem, HDD, ~20.000 HTML files will be read,
parsed, and saved on a MariaDB database in around 5 minutes.

    2016-02-09T08:41:57.302Z> INFO : totalTime [Parse and Database save]  5.87min. 3805.83 jobs/min

After this, you will need to SELECT data from temporary table and insert on your
target table. With `INSERT INTO ... SELECT` or `REPLACE INTO ... SELECT` on
this example, the same 20.000 HTML will be around 190MB of data on Database, and
will last just a few seconds. (@todo check how much)