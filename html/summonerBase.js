(function(factory){
  window.summonerBase = factory({});
}(function(summonerBase){
  var config;
  var dataModel = {
    summonerSummary : []
  };
  const MAXGAME = 10;
  //export dataModel
  summonerBase.dataModel = dataModel;

  var eventsCallback = {
    'onLoad' : [],
    'base' : []
  };

  var dataFlag = false;

  summonerBase.search = 'epiccookierawr';

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

  function buildSummonerView() {
    var data = dataModel.summonerSummary.summonerInfo[summonerBase.search];
    console.log(data);
    var view = '';
      var iconImage = 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/profileicon/'+data.profileIconId+'.png';
      view += ''+
              '<div><img src='+iconImage+'></div>'+
              '<div>'+data.name+'</div>' +
              '<div>'+data.summonerLevel+'</div>';
    $('#summoner').append(view);
  }

  function buildUIFrame(){
    var view = '';
    view += '' +
    '<div id="summoner">'+
    '</div>'+
    '<div id="menu">'+
      '<ul class="menu">'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="summary-button">Summary</a></li>'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="champions-button">Champions</a></li>'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="league-button">League</a></li>'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="matches-button">Matches</a></li>'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="runes-button">Runes</a></li>'+
        '<li class="menu"><a href="#" class="btn btn-info" role="button" id="masteries-button">Masteries</a></li>'+
      '</ul>'+
    '</div>'+
    '<div id="summary-info">'+
    '</div>';

    $('#'+config.containerId).append(view);
  }

  function bindevent(){
    $('#summary-button').click(function(){
      console.log('summary is clicked');
      $('#summary-info').empty();
      executeRegisteredCallbacks('onLoad',dataModel);
    });

    $('#champions-button').click(function(){
      console.log('champions is clicked');
    });

    $('#league-button').click(function(){
      console.log('league is clicked');
    });

    $('#matches-button').click(function(){
      console.log('matches is clicked');
    });

    $('#runes-button').click(function(){
      console.log('runes is clicked');
    });

    $('#masteries-button').click(function(){
      console.log('masteries is clicked');

    });
  }

  summonerBase.load = function(cfg){
    var dataAPISummoner = lolSummonerData(cfg);
    saveConfig(cfg);
    dataAPISummoner.summonerSummary(summonerBase.search,'SEASON2016',function(res){
      dataModel.summonerSummary = res;
      //summonerBase.buildView(res);
      executeRegisteredCallbacks('onLoad',res);
      //console.log(JSON.stringify(summonerBase.dataModel));
      //console.log(JSON.stringify(dataModel));
      buildSummonerView();
    });
    buildUIFrame();
    bindevent();
  };




  //console.log(JSON.stringify(summonerBase.dataModel));

  return summonerBase;
}));
