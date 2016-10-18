<?php
//https://billchou.local/billchou/leagueOfLegend/api/history.php?function=matchList&summonerName=epiccookierawr
//https://billchou.local/billchou/leagueOfLegend/api/history.php?function=matchDetail&matchId=2305801661

include '../../global.inc';
include INCLUDE_PATH . '/matchHistoryService.php';
$service = new matchHistoryService();

$response = array(
  'status' => 1 ,
  'data' => ''
);

//summonerId = {
//'summonerName' => ['id','name','profileIconId','summonerlevel','revisionDate']
//}

try {
  if ($_GET['function'] == 'matchList') {

    $summonerName = $_GET['summonerName'];
    $summonerId = $service->getSummonerIds($summonerName);
    $response['data'] = $service->matchList($summonerId[$summonerName]["id"]);
  }
  else if($_GET['function'] == 'matchDetail') {
    $matchId = $_GET['matchId'];
    $response['data'] = $service->matchDetail($matchId);
  }

} catch (Exception $e) {
    if ($response['status'] >= 1) {
      $response['status'] = -1;
    }
    $response['errMsg'] = $e->getMessage();
}


echo json_encode($response);



?>
