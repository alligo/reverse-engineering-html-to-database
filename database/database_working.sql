CREATE TABLE `articles` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL DEFAULT '0' COLLATE 'utf8_unicode_ci',
	`text` TEXT NOT NULL COLLATE 'utf8_unicode_ci',
	`slug` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`url_raw` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`category_raw` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`catid` INT(10) UNSIGNED NULL DEFAULT NULL,
	`tags_raw` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`author_raw` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_unicode_ci',
	`created_by` INT(10) UNSIGNED NULL DEFAULT NULL,
	`created_at` DATETIME NULL DEFAULT NULL,
	`modified_by` INT(10) UNSIGNED NULL DEFAULT NULL,
	`modified_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8_unicode_ci'
ENGINE=InnoDB
;