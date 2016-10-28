<?php
include '../../global.inc';
include INCLUDE_PATH . '/lolcache.inc';
$testStr = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/gdsfgjdfl;kgjdf;slgkdjf?itemListData=all&api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0';
//https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/19732385/recent?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
//https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0

$config = array( //unit in min
  'expiredDate' => array(
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.3/game/by-summoner/\d{8}/recent#' => 7200, //matchList  1 day
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.2/match/\d{4,}#' => 7200, //matchDetail
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/[\d,]{8,}#' => 7200, //summonerName
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/by-name/\w{2,}#' => 7200, //summonerId
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/champion#' => 86400, //championNameAndImage
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/item#' => 2592000, //items
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/summoner-spell#' => 2592000,//summonerSpell
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/mastery#' => 2592000, //masteries
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/rune#' => 2592000, // runes
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/masteries#' => 86400, //summonerMasteries
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/runes#' => 86400, //summonerRunes
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.5/league/by-summoner/\d{8}#' => 86400 //summonerLeague
    //'#*#'
  )
);
//sdfsfds

$lolcache = new lolWebAPICache();

$res = $lolcache->getCommand('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/epiccookierawr?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0');
var_dump($res);
/*echo preg_match('#.*#',$testStr,$match);
var_dump($match);
$expirationPeriod = time();
echo $expirationPeriod;
echo '</br>';*/

$expire = date('Y-m-d H:i:s', $expirationPeriod);
echo $expire;

$reg = '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.5/league/by-summoner/\d{8}#';
//#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.3/game/by-summoner/\d{8}/recent#
//echo preg_match($reg,$testStr);
//var_dump(preg_match($reg,$testStr, $matches));
//print_r($matches);
?>
