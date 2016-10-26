(function(factory){
  window.lolSummonerUI = factory({});
}(function(lolSummonerUI){
  var dataAPI;
  var config;
  var dataModel = {
    summonerInfo : [],
    runes : {},
    masteries : {},
    league : [],
    rankedStats : []
  };

  var leagueList = {
    one : '',
    two : '',
    three : '',
    four : '',
    five : ''
  }

  var search = 'epiccookierawr';
  var season = 'SEASON2016';

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
    //console.log(data);
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
  //  console.log(data);
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

  function buildLeagueListView(){
    var data = dataModel.league;
    console.log(data);
    //console.log(data.entries);
    var generalInfo = '';

    $.each(data,function(key,summoner){
      generalInfo += '' +
      '<div>'+summoner.name+'</div>'+
      '<div>'+summoner.queue+'</div>'+
      '<div>'+summoner.tier+'</div>';
      $.each(summoner.entries,function(key,otherSummoner){
        if(otherSummoner.division == 'I'){
          leagueList.one += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'II'){
          leagueList.two += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'III'){
          leagueList.three += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'IV'){
          leagueList.four += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'V'){
          leagueList.five += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }

      });
    });

    $('#league-icon').append(generalInfo);
    $('#league-list').append(leagueList.two);

  }

  function bindevent(page){
    if(page == 'champions'){
      $('#season6-button').click(function(){
        season = 'SEASON2016';
        $('#champion-list').empty();
        dataAPI.rankedStats(search,season, function(res){
          dataModel.rankedStats = res.rankedStats.champions;
            buildChampionList();
          });
      });
      $('#season5-button').click(function(){
        season = 'SEASON2015';
        $('#champion-list').empty();
        dataAPI.rankedStats(search,season, function(res){
          dataModel.rankedStats = res.rankedStats.champions;
            buildChampionList();
          });
      });
      $('#season4-button').click(function(){
        season = 'SEASON2014';
        $('#champion-list').empty();
        dataAPI.rankedStats(search,season, function(res){
          dataModel.rankedStats = res.rankedStats.champions;
            buildChampionList();
          });
      });
      $('#season3-button').click(function(){
        season = 'SEASON3';
        $('#champion-list').empty();
        dataAPI.rankedStats(search,season, function(res){
          dataModel.rankedStats = res.rankedStats.champions;
            buildChampionList();
          });
      });
    }
    else if(page == 'league-list'){
      $('#rank1-button').click(function(){
        console.log('1');
        $('#league-list').empty();
        $('#league-list').append(leagueList.one);
      });
      $('#rank2-button').click(function(){
        console.log('2');
        $('#league-list').empty();
        $('#league-list').html(leagueList.two);
      });
      $('#rank3-button').click(function(){
        console.log('3');
        $('#league-list').empty();
        $('#league-list').html(leagueList.three);
      });
      $('#rank4-button').click(function(){
        console.log('4');
        $('#league-list').empty();
        $('#league-list').html(leagueList.four);
      });
      $('#rank5-button').click(function(){
        console.log('5');
        $('#league-list').empty();
        $('#league-list').html(leagueList.five);
      });
    }


  }
  //views for champions page

  function buildRunesView(){
    var data = dataModel.runes.pages;
    var list = '<ul class="list-group">';
    var detail = '';
    var sum = [];

  //  console.log(data);
    $.each(data,function(key, runePage){
      list += '<li class="list-group-item">'+runePage.name+'</li>';
      $.each(runePage.slots,function(key,rune){
        detail += '<div>'+rune.runeName+'</div>';
      });
    });
    list += '</ul>';

    $('#runes-list').append(list);
    $('#runes-detail').append(detail);
  }

  function buildMasteriesView(){
    var data = dataModel.masteries.pages;
    console.log(data);
    var list = '';
    var detail = '';

    $.each(data,function(key, masteriesPage){
      //console.log(masteriesPage);
      list += '<div>'+masteriesPage.name+'</div>';
      $.each(masteriesPage.masteries,function(key,mastery){
        detail += '<div>'+mastery.masteryName+mastery.rank+'</div>';
      });
    });


    $('#masteries-list').append(list);
    $('#masteries-detail').append(detail);
  }

  function dataAPICall(containerId){
    var containerId = containerId;

    //console.log(containerId);
    dataAPI.summonerInfo(search,function(res){
      dataModel.summonerInfo = res[search];
      console.log(res);
        if($.trim( $('#summoner').html() ).length == 0){
          buildSummonerView();
        }

    });
    dataAPI.league(search, function(res){
      dataModel.league = res.summonerLeague[[dataModel.summonerInfo.id]];
      console.log(dataModel.league);
      if(containerId == 'summary-info'){
        buildLeagueView();
      }
      else if(containerId =='league-list'){
        buildLeagueListView();
      }
    });
    dataAPI.rankedStats(search,season, function(res){
      console.log(res);
      dataModel.rankedStats = res.rankedStats.champions;
      if(containerId == 'summary-info'){
        buildRankedStatsView();
      }
      else if(containerId == 'champions'){
        buildChampionList();
      }
    });
    dataAPI.runes(search,function(res){
      dataModel.runes = res.summonerRunes[[dataModel.summonerInfo.id]];
      console.log(dataModel.runes);
      if(containerId == 'runes'){
        buildRunesView();
      }
    });

    dataAPI.masteries(search,function(res){
      dataModel.masteries = res.summonerMasteries[[dataModel.summonerInfo.id]];
      //console.log(res);
      console.log(dataModel);
    });
  }

  function buildView(){
    console.log(dataModel);

      buildMasteriesView();
  }

  lolSummonerUI.load = function(cfg){
    //console.log('init from lolSummonerUI');
    saveConfig(cfg);
    //this goes first to get the necessary info for the other api calls
    dataAPI = lolSummonerData(cfg);
    console.log(dataAPI);
    //dataAPICall(config.containerId);
    dataAPI.summonerSummary(search,'SEASON2016',function(res){
      dataModel.summonerInfo = res;
      console.log(dataModel.summonerInfo);
    });
    //responsible for all the buttons within the content
    bindevent(config.containerId);

  };
  return lolSummonerUI;
}))
