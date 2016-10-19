<?php


$testStr = 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/12345678/recent';
//https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/19732385/recent?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0
//https://global.api.pvp.net/api/lol/static-data/na/v1.2/item?itemListData=all&api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0

$config = array( //unit in min
  'expiredDate' => array(
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.3/game/by-summoner/\d{8}/recent#' => '+ 2 weeks', //matchList
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.2/match/\d{4,}#' => 60*24*1, //matchDetail
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/[\d,]{8,}#' => 60*24*1, //summonerName
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/by-name/\w{2,}#' => 60*24*1, //summonerId
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/champion#' => 60*24*1, //championNameAndImage
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/item#' => 60*24*1, //items
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/summoner-spell#' => 60*24*1,//summonerSpell
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/mastery#' => 60*24*1, //masteries
    '#https://global.api.pvp.net/api/lol/static-data/\w{2,4}/v1.2/rune#' => 60*24*1, // runes
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/masteries#' => 60*24/1, //summonerMasteries
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.4/summoner/\d{8}/runes#' => 60*24*1, //summonerRunes
    '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.5/league/by-summoner/\d{8}#' => 60*24*1 //summonerLeague
  )
);

$ans = $config[$testStr];

echo $ans;

$reg = '#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v2.5/league/by-summoner/\d{8}#';
//#https://\w{2,4}.api.pvp.net/api/lol/\w{2,4}/v1.3/game/by-summoner/\d{8}/recent#
//echo preg_match($reg,$testStr);
//var_dump(preg_match($reg,$testStr, $matches));
//print_r($matches);
?>
