(function(factory){
  window.summonerBase = factory({});
}(function(summonerBase){
  var config;
  var dataModel = {
    summonerSummary : [],
    runes : [],
    masteries : []
  };
  const MAXGAME = 10;
  //export dataModel
  summonerBase.dataModel = dataModel;

  var eventsCallback = {
    'onLoad' : [],
    'champions' : [],
    'league' : [],
    'runes' : [],
    'masteries' : [],
    'matches': []
  };

  var dataFlag = false;

  summonerBase.search = 'epiccookierawr';

  function saveConfig(cfg){
    config = $.extend({},cfg);
  }

  function executeRegisteredCallbacks(event,data) {
    //console.log(eventsCallback);
    eventsCallback[event].forEach(function(callback, index){
      callback(data);
    });
  }
  summonerBase.registerEvent = function(event, callback) {
    if (typeof(callback) != 'function') return;
    eventsCallback[event].push(callback);
  }

  function buildSummonerView() {
    var data = dataModel.summonerSummary.summonerInfo[summonerBase.search];
    var topMasteries = dataModel.summonerSummary.championMastery.championMastery.slice(0,6);
    var slideArray = [];
    var skinNum = '';
    var chosenSkin;
    $.each(topMasteries,function(masteryIndex,mastery){
      var imageLength = mastery.image.length;
      var imageName = mastery.image.substr(0,imageLength - 4);
      $.each(mastery.skins,function(skinIndex,skin){
        skinNum = skin.num;
        slideArray.push(imageName+'_'+skinNum+'.jpg');
      });
    });
    //console.log(slideArray);
    chosenSkin = Math.floor(Math.random()*slideArray.length);
    var view = '';
      var iconImage = 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/profileicon/'+data.profileIconId+'.png';
      view += ''+
              '<div id="summoner-icon-div"><img src='+iconImage+' class="summoner-icon-img"></div>'+
              '<div id="summoner-name">'+data.name+'<br>Level: '+data.summonerLevel+'</div>';
    $('#summoner-overall').append(view);
    $('#summoner').css('background-image','url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+slideArray[chosenSkin]+')');
    setInterval(function(){
      chosenSkin = Math.floor(Math.random()*slideArray.length);
      $('#summoner').css('background-image','url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/'+slideArray[chosenSkin]+')');
    },10000);
  }

  function buildUIFrame(){
    var view = '';
    view += '' +
    '<div id="summoner">'+
    '<div id="summoner-overall">'+
      '<form id="search">'+
        '<input type="text" name="summoner" class="summoner-submit">'+
        '<input type="submit" value="Submit" class="submit">'+
      '</form>'+
    '</div>'+
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
    //  console.log('summary is clicked');
      $('#summary-info').empty();
      executeRegisteredCallbacks('onLoad',dataModel);
    });

    $('#champions-button').click(function(){
    //  console.log('champions is clicked');
      $('#summary-info').empty();
      executeRegisteredCallbacks('champions',dataModel);
    });

    $('#league-button').click(function(){
    //  console.log('league is clicked');
      $('#summary-info').empty();
      executeRegisteredCallbacks('league',dataModel);
    });

    $('#matches-button').click(function(){
    //  console.log('matches is clicked');
      $('#summary-info').empty();
      executeRegisteredCallbacks('matches',dataModel);
    });

    $('#runes-button').click(function(){
      //console.log('runes is clicked');
      $('#summary-info').empty();
      var dataAPISummoner = lolSummonerData(config);
      dataAPISummoner.runes(summonerBase.search,function(res){
        dataModel.runes = res;
        executeRegisteredCallbacks('runes',res);
      });
    });

    $('#masteries-button').click(function(){
      //console.log('masteries is clicked');
      $('#summary-info').empty();
      var dataAPISummoner = lolSummonerData(config);
      dataAPISummoner.masteries(summonerBase.search,function(res){
        dataModel.masteries = res;
        executeRegisteredCallbacks('masteries',res);
      });
    });
  }

    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function summonerSearch(summoner){
      if(getParameterByName(summoner)){
        summonerBase.search = getParameterByName(summoner).toLowerCase();
      }
    }

  summonerBase.load = function(cfg){
    var dataAPISummoner = lolSummonerData(cfg);
    saveConfig(cfg);
    summonerSearch('summoner');
    console.log(summonerBase.search);
    dataAPISummoner.summonerSummary(summonerBase.search,'SEASON2016',function(res){
      dataModel.summonerSummary = res;
      //console.log(res);
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
