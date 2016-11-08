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
      '<div id="tier-icon"></div>'+
      '<div id="tier-info"></div>'+
      '<div id="tier-league"></div>'+
    //  '<canvas id="myChart" width="2px" height="2px"></canvas>'+
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
    //console.log(data);
    var playerInfo = {};
    var summary='';
    var tier;
    var rank;
    var leagueName;
    var winRate;
    //var ctx = document.getElementById("myChart");
    /*var pieData = {
    labels: [
        "Wins",
        "Losses",
    ],
    datasets:
    [{
      data: [],
      backgroundColor: ["#36A2EB","#FF6384"],
      //borderColor: ["#36A2EB","#FF6384"]
    }]
  };*/
    data.forEach(function(league){
      tier = league.tier;
      leagueName = league.name;
      $.each(league.entries,function(key,league){
        if(league.playerOrTeamId == id){
          playerInfo = league;
        }
      });
    });

    rank = tier+'_'+playerInfo.division;
    winRate = Number(playerInfo.wins)/(Number(playerInfo.wins)+Number(playerInfo.losses))*100;

    summary += ''+
      '<div>'+rank.replace('_',' ')+'</div>'+
      //'<div>'+playerInfo.isHotStreak+'</div>' +
      '<div>Points: '+playerInfo.leaguePoints+'</div>' +
      '<div>'+playerInfo.wins+'W/'+playerInfo.losses+'L</div>' +
      '<div>Win Rate: '+Math.floor(winRate)+'%</div>';

    if(playerInfo.miniSeries){
      summary += '<div>'+JSON.stringify(playerInfo.miniSeries)+'</div>';
    }

    $('#tier-info').append(summary);
    $('#tier-icon').append('<div><img src="images/tier_icons/'+rank+'.png" style="width: 100px"></div>');
    $('#tier-league').append(leagueName);
    /*var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: pieData,
        options: {}
    });*/
  }

  function buildRankedStatsView(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions.slice(0,10);
    var championStats = '';
    var championPic = '';
    var averageKill,averageDeath,averageAssists,averageCS;
    var totalSession;

    //console.log(data);
    $.each(data,function(key,rankedStats){
      totalSession = Number(rankedStats.stats.totalSessionsPlayed);
      averageKill = Number(rankedStats.stats.totalChampionKills)/totalSession;
      averageDeath = Number(rankedStats.stats.totalDeathsPerSession)/totalSession;
      averageAssists = Number(rankedStats.stats.totalAssists)/totalSession;
      averageCS = Number(rankedStats.stats.totalMinionKills)/totalSession;

      averageKill = +averageKill.toFixed(2);
      averageDeath = +averageDeath.toFixed(2);
      averageAssists = +averageAssists.toFixed(2);
      averageCS = +averageCS.toFixed(2);

      championStats += ''+
      '<div>'+rankedStats.name+'</div>' +
      '<div>'+averageKill+'/'+averageDeath+'/'+averageAssists+'</div>' +
      '<div>'+rankedStats.stats.totalSessionsPlayed+'</div>';
    });



    $('#champion-summary').append(championStats);
  }

  function buildSummonerAverageView(){
    var data = dataModel.summonerSummary.matchList.matchList.games;
    //console.log(data);
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
    //console.log('build Summoner Summary view');
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
