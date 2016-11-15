<?php

include 'lolAPI.php';
include 'profiler.inc';

class summonerService{
  private $api;
  private $profiler;

  public function __construct() {
    $this->api = new lolAPI(array(
      'region' => 'na',
      'location' => 'NA1'
    ));
    $this->profiler = profiler::getConnection();
  }

  public function getSummonerIds($summonerNamesString){
    return $this->api->getSummonerIds($summonerNamesString);
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
        $summonerRunes[$summonerId]['pages'][$pageIndex]['slots'][$slotsIndex]['description'] = $runes['data'][$slot['runeId']]['description'];
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
      if(!empty($page['masteries'])){
        foreach($page['masteries'] AS $masteriesIndex => $mastery){
          $summonerMasteries[$summonerId]['pages'][$pageIndex]['masteries'][$masteriesIndex]['masteryName'] = $masteries['data'][$mastery['id']]['name'];
          $summonerMasteries[$summonerId]['pages'][$pageIndex]['masteries'][$masteriesIndex]['description'] = $masteries['data'][$mastery['id']]['description'];
        }
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

  public function getRankedStats($summonerId,$season){
    $output = array();
    //initialize api calls
    $championNameAndImage = $this->api->getNameAndImage();

    $this->profiler->mark('api->getRankedStats','start');
    $rankedStats = $this->api->getRankedStats($summonerId,$season);
    $this->profiler->mark('api->getRankedStats','finish');

    foreach($rankedStats['champions'] AS $championIndex => $champion){
      $rankedStats['champions'][$championIndex]['name'] = $championNameAndImage['data'][$champion['id']]['name'];
      $rankedStats['champions'][$championIndex]['image'] = $championNameAndImage['data'][$champion['id']]['image']['full'];
    }

    $output['rankedStats'] = $rankedStats;
    $output['profiler'] = $this->profiler->data;

    return $output;
  }

  public function matchList($summonerId = 0){
    $output = array();
    //$summonerId = $this->api->getSummonerId($summonerName);

    $this->profiler->mark('api->getMatchList','start');
    $matchList = $this->api->getMatchList($summonerId);
    $this->profiler->mark('api->getMatchList','finish');

    $summonerNameTranslation = [];
    foreach ($matchList['games'] AS $game) {
      $players = $game['fellowPlayers'];
      foreach ($players AS $player) {
        $summonerNameTranslation[$player['summonerId']] = '';
      }
    }
    //array_keys($summonerNameTranslation);
    //finish $summonerNameTranslation  variable
    $this->profiler->mark('$this->getSummonerName','start');
    $summoners = $this->getSummonerName(array_keys($summonerNameTranslation));
    $this->profiler->mark('$this->getSummonerName','finish');


    $this->profiler->mark('api->getNameAndImage','start');
    $championNameAndImage = $this->api->getNameAndImage();
    $this->profiler->mark('api->getNameAndImage','finish');

    $this->profiler->mark('api->getItems','start');
    $items = $this->api->getItems();
    $this->profiler->mark('api->getItems','finish');

    $this->profiler->mark('api->getSummonerSpell','start');
    $spells = $this->api->getSummonerSpell();
    $this->profiler->mark('api->getSummonerSpell','finish');
    //var_dump($spells);

    foreach ($summoners AS $summoner) {
      $summonerNameTranslation[$summoner['id']] = $summoner['name'];
    }
    //var_dump($summonerNameTranslation);

    //var_dump($items);
    foreach ($matchList['games'] AS $gameIndex => $game) {
      $players = $game['fellowPlayers'];
      $stats = $game['stats'];
      $matchList['games'][$gameIndex]["championName"] = $championNameAndImage['data'][$game['championId']]['name'];
      $matchList['games'][$gameIndex]["title"] = $championNameAndImage['data'][$game['championId']]['title'];
      $matchList['games'][$gameIndex]["image"] = $championNameAndImage['data'][$game['championId']]['image']['full'];

      foreach ($players AS $playerIndex => $player) {
        $summonerId = $player["summonerId"];
        $summonerName = $summonerNameTranslation[$summonerId];
        $matchList['games'][$gameIndex]['fellowPlayers'][$playerIndex]['summonerName'] = $summonerName;
        $matchList['games'][$gameIndex]['fellowPlayers'][$playerIndex]['image'] = $championNameAndImage['data'][$player['championId']]['image']['full'];
        if($player["teamId"] == 100){
          $matchList['games'][$gameIndex]['fellowPlayers'][$playerIndex]['teamColor'] = 'blue';
        }
        else{
          $matchList['games'][$gameIndex]['fellowPlayers'][$playerIndex]['teamColor'] = 'purple';
        }
      }
      // only two spells
      for($i = 1; $i<=2; $i++){
        $matchList['games'][$gameIndex]['spellName'.$i] = $spells['data'][$game['spell'.$i]]['name'];
      }
      //only 7 items
      for($i = 0; $i<=6; $i++){
        if(!empty($matchList['games'][$gameIndex]["stats"]['item'.$i])){
          $matchList['games'][$gameIndex]["stats"]['itemName'.$i] = $items['data'][$game['stats']['item'.$i]]['name'];
          $matchList['games'][$gameIndex]["stats"]['itemImage'.$i] = $items['data'][$game['stats']['item'.$i]]['image']['full'];
        }
      }
          //var_dump($matchList['games'][$gameIndex]["stats"]);
      }

    //var_dump($matchList);
    $output['matchList'] = $matchList;
    $output['profiler'] = $this->profiler->data;
    return $output;
  }

  public function getChampionMastery($summonerId){
    $output = array();

    $championNameAndImage = $this->api->getNameAndImage();

    $this->profiler->mark('api->getChampionMastery','start');
    $championMastery = $this->api->getChampionMastery($summonerId);
    $this->profiler->mark('api->getChampionMastery','end');

    foreach($championMastery AS $championIndex => $champion){
      $championMastery[$championIndex]['name'] = $championNameAndImage['data'][$champion['championId']]['name'];
      $championMastery[$championIndex]['image'] = $championNameAndImage['data'][$champion['championId']]['image']['full'];
      $championMastery[$championIndex]['skins'] = $championNameAndImage['data'][$champion['championId']]['skins'];
    }

    $output['championMastery'] = $championMastery;
    $output['profiler'] = $this->profiler->data;

    return $output;

  }


  public function getSummary($summonerNamesString,$summonerId,$season){
    $ouput = array();

    $output['summonerInfo'] = $this->getSummonerIds($summonerNamesString);
    $output['league'] = $this->getSummonerLeague($summonerId);
    $output['rankedStats'] = $this->getRankedStats($summonerId,$season);
    $output['matchList'] = $this->matchList($summonerId);
    $output['championMastery'] = $this->getChampionMastery($summonerId);
    $output['items'] = $this->api->getItems();
    $output['summonerSpell'] = $this->api->getSummonerSpell();

    return $output;
  }

}
?>
