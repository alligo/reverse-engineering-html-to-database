--
-- This tool was created for parse HTML files and import to one typical Joomla
-- CMS content table.
--
-- After import data to temporaty table (see database.sql), you could use the
-- next code to extract data from temporaty table and save on your real site
-- (in this case, a Joomla CMS Content table)
-- <code>
-- REPLACE INTO db_joomla.tbl_content (id, title, alias, catid, introtext, created_by, created_by_alias, `language`, access, state)
-- SELECT id, title, slug, catid, `text`, created_by, author_raw, '*', '1', '1' FROM db_htmltodb.articles
-- </code>
--
-- This was based on a Joomla 3.4.8. But changes thend to be minimal betwen
-- versions.
--
CREATE TABLE `tbl_content` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`asset_id` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'FK to the #__assets table.',
	`title` VARCHAR(255) NOT NULL DEFAULT '',
	`alias` VARCHAR(255) NOT NULL DEFAULT '' COLLATE 'utf8_bin',
	`introtext` MEDIUMTEXT NOT NULL,
	`fulltext` MEDIUMTEXT NOT NULL,
	`state` TINYINT(3) NOT NULL DEFAULT '0',
	`catid` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`created` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
	`created_by` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`created_by_alias` VARCHAR(255) NOT NULL DEFAULT '',
	`modified` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
	`modified_by` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`checked_out` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`checked_out_time` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
	`publish_up` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
	`publish_down` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
	`images` TEXT NOT NULL,
	`urls` TEXT NOT NULL,
	`attribs` VARCHAR(5120) NOT NULL,
	`version` INT(10) UNSIGNED NOT NULL DEFAULT '1',
	`ordering` INT(11) NOT NULL DEFAULT '0',
	`metakey` TEXT NOT NULL,
	`metadesc` TEXT NOT NULL,
	`access` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`hits` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`metadata` TEXT NOT NULL,
	`featured` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Set if article is featured.',
	`language` CHAR(7) NOT NULL COMMENT 'The language code for the article.',
	`xreference` VARCHAR(50) NOT NULL COMMENT 'A reference to enable linkages to external data sets.',
	PRIMARY KEY (`id`),
	INDEX `idx_access` (`access`),
	INDEX `idx_checkout` (`checked_out`),
	INDEX `idx_state` (`state`),
	INDEX `idx_catid` (`catid`),
	INDEX `idx_createdby` (`created_by`),
	INDEX `idx_featured_catid` (`featured`, `catid`),
	INDEX `idx_language` (`language`),
	INDEX `idx_xreference` (`xreference`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;

