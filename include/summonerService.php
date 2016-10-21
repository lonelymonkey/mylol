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
    $output = array();
    //initialize api calls
    $runes = $this->api->getRunes();

    $this->profiler->mark('api->getSummonerRunes','start');
    $summonerRunes = $this->api->getSummonerRunes($summonerId);
    $this->profiler->mark('api->getSummonerRunes','finish');

    foreach($summonerRunes[$summonerId]['pages'] AS $pageIndex => $page){
      foreach($page['slots'] AS $slotsIndex => $slot){
        $summonerRunes[$summonerId]['pages'][$pageIndex]['slots'][$slotsIndex]['runeName'] = $runes['data'][$slot['runeId']]['name'];
        $summonerRunes[$summonerId]['pages'][$pageIndex]['slots'][$slotsIndex]['runeImage'] = $runes['data'][$slot['runeId']]['image']['full'];
      }
    }

    $output['summonerRunes'] = $summonerRunes;
    $output['profiler'] = $this->profiler->data;
    return $output;
  }

  public function getSummonerMasteries($summonerId){
    $output = array();
    //initialize api calls
    $masteries = $this->api->getMasteries();

    $this->profiler->mark('api->getSummonerMasteries','start');
    $summonerMasteries = $this->api->getSummonerMasteries($summonerId);
    $this->profiler->mark('api->getSummonerMasteries','finish');

    foreach($summonerMasteries[$summonerId]['pages'] AS $pageIndex => $page){
      foreach($page['masteries'] AS $masteriesIndex => $mastery){
          $summonerMasteries[$summonerId]['pages'][$pageIndex]['masteries'][$masteriesIndex]['MasteryName'] = $masteries['data'][$mastery['id']]['name'];
      }
    }

    $output['summonerMasteries'] = $summonerMasteries;
    $output['profiler'] = $this->profiler->data;

    return $output;
  }

  public function getSummonerLeague($summonerId){
    $output = array();

    $this->profiler->mark('api->getSummonerLeague','start');
    $summonerLeague = $this->api->getSummonerLeague($summonerId);
    $this->profiler->mark('api->getSummonerLeague','finish');

    $output['summonerLeague'] = $summonerLeague;
    $output['profiler'] = $this->profiler->data;

    return $output;
  }

  public function getRankedStats($summonerId){
    $output = array();
    //initialize api calls
    $championNameAndImage = $this->api->getNameAndImage();

    $this->profiler->mark('api->getRankedStats','start');
    $rankedStats = $this->api->getRankedStats($summonerId);
    $this->profiler->mark('api->getRankedStats','finish');

    foreach($rankedStats['champions'] AS $championIndex => $champion){
      $rankedStats['champions'][$championIndex]['name'] = $championNameAndImage['data'][$champion['id']]['name'];
    }

    $output['rankedStats'] = $rankedStats;
    $output['profiler'] = $this->profiler->data;

    return $output;
  }

}
?>
