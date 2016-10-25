<?php
//http://mylol.local/api/summoner.php?function=getRunes&summonerName=epiccookierawr
//http://mylol.local/api/summoner.php?function=getRankedStats&summonerName=epiccookierawr&season=SEASON2015
include '../../global.inc';
include INCLUDE_PATH . '/summonerService.php';

$service = new summonerService();

$response = array(
  'status' => 1 ,
  'data' => ''
);

try {
  $summonerName = $_GET['summonerName'];
  $summonerId = $service->getSummonerIds($summonerName);
  $season = $_GET['season'];
  if($_GET['function'] == 'getRunes'){
    $data = $service->getSummonerRunes($summonerId[$summonerName]['id']);
    $response['data'] = $data;
  }
  else if($_GET['function'] == 'getMasteries'){
    $data = $service->getSummonerMasteries($summonerId[$summonerName]['id']);
    $response['data'] = $data;
  }
  else if($_GET['function'] == 'getLeague'){
    $data = $service->getSummonerLeague($summonerId[$summonerName]['id']);
    $response['data'] = $data;
  }
  else if($_GET['function'] == 'summonerInfo'){
    $response['data'] = $summonerId;
  }
  else if($_GET['function'] == 'getRankedStats'){
    $data = $service->getRankedStats($summonerId[$summonerName]['id'],$season);
    $response['data'] = $data;
    $response['season'] = $season;
  }

} catch (Exception $e) {
    if ($response['status'] >= 1) {
      $response['status'] = -1;
    }
    $response['errMsg'] = $e->getMessage();
}


echo json_encode($response);



?>
