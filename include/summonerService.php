<?php
//use matchHistoryService;

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
}

/*$matchHistoryService = new matchHistoryService();
echo '<pre>';
var_dump($matchHistoryService->matchList(19732385));
echo '</pre>';*/
//var_dump($matchHistoryService->getSummonerIds('epiccookierawr'));


?>
