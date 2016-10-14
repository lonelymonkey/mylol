CREATE TABLE `lolWEBAPICache` (
    `id` int(11) NOT NULL auto_increment,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `command` varchar(256) not null default '',
    `results` text not null default '',
    PRIMARY KEY  (`id`),
    KEY `expiredDate` (`expiredDate`),
    KEY `command` (`command`)
) ENGINE=INNODB CHARACTER SET=utf8;
