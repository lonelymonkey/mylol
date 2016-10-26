(function(factory){
  window.summonerBase = factory({});
}(function(summonerBase){
  var config;
  var dataModel = {
    summonerSummary : []
  };
  //export dataModel
  summonerBase.dataModel = dataModel;

  var eventsCallback = {
    'onLoad' : []
  };

  var dataFlag = false;

  var search = 'epiccookierawr';

  function saveConfig(cfg){
    config = $.extend({},cfg);
  }

  function executeRegisteredCallbacks(event,data) {
    eventsCallback[event].forEach(function(callback, index){
      callback(data);
    });
  }
  summonerBase.registerEvent = function(event, callback) {
    if (typeof(callback) != 'function') return;
    eventsCallback[event].push(callback);
  }


  summonerBase.load = function(cfg){
    var dataAPISummoner = lolSummonerData(cfg);
    saveConfig(cfg);
    dataAPISummoner.summonerSummary(search,'SEASON2016',function(res){
      dataModel.summonerSummary = res;
      //summonerBase.buildView(res);
      executeRegisteredCallbacks('onLoad',res);
      //console.log(JSON.stringify(summonerBase.dataModel));
      //console.log(JSON.stringify(dataModel));
    });
  };






  //console.log(JSON.stringify(summonerBase.dataModel));

  return summonerBase;
}));
