<?php

include 'environment.inc';
include INCLUDE_PATH . '/database.class.inc';
include INCLUDE_PATH . '/database.php';
//include 'leagueConstant.inc';
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
//error_reporting(0);

class riotAPI {
  public function championListData() {
    $result = file_get_contents('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?dataById=true&champData=image,tags&api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0');
    return $result;
  }



}
?>
