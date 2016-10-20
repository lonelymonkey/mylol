<?php

//include 'global.inc';

//$riotAPI = new riotAPI();

//$championListData = $riotAPI->championListData();
include 'lolcache.inc';
include 'API2LocalDBInterface.inc';

class lolWebAPIResource {
  //private $path = 'https://na.api.pvp.net/';
  private function path($region){
    return 'https://'.$region.'.api.pvp.net/';
  }
  private $globalPath = 'https://global.api.pvp.net/';
  //private $key = 'api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0';
  private $apiKey = 'RGAPI-178a4b1c-107a-4509-85f1-9723084273f0';

  public $config = array( //unit in min
    'expiredDate' => array(
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.3/game/by-summoner/\d{8}/recent#' => 86400, //matchList  1 day
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.2/match/\d{4,}#' => 86400, //matchDetail
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/[\d,]{8,}#' => 86400, //summonerName
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/by-name/\w{2,}#' => 86400, //summonerId
      '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/champion#' => 86400, //championNameAndImage
      '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/item#' => 86400, //items
      '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/summoner-spell#' => 86400,//summonerSpell
      '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/mastery#' => 86400, //masteries
      '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/rune#' => 86400, // runes
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/masteries#' => 86400, //summonerMasteries
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/runes#' => 86400, //summonerRunes
      '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.5/league/by-summoner/\d{8}#' => 86400 //summonerLeague
      //'#*#'
    )
  );

  public function __construct($dataPath = ''){
    if(!empty($dataPath)){
      //$this->path = $dataPath;
    }
    $this->cache = new lolWebAPICache();
  }
  private function getExpiredTime($command) {
    foreach($this->config['expiredDate'] AS $expiredDateIndex => $expiredDate){
      if(preg_match($expiredDateIndex,$command)){
        $expirationPeriod = date('Y-m-d H:i:s',strtotime($expiredDate));
        break;
      }
    }
    return $expirationPeriod;
  }


  //matchList: returns the stats for the last 10 games played
  public function matchList($region,$summonerId){
    //$interface = new API2LocalDBInterface(array('region'=>$region));

    $command = $this->path($region).'api/lol/'.$region.'/v1.3/game/by-summoner/'.$summonerId.'/recent'.'?' . http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if (empty($res)) {
      $res = json_decode(file_get_contents($command),true);
      $expTime = $this->getExpiredTime($command);

      $this->cache->save($command, $res, date('Y-m-d H:i:s', time()+$expTime));
    }
    //$interface->savematchList($res);
    return $res;
  }
  //matchDetail: returns the detail information of one game by its gameId
  public function matchDetail($region,$matchId){
    $command = $this->path($region).'api/lol/'.$region.'/v2.2/match/'.$matchId.'?'. http_build_query(array('api_key' => $this->apiKey));

    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expTime = $this->getExpiredTime($command);
      $this->cache->save($command, $res, date('Y-m-d H:i:s', time()+$expTime));
    }
    return $res;
  }
  //summonerName: return a list of summoner names by their respective ids
  public function summonerName($region,$idArraystring){
    $command = $this->path($region).'api/lol/'.$region.'/v1.4/summoner/'.$idArraystring.'?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //summonerId: convert summonerName to summonerId
  public function summonerId($region,$nameArrayString){
    $command = $this->path($region).'api/lol/'.$region.'/v1.4/summoner/by-name/'.$nameArrayString.'?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //championNameAndImage: retrieve champion's name and image by its id
  public function championNameAndImage($region){
    $command = $this->path($region).'api/lol/static-data/'.$region.'/v1.2/champion?'. http_build_query(array('champData' => 'image','dataById' => 'true','api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //item: retrieve item's name and image by its id
  public function items($region){
    $command = $this->path($region).'api/lol/static-data/'.$region.'/v1.2/item?'.http_build_query(array('itemListData' => 'gold,image', 'api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //summonerSpell: retrieve spell name and info by its id
  public function summonerSpell($region){
    $command = $this->globalPath.'api/lol/static-data/'.$region.'/v1.2/summoner-spell?'.http_build_query(array('dataById' => 'true','spellData' => 'all', 'api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //masteries: retrieve mastery info by its id
  public function masteries($region){
    $command = $this->globalPath.'api/lol/static-data/'.$region.'/v1.2/mastery?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
  //runes: retrieve rune info by its id
  public function runes($region){
    $command = $this->globalPath.'api/lol/static-data/'.$region.'/v1.2/rune?'. http_build_query(array('runeListData' => 'all', 'api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }

  public function summonerMasteries($region,$summonerId){
    $command = $this->path($region).'api/lol/'.$region.'/v1.4/summoner/'.$summonerId.'/masteries?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }

  public function summonerRunes($region,$summonerId){
    $command = $this->path($region).'api/lol/'.$region.'/v1.4/summoner/'.$summonerId.'/runes?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }

  public function summonerLeague($region,$summonerId){
    $command = $this->path($region).'api/lol/'.$region.'/v2.5/league/by-summoner/'.$summonerId.'?'.http_build_query(array('api_key' => $this->apiKey));
    $res = $this->cache->getCommand($command);
    if(empty($res)){
      $res = json_decode(file_get_contents($command),true);
      $expDate = date('Y-m-d H:i:s',strtotime('+7 day'));
      $this->cache->save($command, $res, $expDate);
    }
    return $res;
  }
}

class localFileResource {
  private $path = '../../localResource';
  public function __construct($dataPath = '') {
    if(!empty($dataPath)){
      $this->path = $dataPath;
    }
  }
  //parameters
  public function matchList() {
    return file_get_contents($this->path.'/matchList.json');
  }

  public function matchDetail() {
    return json_decode(file_get_contents($this->path.'/matchDetail.json'),true);
  }
}


//echo $championListData;
class lolAPI {
  public $resource;
  private $config = array( //default values
    'region' => 'na',
  );
  public function __construct($config = array()) {
    $this->resource = new stdclass();

    if (!empty($config)){
      foreach($config AS $key => $val) {
        $this->config[$key] = $val;
      }
    }
    $this->resource->webAPI = new lolWebAPIResource();  // new lolWebAPIResource()
    $this->resource->localCache = '';  //new localCacheResource()
    $this->resource->localFile = new localFileResource();  //new localFileResource()
  }

  public function getMatchList($summonerId = 0) {
    return $this->resource->webAPI->matchList($this->config['region'],$summonerId);
    //return $this->resource->localFile->Match_v2_2();
  }

  public function getMatchDetail($matchId = 0){
    return $this->resource->webAPI->matchDetail($this->config['region'],$matchId);
    //return $this->resource->localFile->matchDetail();
  }

  public function getSummonerName($idArraystring = ''){
    return $this->resource->webAPI->summonerName($this->config['region'],$idArraystring);
  }

  public function getSummonerIds($nameArraystring = ''){
    return $this->resource->webAPI->summonerId($this->config['region'],$nameArraystring);
  }

  public function getNameAndImage(){
    return $this->resource->webAPI->championNameAndImage($this->config['region']);
  }

  public function getItems(){
    return $this->resource->webAPI->items($this->config['region']);
  }

  public function getSummonerSpell(){
    return $this->resource->webAPI->summonerSpell($this->config['region']);
  }

  public function getMasteries(){
    return $this->resource->webAPI->masteries($this->config['region']);
  }

  public function getRunes(){
    return $this->resource->webAPI->runes($this->config['region']);
  }

  public function getSummonerMasteries($summonerId = 0){
    return $this->resource->webAPI->summonerMasteries($this->config['region'],$summonerId);
  }

  public function getSummonerRunes($summonerId = 0){
    return $this->resource->webAPI->summonerRunes($this->config['region'],$summonerId);
  }

  public function getSummonerLeague($summonerId = 0){
    return $this->resource->webAPI->summonerLeague($this->config['region'],$summonerId);
  }
}

//$matchDetail = $lolAPI->getMatchDetail();
//var_dump($matchDetail);
//'summonerId' => '19732385'
//'matchId' => '2313821210'
//https://na.api.pvp.net//api/lol/NA/v2.2/match/2313821210?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
//https://na.api.pvp.net/api/lol/na/v2.2/match/2313821210?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
?>
