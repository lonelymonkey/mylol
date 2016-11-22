lolSummonerData = function(cfg){
  var config = $.extend({
    apiURL :  'api/summoner.php'
  },cfg);

  summonerSummary = function(summonerName,season,callback){
    //console.log('summonerSummary');
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'getSummary','summonerName' : summonerName,'season' : season},
      'success': function(res){
        console.log(res);
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
  }

  summonerInfo = function(summonerName,callback){
    //console.log('summonerInfo');
    /*$.get(
      config.apiURL,
      {'function': 'matchList', 'summonerName' : 'epiccookierawr'},
      function(data,status){
        console.log(status);
        if (status == 'success') {
          if (typeof(callback) == 'function') {
            callback(data);
          }
        } else {
          //handle error
          console.log('error');
        }
      });*/
    $.ajax({
        'type': 'GET',
        'dataType': 'json',
        'url': config.apiURL,
        'data': {'function': 'summonerInfo', 'summonerName' : summonerName},
        'success': function(res){
          if (res.status > 0) {
            if (typeof(callback) == 'function') {
              callback(res.data);
            }
          } else {
            //handle error
            console.log('error');
          }
        }
    });

  };
  runes = function(summonerName,callback){
    //console.log('runes');
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'getRunes','summonerName' : summonerName},
      'success': function(res){
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
  };

  masteries = function(summonerName,callback){
      //  console.log('masteries');
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'getMasteries','summonerName' : summonerName},
      'success': function(res){
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
  };

  league = function(summonerName,callback){
      //  console.log('league');
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'getLeague','summonerName' : summonerName},
      'success': function(res){
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
  };

  rankedStats = function(summonerName,season,callback){
    //console.log('rankedStats');
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'getRankedStats','summonerName' : summonerName,'season' : season},
      'success': function(res){
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
  }

  return {
    summonerInfo : summonerInfo,
    runes : runes,
    masteries : masteries,
    league : league,
    rankedStats : rankedStats,
    summonerSummary, summonerSummary
  }
};
