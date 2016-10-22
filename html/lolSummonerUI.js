(function(factory){
  window.lolSummonerUI = factory({});
}(function(lolSummonerUI){
  var dataAPI;
  var config;
  var dataModel = {
    summonerInfo : [],
    runes : [],
    masteries : [],
    league : [],
    rankedStats : []
  };

  var search = 'epiccookierawr';

  saveConfig  = function(cfg){
    config = $.extend({},cfg);
  }

  /*function buildUIFrame () {
    $('#'+config.containerId).html(
      '<div id="data-body"></div>'
    );
  };*/

  //views for summary page

  function buildSummonerView() {
    var data = dataModel.summonerInfo;
    //console.log(data);
    var view = '';
      var iconImage = 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/profileicon/'+data.profileIconId+'.png';
      view += ''+
              '<div><img src='+iconImage+'></div>'+
              '<div>'+data.name+'</div>' +
              '<div>'+data.summonerLevel+'</div>';
    $('#summoner').append(view);
  }

  function buildLeagueView(){
    var data = dataModel.league;
    console.log(data);
    var playerInfo = {};
    var summary='';

    data.forEach(function(league){
      summary = ''+
            '<div>'+league.name+'</div>' +
            '<div>'+league.queue+'</div>' +
            '<div>'+league.tier+'</div>';
      $.each(league.entries,function(key,league){
        if(league.playerOrTeamId == dataModel.summonerInfo.id){
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
    var data = dataModel.rankedStats.slice(0,10);
    var championStats = '';
    //console.log(data);
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

  //views for summary page

  //views for champions page
  function buildChampionList(){
    var data = dataModel.rankedStats;
    var view = '';
    console.log(data);
    $.each(data,function(key,rankedStats){
      view += '<ul class="champion-column">'+
      '<li class="champion-stats">'+rankedStats.name+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalChampionKills+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.maxNumDeaths+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalAssists+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalDamageDealt+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalDamageTaken+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalDoubleKills+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalGoldEarned+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalMagicDamageDealt+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalQuadraKills+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalSessionsWon+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalSessionsLost+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalTurretsKilled+'</li>' +
      '<li class="champion-stats">'+rankedStats.stats.totalTripleKills+'</li>' +
      '</ul>';
    });
    $('#champion-list').append(view);
  }
  //views for champions page

  function dataAPICall(containerId){
    console.log(containerId);
    dataAPI.summonerInfo(search,function(res){
      dataModel.summonerInfo = res[search];
      //console.log(dataModel.summonerInfo);
        buildSummonerView();
          });
    dataAPI.league(search, function(res){
      dataModel.league = res.summonerLeague[[dataModel.summonerInfo.id]];
      //console.log(res);
      if(containerId == 'summary-info'){
        buildLeagueView();
      }
    });
    dataAPI.rankedStats(search, function(res){
      //console.log(res);
      dataModel.rankedStats = res.rankedStats.champions;
      if(containerId == 'summary-info'){
        buildRankedStatsView();
      }
      else if(containerId == 'champions'){
        buildChampionList();
      }
    });
  }

  lolSummonerUI.load = function(cfg){
    //console.log('init from lolSummonerUI');
    saveConfig(cfg);
    //this goes first to get the necessary info for the other api calls
    dataAPI = lolSummonerData(cfg);
    dataAPICall(config.containerId);

  };
  return lolSummonerUI;
}))
