lolHistoryData = function(cfg){
  var config = $.extend({
    apiURL :  'api/history.php'
  },cfg);

  matchList = function(summonerName,callback){
    //console.log('matchList'+summonerName);
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
        'data': {'function': 'matchList', 'summonerName' : summonerName},
        'success': function(res){
          //console.log(res);
          if (res.status > 0) {
            console.log(res.data);
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
  matchDetail = function(matchId,callback){
    console.log(matchId);
    $.ajax({
      'type':'GET',
      'dataType':'json',
      'url':config.apiURL,
      'data':{'function':'matchDetail','matchId':matchId},
      'success': function(res){
        //console.log(res);
        if(typeof(callback) == 'function'){
          callback(res.data);
        }
        else{
          console.log('error');
        }
        }
      });
    //console.log('matchDetail');
  };

  return {
    matchDetail : matchDetail,
    matchList : matchList
  }
};
