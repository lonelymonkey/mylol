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

  public function getSummonerIds($summonerNamesString){
    return $this->api->getSummonerIds($summonerNamesString);
  }

  public function getSummonerRunes($summonerId){
    //initialize api calls
    $runes = $this->api->getRunes();
    $summonerRunes = $this->api->getSummonerRunes($summonerId);

    foreach($summonerRunes[$summonerId]['pages'] AS $pageIndex => $page){
      foreach($page['slots'] AS $slotsIndex => $slot){
        $summonerRunes[$summonerId]['pages'][$pageIndex]['slots'][$slotsIndex]['runeName'] = $runes['data'][$slot['runeId']]['name'];
        $summonerRunes[$summonerId]['pages'][$pageIndex]['slots'][$slotsIndex]['runeImage'] = $runes['data'][$slot['runeId']]['image']['full'];
      }
    }

    return $summonerRunes;
  }

  public function getSummonerMasteries($summonerId){
    //initialize api calls
    $masteries = $this->api->getMasteries();
    $summonerMasteries = $this->api->getSummonerMasteries($summonerId);

    foreach($summonerMasteries[$summonerId]['pages'] AS $pageIndex => $page){
      foreach($page['masteries'] AS $masteriesIndex => $mastery){
          $summonerMasteries[$summonerId]['pages'][$pageIndex]['masteries'][$masteriesIndex]['MasteryName'] = $masteries['data'][$mastery['id']]['name'];
      }
    }

    return $summonerMasteries;
  }

  public function getSummonerLeague($summonerId){
    $summonerLeague = $this->api->getSummonerLeague($summonerId);
    return $summonerLeague;
  }

}
?>
