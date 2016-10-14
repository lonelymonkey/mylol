<?php


$testStr = 'https://na.api.pvp.net//api/lol/na/v1.3/game/by-summoner/38700952/recent?api_key=RGAPI-178a4b1c-107a-4509-85f1-9723084273f0';


$reg = '#\/api\/lol\/na\/v1.3\/game\/by-summoner\/[0-9]+/recent#';


var_dump(preg_match($reg,$testStr));
?>
