(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  const MAXGAME = 10;
  var config = {};

  function bindEvent() {
    $('.match-detail-button').each(function(){
      $(this).click(function(){
        //console.log('clicked');
        var matchId = $(this).attr('id').replace($(this).attr('class'),'');
        summonerBase.matchDetail(matchId);
      });
    });
  }

  function buildSummonerView() {
    //check if dataModel changed?
    //if unchanged return
    var view = '';
    view += '' +
    '<div id="summary">'+
    '</div>'+
    '<div id="champion-summary">'+
    '</div>'+
    '<div id="summoner-average">'+
    '</div>'+
    '<div id="game-stat">'+
    '</div>';

    $('#summary-info').append(view);
  }

  function buildLeagueView(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
    console.log(data);
    var playerInfo = {};
    var summary='';

    data.forEach(function(league){
      summary = ''+
            '<div>'+league.name+'</div>' +
            '<div>'+league.queue+'</div>' +
            '<div>'+league.tier+'</div>';
      $.each(league.entries,function(key,league){
        if(league.playerOrTeamId == id){
          playerInfo = league;
        }
      });
      //console.log(playerInfo);
    });
    summary += ''+
    '<div>'+playerInfo.isHotStreak+'</div>' +
    '<div>'+playerInfo.leaguePoints+'</div>' +
    '<div>'+playerInfo.wins+'</div>' +
    '<div>'+playerInfo.losses+'</div>' +
    '<div>'+JSON.stringify(playerInfo.miniSeries)+'</div>';

    $('#summary').append(summary);
  }

  function buildRankedStatsView(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions.slice(0,10);
    var championStats = '';
    console.log(data);
    $.each(data,function(key,rankedStats){
      championStats += ''+
      '<div>'+rankedStats.name+'</div>' +
      '<div>'+rankedStats.stats.totalChampionKills+'</div>' +
      '<div>'+rankedStats.stats.maxNumDeaths+'</div>' +
      '<div>'+rankedStats.stats.totalAssists+'</div>' +
      '<div>'+rankedStats.stats.totalSessionsPlayed+'</div>';
    });

    $('#champion-summary').append(championStats);
  }

  function buildSummonerAverageView(){
    var data = dataModel.summonerSummary.matchList.matchList.games;
    console.log(data);
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

  function buildMatchListView() {
    var data = dataModel.summonerSummary.matchList.matchList.games;
    var view = '';
    data.forEach(function(match){
      var statusView = (match.stats.win) ? 'YAY' : 'SUCKER' ;
      view += ''+
              '<div><h3>'+statusView+'</h3></div>'+
              '<div>'+match.championName+match.spellName1+match.spellName2+'</div>' +
              '<input type="button" class="match-detail-button" id="match-detail-button'+match.gameId+'"">'+match.gameId+'</input>'+
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
    $('#game-stat').append(view);
  }

  summonerBase.matchDetail = function(matchId){
    console.log('matchDetail is clicked');
    console.log(matchId);
    var dataAPI = lolHistoryData(config);
    dataAPI.matchDetail(matchId,function(res){
      //console.log(res);
      $('#game'+matchId).append(JSON.stringify(res));
  });
}


  summonerBase.registerEvent('onLoad',function(data){
    console.log('build Summoner Summary view');
    buildSummonerView();
    buildLeagueView();
    buildRankedStatsView();
    buildSummonerAverageView();
    buildMatchListView();
    bindEvent();
  });
  //summonerBase.registerEvent('onLoad',buildView);
  /*
  summonerBase.buildView = function(data){
    var data = data;
    console.log(data);
  }*/

  return summonerBase;
}))
