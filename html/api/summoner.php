<?php
//http://mylol.local/api/summoner.php?function=getLeague&summonerName=epiccookierawr
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
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
  }

} catch (Exception $e) {
    if ($response['status'] >= 1) {
      $response['status'] = -1;
    }
    $response['errMsg'] = $e->getMessage();
}


//echo json_encode($response);



?>
