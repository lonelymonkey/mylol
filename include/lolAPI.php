<?php

//include 'global.inc';

//$riotAPI = new riotAPI();

//$championListData = $riotAPI->championListData();

class lolWebAPIResource {
  private $path = 'https://na.api.pvp.net/';
  private $globalPath = 'https://global.api.pvp.net/';
  private $key = 'api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0';
  public function __construct($dataPath = ''){
    if(!empty($dataPath)){
      $this->path = $dataPath;
    }
  }
  //matchList: returns the stats for the last 10 games played
  public function matchList($region,$summonerId){
    return json_decode(file_get_contents($this->path.'/api/lol/'.$region.'/v1.3/game/by-summoner/'.$summonerId.'/recent'.'?'.$this->key),true);
  }
  //matchDetail: returns the detail information of one game by its gameId
  public function matchDetail($region,$matchId){
    return file_get_contents($this->path.'/api/lol/'.$region.'/v2.2/match/'.$matchId.'?'.$this->key,true);
  }
  //summonerName: return a list of summoner names by their respective ids
  public function summonerName($region,$idArraystring){
    return json_decode(file_get_contents($this->path.'/api/lol/'.$region.'/v1.4/summoner/'.$idArraystring.'?'.$this->key),true);
  }
  //summonerId: convert summonerName to summonerId
  public function summonerId($region,$nameArrayString){
    return json_decode(file_get_contents($this->path.'/api/lol/'.$region.'/v1.4/summoner/by-name/'.$nameArrayString.'?'.$this->key),true);
  }
  //championNameAndImage: retrieve champion's name and image by its id
  public function championNameAndImage($region){
    return json_decode(file_get_contents($this->path.'api/lol/static-data/'.$region.'/v1.2/champion?champData=image&dataById=true&'.$this->key),true);
  }
  //item: retrieve item's name and image by its id
  public function items($region){
    return json_decode(file_get_contents($this->path.'api/lol/static-data/'.$region.'/v1.2/item?itemListData=gold,image&'.$this->key),true);
  }
  //summonerSpell: retrieve spell name and info by its id
  public function summonerSpell($region){
    return json_decode(file_get_contents($this->globalPath.'api/lol/static-data/'.$region.'/v1.2/summoner-spell?dataById=true&spellData=all&'.$this->key),true);
  }
}

class localFileResource {
  private $path = '../localResource';
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
    return file_get_contents($this->path.'/matchDetail.json');
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
}

//$matchDetail = $lolAPI->getMatchDetail();
//var_dump($matchDetail);
//'summonerId' => '19732385'
//'matchId' => '2313821210'
//https://na.api.pvp.net//api/lol/NA/v2.2/match/2313821210?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
//https://na.api.pvp.net/api/lol/na/v2.2/match/2313821210?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
?>
