<?php
include 'database.class.inc';
if (!class_exists('API2LocalDBInterface')) {
  class API2LocalDBInterface {
    private $config = array();
    public function __construct($cfg) {
      foreach ($cfg AS $index => $val) {
        $this->config[$index] = $val;
      }
      $this->db = Database::getConnection();
    }
    /*
    +-------------+-------------------------+------+-----+---------+-------+
    | Field       | Type                    | Null | Key | Default | Extra |
    +-------------+-------------------------+------+-----+---------+-------+
    | gameId      | int(11)                 | NO   | PRI | NULL    |       |
    | invalid     | tinyint(1)              | YES  |     | NULL    |       |
    | gameMode    | enum('CLASSIC')         | YES  |     | NULL    |       |
    | gameType    | enum('MATCHED_GAME')    | YES  |     | NULL    |       |
    | subType     | enum('RANKED_SOLO_5x5') | YES  |     | NULL    |       |
    | createdDate | datetime                | YES  |     | NULL    |       |
    | endDate     | datetime                | YES  |     | NULL    |       |
    | gameVersion | varchar(256)            | YES  |     | NULL    |       |
    | platformId  | int(11)                 | YES  |     | NULL    |       |
    +-------------+-------------------------+------+-----+---------+-------+
    */
    public function savematchList($res) {
      $tablePrefix = $this->config['region'] . '_';
      foreach ($res['games'] AS $game) {
        $query = 'insert into '.$tablePrefix.'games (gameId, invalid, gameMode, gameType, createdDate, endDate)
                        value(:gameId, :invalid, :gameMode, :gameType, :createdDate, :endDate)
                        ON DUPLICATE KEY UPDATE gameId=VALUES(gameId), invalid=VALUES(invalid), gameMode=VALUES(gameMode),
                         gameType=VALUES(gameType),  createdDate=VALUES(createdDate),  endDate=VALUES(endDate)';
        $this->db->query($query)
                  ->bindAll(array(
                      ':gameId' => $game['gameId'],
                      ':invalid' => $game['invalid'],
                      ':gameMode' => $game['gameMode'],
                      ':gameType' => $game['gameType'],
                      ':createdDate' => date('Y-m-d H:i:s'),
                      ':endDate' => date('Y-m-d H:i:s'),
                    ))
                  ->execute();
      }
      //disect $res
    }


  }
}


?>
