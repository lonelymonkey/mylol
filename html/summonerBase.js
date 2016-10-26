(function(factory){
  window.summonerBase = factory({});
}(function(summonerBase){
  var config;
  var dataModel = {
    summonerSummary : []
  }
  var dataFlag = false;

  var search = 'epiccookierawr';

  function saveConfig(cfg){
    config = $.extend({},cfg);
  }

  summonerBase.load = function(cfg){
    var dataAPISummoner = lolSummonerData(cfg);
    saveConfig(cfg);
    dataAPISummoner.summonerSummary(search,'SEASON2016',function(res){
      dataModel.summonerSummary = res;
      summonerBase.buildView(res);
      //console.log(JSON.stringify(summonerBase.dataModel));
      //console.log(JSON.stringify(dataModel));
    });
  };



  //console.log(JSON.stringify(summonerBase.dataModel));

  return summonerBase;
}));
