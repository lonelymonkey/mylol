CREATE TABLE `lolWEBAPICache` (
    `id` int(11) not null auto_increment,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `command` varchar(256) not null default '',
    `results` text not null default '',
    PRIMARY KEY  (`id`),
    KEY `expiredDate` (`expiredDate`),
    KEY `command` (`command`)
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `champion` (
    `championId` int(11) not null,
    `championName` varchar(32) not null default '',
    `championImage` varchar(32),
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `freeToPlay`  tinyint(1),
    `botMnEnabled` tinyint(1),
    `rankedPlayEnabled` tinyint(1),
    PRIMARY KEY  (`championId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `championName` (`championName`),
    KEY `freeToPlay` (`freeToPlay`)
) ENGINE=INNODB CHARACTER SET=utf8;

/*championMastery tables*/

CREATE TABLE `championMastery` (
    `playerId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `totalMasteryScore` int(11) not null,
    PRIMARY KEY  (`playerId`),
    KEY `expiredDate` (`expiredDate`)
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `championMasteryInfo` (
    `championMasteryInfoId` int(11) not null auto_increment,
    `playerId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `championId` int(4) not null,
    `championPoints` int(11) not null,
    `chestGranted` tinyint(1) not null default 0,
    `tokensEarned` int(2),
    PRIMARY KEY  (`championMasteryInfoId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `championPoints` (`championPoints`),
    FOREIGN KEY (`playerId`)
      REFERENCES championMastery(playerId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

/*championMastery tables*/

/*league tables*/

CREATE TABLE `summonerLeague` (
    `summonerLeagueId` int(11) not null auto_increment,
    `participantId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `queue` enum('RANKED_SOLO_5x5', 'RANKED_TEAM_3x3', 'RANKED_TEAM_5x5'),
    `tier` enum('CHALLENGER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'),
    PRIMARY KEY  (`summonerLeagueId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `participantId` (`participantId`)
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `summonerLeagueMemberList` (
    `summonerLeagueMemberListId` int(11) not null auto_increment,
    `summonerLeagueId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `division` varchar(10) not null,
    `leaguePoints` int(11) not null,
    `losses` int(5),
    `wins` int(5),
    PRIMARY KEY  (`summonerLeagueMemberListId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`summonerLeagueId`)
      REFERENCES summonerLeague(summonerLeagueId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `miniSeries` (
    `miniSeriesId` int(11) not null auto_increment,
    `summonerLeagueMemberListId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `wins` int(3),
    `losses` int(3),
    `target` int(3),
    `progress` varchar(5),
    PRIMARY KEY  (`miniSeriesId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`miniSeriesId`)
      REFERENCES summonerLeagueMemberList(summonerLeagueMemberListId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

/*league tables*/

/*match tables*/

CREATE TABLE `matchDetail` (
    `matchId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `mapId` int(4) not null,
    `matchCreation` int(8) not null,
    `matchDuration` int(8) not null,
    `matchMode` enum('CLASSIC', 'ODIN', 'ARAM', 'TUTORIAL', 'ONEFORALL', 'ASCENSION', 'FIRSTBLOOD', 'KINGPORO'),
    `matchType` enum('CUSTOM_GAME', 'MATCHED_GAME', 'TUTORIAL_GAME'),
    `queueType` varchar(20),
    `region` varchar(5),
    `season` enum('PRESEASON3', 'SEASON3', 'PRESEASON2014', 'SEASON2014', 'PRESEASON2015', 'SEASON2015', 'PRESEASON2016', 'SEASON2016'),
    PRIMARY KEY  (`matchId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `queueType` (`queueType`)
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `matchParticipant` (
    `matchParticipantId` int(11) not null auto_increment,
    `matchId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `participantId` int(11) not null,
    `championId` int(4) not null,
    `teamId` int(3) not null,
    `spell1Id` int(5),
    `spell2Id` int(5),
    PRIMARY KEY  (`matchParticipantId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchId`)
      REFERENCES matchDetail(matchId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `participantMastery` (
    `participantMasteryId` int(11) not null auto_increment,
    `matchParticipantId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `masteryId` int(11) not null,
    `rank` int(11) not null,
    PRIMARY KEY  (`participantMasteryId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchParticipantId`)
      REFERENCES matchParticipant(matchParticipantId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `participantRune` (
    `participantRuneId` int(11) not null auto_increment,
    `matchParticipantId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `runeId` int(11) not null,
    `rank` int(11) not null,
    PRIMARY KEY  (`participantRuneId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchParticipantId`)
      REFERENCES matchParticipant(matchParticipantId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `participantStats` (
    `participantStatId` int(11) not null auto_increment,
    `matchParticipantId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `champLevel` int(5) not null,
    `kills` int(5) not null,
    `assists` int(5) not null,
    `deaths` int(5) not null,
    `item0` int(5) not null default 0,
    `item1` int(5) not null default 0,
    `item2` int(5) not null default 0,
    `item3` int(5) not null default 0,
    `item4` int(5) not null default 0,
    `item5` int(5) not null default 0,
    `item6` int(5) not null default 0,
    `firstBloodKill` tinyint(1),
    `winner` tinyint(1) not null,
    PRIMARY KEY  (`participantStatId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchParticipantId`)
      REFERENCES matchParticipant(matchParticipantId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `matchParticipantIdentity` (
    `matchParticipantIdentityId` int(11) not null auto_increment,
    `matchId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `participantId` int(11) not null,
    `summonerId` int(11) not null,
    `summonerName` varchar(20) not null,
    `matchHistoryUri` varchar(256),
    `profileIcon` int(30),
    PRIMARY KEY  (`matchParticipantIdentityId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchId`)
      REFERENCES matchDetail(matchId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `matchTeam` (
    `matchTeamId` int(11) not null auto_increment,
    `matchId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `firstBaron` tinyint(1),
    `firstBlood` tinyint(1),
    `firstDragon` tinyint(1),
    `firstInhibitor` tinyint(1),
    `firstTower` tinyint(1),
    `teamId` int(4),
    `towerKills` int(3),
    `winner` tinyint(1),
    PRIMARY KEY  (`matchTeamId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchId`)
      REFERENCES matchDetail(matchId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `bannedChampion` (
    `bannedChampionId` int(11) not null auto_increment,
    `matchTeamId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `championId` int(4),
    `pickTurn` int(2),
    PRIMARY KEY  (`bannedChampionId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`matchTeamId`)
      REFERENCES matchTeam(matchTeamId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

/*match tables*/

/*summoner tables*/
CREATE TABLE `summonerInfo` (
    `summonerId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `name` int(4) not null,
    `profileIconId` int(7),
    `revisionDate` int(20),
    `summonerLevel` int(10),
    PRIMARY KEY  (`summonerId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `name` (`name`)
) ENGINE=INNODB CHARACTER SET=utf8;
/*summoner tables*/

/*matchList table*/

CREATE TABLE `matchList` (
    `gameId` int(11) not null,
    `summonerId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `championId` int(4) not null,
    `gameMode` enum('CLASSIC', 'ODIN', 'ARAM', 'TUTORIAL', 'ONEFORALL', 'ASCENSION', 'FIRSTBLOOD', 'KINGPORO'),
    `gameType` enum('CUSTOM_GAME', 'MATCHED_GAME', 'TUTORIAL_GAME'),
    `mapId` int(5),
    `spell1Id` int(5),
    `spell2Id` int(5),
    `subType` varchar(20),
    `teamId` int(3),
    PRIMARY KEY  (`gameId`),
    KEY `expiredDate` (`expiredDate`),
    KEY `subType` (`subType`),
    FOREIGN KEY (`summonerId`)
      REFERENCES summonerInfo(summonerId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `fellowPlayers` (
    `fellowPlayersId` int(11) not null,
    `gameId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `championId` int(4),
    `summonerId` int(10),
    `teamId` int(3),
    PRIMARY KEY  (`fellowPlayersId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`gameId`)
      REFERENCES matchList(gameId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

CREATE TABLE `rawStats` (
    `RawStatsId` int(11) not null,
    `gameId` int(11) not null,
    `createdDate` datetime not null default '0000-00-00',
    `expiredDate` datetime not null default '0000-00-00',
    `Level` int(5) not null,
    `championsKilled` int(5) not null,
    `assists` int(5) not null,
    `deaths` int(5) not null,
    `item0` int(5) not null default 0,
    `item1` int(5) not null default 0,
    `item2` int(5) not null default 0,
    `item3` int(5) not null default 0,
    `item4` int(5) not null default 0,
    `item5` int(5) not null default 0,
    `item6` int(5) not null default 0,
    `firstBlood` int(5) not null default 0,
    `winner` tinyint(1) not null,
    PRIMARY KEY  (`RawStatsId`),
    KEY `expiredDate` (`expiredDate`),
    FOREIGN KEY (`gameId`)
      REFERENCES matchList(gameId)
      ON DELETE CASCADE
) ENGINE=INNODB CHARACTER SET=utf8;

/*matchList table*/
