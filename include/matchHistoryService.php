<?php
//use matchHistoryService;

include 'lolAPI.php';
include 'profiler.inc';

class matchHistoryService{
  private $api;
  private $profiler;

  public function __construct() {
    $this->api = new lolAPI(array(
      'region' => 'na'
    ));
    $this->profiler = profiler::getConnection();
  }

  //private function summonerId2Name(){
  //};

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

  public function getSummonerIds($summonerNamesString){
    return $this->api->getSummonerIds($summonerNamesString);
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


  public function matchDetail($matchId = 0){
    //initialize other api calls
    $output = array();

    $championNameAndImage = $this->api->getNameAndImage();
    //usleep(250);
    $items = $this->api->getItems();
    //usleep(250);
    $spells = $this->api->getSummonerSpell();
    //usleep(250);
    $this->profiler->mark('api->getRunes','start');
    $runes = $this->api->getRunes();
    //usleep(250);
    $this->profiler->mark('api->getRunes','finish');

    $this->profiler->mark('api->getMasteries','start');
    $masteries = $this->api->getMasteries();
    $this->profiler->mark('api->getMasteries','finish');

    $this->profiler->mark('api->getMatchDetail','start');
    $matchDetail = $this->api->getMatchDetail($matchId);
    $this->profiler->mark('api->getMatchDetail','finish');
    $matchDetail['GameDurationMin'] = gmdate("H:i:s", $matchDetail['matchDuration']);
    foreach($matchDetail['participants'] AS $index => $participant){
      //champion name and image
      $matchDetail['participants'][$index]['championName'] = $championNameAndImage['data'][$participant['championId']]['name'];
      $matchDetail['participants'][$index]["image"] = $championNameAndImage['data'][$participant['championId']]['image']['full'];
      foreach($participant['masteries'] AS $masteryIndex => $mastery){ //masteries
        $matchDetail['participants'][$index]['masteries'][$masteryIndex]['masteryName'] = $masteries['data'][$mastery['masteryId']]['name'];
      }
      foreach($participant['runes'] AS $runeIndex => $rune){ //runes
        $matchDetail['participants'][$index]['runes'][$runeIndex]['runeName'] = $runes['data'][$rune['runeId']]['name'];
        $matchDetail['participants'][$index]['runes'][$runeIndex]['runeImage'] = $runes['data'][$rune['runeId']]['image']['full'];
      }

      for($i = 0; $i<=6; $i++){//items
        if(!empty($matchDetail['participants'][$index]["stats"]['item'.$i])){
          $matchDetail['participants'][$index]["stats"]['itemName'.$i] = $items['data'][$participant['stats']['item'.$i]]['name'];
          $matchDetail['participants'][$index]["stats"]['itemImage'.$i] = $items['data'][$participant['stats']['item'.$i]]['image']['full'];
        }
      }

      for($i = 1; $i<=2; $i++){//spells
        $matchDetail['participants'][$index]['spellName'.$i] = $spells['data'][$participant['spell'.$i.'Id']]['name'];
        $matchDetail['participants'][$index]['spellImg'.$i] = $spells['data'][$participant['spell'.$i.'Id']]['image']['full'];
      }
    }

    foreach($matchDetail['teams'] AS $teamIndex => $team){//banned champion Name
      foreach($team['bans'] AS $banIndex => $ban){
        $matchDetail['teams'][$teamIndex]['bans'][$banIndex]['championName'] = $championNameAndImage['data'][$ban['championId']]['name'];
      }
    }

    $output['matchDetail'] = $matchDetail;
    $output['profiler'] = $this->profiler->data;
    return $output;
  }
}

/*$matchHistoryService = new matchHistoryService();
echo '<pre>';
var_dump($matchHistoryService->matchList(19732385));
echo '</pre>';*/
//var_dump($matchHistoryService->getSummonerIds('epiccookierawr'));


?>
