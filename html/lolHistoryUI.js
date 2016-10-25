(function(factory){
  window.lolHistoryUI = factory({});
}(function(lolHistoryUI){
  const MAXGAME = 10;
  var dataAPI ;
  var config = {};
  var dataModel = {
    matchList : [],
    matchDetail : []
  };

  function saveConfig(cfg){
    config = $.extend(config,cfg);
  }

  lolHistoryUI.matchDetail = function(matchId){
    dataAPI.matchDetail(matchId,function(res){
      console.log(res);
      dataModel.matchDetail = res;
      //console.log(res);
      $('#game'+matchId).append(JSON.stringify(dataModel.matchDetail));
  });
}


  /*function buildUIFrame() {
    var view += '' +
    '<div id="summoner-info">'+
      '<div id="summary">'+
      '</div>'+
      '<div id="champion-summary">'+
      '</div>'+
      '<div id="summoner-average">'+
      '</div>'+
      '<div id="game-stat">'+
      '</div>'+
    '</div>';

    $('#content').append(view);
  };*/

  function buildMatchListView(data) {
    var view = '';
    data.forEach(function(match){
      var statusView = (match.stats.win) ? 'YAY' : 'SUCKER' ;
      view += ''+
              '<div><h3>'+statusView+'</h3></div>'+
              '<div>'+match.championName+match.spellName1+match.spellName2+'</div>' +
              '<input type="button" class="gameID" onclick=lolHistoryUI.matchDetail('+match.gameId+')>'+match.gameId+'</input>'+
              '<div>'+match.stats.itemName0+'</div>' +
              '<div>'+match.stats.itemName1+'</div>' +
              '<div>'+match.stats.itemName2+'</div>' +
              '<div>'+match.stats.itemName3+'</div>' +
              '<div>'+match.stats.itemName4+'</div>' +
              '<div>'+match.stats.itemName5+'</div>' +
              '<div>'+match.stats.itemName6+'</div>' +
              '<div>'+JSON.stringify(match.fellowPlayers)+'</div>'+
              '<div id="game'+match.gameId+'"></div>';
    });
    return view;
  }

  function buildSummonerAverageView(){
    var data = dataModel.matchList;
    var total = {
      Kill : 0,
      Death : 0,
      Assist : 0,
      win : 0,
      loss : 0
    };
    var view = '';
    $.each(data,function(key,game){
      if(game.stats.assists == null){
        total.Assist += 0;
      }
      else{
        total.Assist += game.stats.assists;
      }

      if(game.stats.numDeaths == null){
        total.Death += 0;
      }
      else{
        total.Death += game.stats.numDeaths;
      }

      if(game.stats.championsKilled == null){
        total.Kill += 0;
      }
      else{
        total.Kill += game.stats.championsKilled;
      }

      if(game.stats.win == true){
        total.win += 1;
      }
      else{
        total.loss += 1;
      }
    });
    //console.log(total);

    view = ''+
    '<div>'+total.Kill/MAXGAME+'</div>' +
    '<div>'+total.Death/MAXGAME+'</div>' +
    '<div>'+total.Assist/MAXGAME+'</div>' +
    '<div>'+total.win+'</div>' +
    '<div>'+total.loss+'</div>';

    $('#summoner-average').html(view);
  }

  function buildView(){
    var view = '';

    var data = dataModel.matchList.slice(0,5);

    view = buildMatchListView(data);
    //console.log(view);
    $('#game-stat').html(view);
  };

  function dataAPICall(){
    dataAPI.matchList('epiccookierawr',function(res){
      dataModel.matchList = res.matchList.games;
      console.log(res);
      buildView();
      buildSummonerAverageView();
    });
  }

  lolHistoryUI.load = function(cfg){
    saveConfig(cfg);
    //console.log(config);

    dataAPI = lolHistoryData(cfg);
    //console.log(dataAPI);
    dataAPICall();


  };
  return lolHistoryUI;
}))
