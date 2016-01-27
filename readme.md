# Reverse Engineering: From HTML to Database v0.1alpha

_Did you lost your site with no Backup? Try [Google Cache Site Recover](https://github.com/alligo/google-cache-site-recover)_

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

## How to customize database save method (optimal)

You can change the way this tool save your data, and even make it work with
another database, like PostgreSQL or some No-SQL like MongoDB. Just copy
`datatodb.dist.js` to `datatodb.js` and make your changes