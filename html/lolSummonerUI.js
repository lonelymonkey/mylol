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

  function buildUIFrame () {
    $('#'+config.containerId).html(
      '<div id="data-body"></div>'
    );
  };

  function buildSummonerView(data) {
    console.log(data);
    var view = '';
      var iconImage = 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/profileicon/'+data.profileIconId+'.png';
      view += ''+
              '<div><img src='+iconImage+'></div>'+
              '<div>'+data.name+'</div>' +
              '<div>'+data.summonerLevel+'</div>';
    return view;
  }

  function buildLeagueView(data){
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
      console.log(playerInfo);
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

  buildView = function(){
    var view = '';

    var data = dataModel.summonerInfo;
    view = buildSummonerView(data);

    $('#data-body').html(view);
  };

  lolSummonerUI.load = function(cfg){
    console.log('init from lolSummonerUI');
    saveConfig(cfg);

    dataAPI = lolSummonerData(cfg);
    console.log(dataAPI);
    buildUIFrame();
    //this goes first to get the necessary info for the other api calls
    dataAPI.summonerInfo(search,function(res){
      dataModel.summonerInfo = res[search];
      console.log(dataModel.summonerInfo);
      buildView();
          });

    dataAPI.league(search, function(res){
      dataModel.league = res.summonerLeague[[dataModel.summonerInfo.id]];
      console.log(res);
      buildLeagueView(dataModel.league);
    })

    dataAPI.rankedStats(search, function(res){
      console.log(res);
      dataModel.rankedStats = res.rankedStats.champions;
      buildRankedStatsView();
    })
          /*
      dataAPI.matchDetail('2321498409',function(res){
        dataModel.matchDetail = res;
        console.log(res);
        buildView();
      });*/


  };
  return lolSummonerUI;
}))
