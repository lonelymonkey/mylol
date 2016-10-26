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
      callback();
    });
  }
  summonerBase.registerEvent = function(event, callback) {
    if (typeof(callback) != 'function') return;
    eventsCallback[event].push(callback);
  }

  function buildUIFrame(){
    var view = '';
    view += '' +
    '<div id="summoner">'
    '</div>'
    '<div id="menu">'
      '<ul class="menu">'
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="summary-button">Summary</a></li>
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="champions-button">Champions</a></li>
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="league-button">League</a></li>
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="matches-button">Matches</a></li>
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="runes-button">Runes</a></li>
        <li class="menu"><a href="#" class="btn btn-info" role="button" id="masteries-button">Masteries</a></li>
      </ul>
    </div>
    <div id="content">

    </div>
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
    buildUIFrame();
  };






  //console.log(JSON.stringify(summonerBase.dataModel));

  return summonerBase;
}));
