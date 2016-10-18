<?php
//http://mylol.local/api/summoner.php?function=getRunes&summonerName=19732385
include '../../global.inc';
include INCLUDE_PATH . '/summonerService.php';

$service = new summonerService();

$response = array(
  'status' => 1 ,
  'data' => ''
);

try {
  $summonerName = $_GET['summonerName'];
  if($_GET['function'] == 'getRunes'){
    $data = $service->getSummonerRunes($summonerName);
    $response['data'] = $data;
  }
  else if($_GET['function'] == 'getMasteries'){
    $data = $service->getSummonerMasteries($summonerName);
    $response['data'] = $data;
  }

} catch (Exception $e) {
    if ($response['status'] >= 1) {
      $response['status'] = -1;
    }
    $response['errMsg'] = $e->getMessage();
}


echo json_encode($response);



?>
