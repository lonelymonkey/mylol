<?php

include 'lolAPI.php';
include 'profiler.inc';

class summonerService{
  private $api;
  private $profiler;

  public function __construct() {
    $this->api = new lolAPI(array(
      'region' => 'na'
    ));
    $this->profiler = profiler::getConnection();
  }

  private function getSummonerName($summonerIds){
    $summonerNamesArray = [];
    $maxNumOfId = 40;
    $bufferArrray = array_chunk($summonerIds,$maxNumOfId);

    foreach ($bufferArrray AS $buffer) {
      $summonerIdString = implode(",",$buffer);
      //var_dump($summonerIdString);
      $summonerNames = $this->api->getSummonerName($summonerIdString);
      foreach ($summonerNames AS $summonerName){
      array_push($summonerNamesArray, $summonerName);
    }
    }
    //var_dump($summonerNamesArray);
    return $summonerNamesArray;
  }

  public function getSummonerRunes($summonerId){
    $summonerRunes = $this->api->getSummonerRunes($summonerId);
    return $summonerRunes;
  }

  public function getSummonerMasteries($summonerId){
    $summonerMasteries = $this->api->getSummonerMasteries($summonerId);
    return $summonerMasteries;
  }

  public function getSummonerLeague(){

  }

}
?>
