(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};
  var dataAPI = lolSummonerData(config);

  function bindEvent() {
    $('.season-button').click(function(){
      var seasonId = $(this).attr('id').replace('-button','');
      $('#champion-list').empty();
      dataAPI.rankedStats(summonerBase.search,seasonId,function(res){
        $('#champion-list').append(JSON.stringify(res));
      });
    });
  }

  function buildChampionView(){
    var view = '';
    view += '' +
        '<div class="btn-group">'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2016-button">Season 6</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2015-button">Season 5</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2014-button">Season 4</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON3-button">Season 3</button>'+
        '</div>'+
      '<div id="champion-list">'+
        '<ul class="champion-column">'+
          '<li class="champion-stats">#</li>'+
          '<li class="champion-stats">Champion</li>'+
          '<li class="champion-stats">Played</li>'+
          '<li class="champion-stats">KDA</li>'+
          '<li class="champion-stats">Gold</li>'+
          '<li class="champion-stats">CS</li>'+
          '<li class="champion-stats">Turrets Killed</li>'+
          '<li class="champion-stats">Max Kills</li>'+
          '<li class="champion-stats">Max Deaths</li>'+
          '<li class="champion-stats">Average Damage Dealt</li>'+
          '<li class="champion-stats">Average Damage Taken</li>'+
          '<li class="champion-stats">Double Kill</li>'+
          '<li class="champion-stats">Triple Kill</li>'+
          '<li class="champion-stats">Quadra Kill</li>'+
        '</ul>'+
      '</div>';

    $('#summary-info').append(view);
  }

  function buildChampionList(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions;
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

  summonerBase.registerEvent('champions',function(data){
    console.log('build Summoner Champion view');
    buildChampionView();
    buildChampionList();
    bindEvent();
  });

  return summonerBase;
}))
