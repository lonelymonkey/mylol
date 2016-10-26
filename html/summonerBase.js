(function(factory){
  window.summonerBase = factory({});
}(function(summonerBase){
  var config;
  var dataModel = {
    summonerSummary : []
  }
  summonerBase.dataModel = dataModel;

  var search = 'epiccookierawr';

  function saveConfig(cfg){
    config = $.extend({},cfg);
  }

  summonerBase.load = function(cfg){
    var dataAPISummoner = lolSummonerData(cfg);
    saveConfig(cfg);
    dataAPISummoner.summonerSummary(search,'SEASON2016',function(res){
      dataModel.summonerSummary = res;
      console.log(JSON.stringify(summonerBase.dataModel));
      console.log(JSON.stringify(dataModel));
    });
  };

  return summonerBase;
}));
