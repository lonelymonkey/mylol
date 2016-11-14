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
        //console.log(res);
        $.each(res.rankedStats.champions,function(key,champion){
          buildChampionRow(champion);
        })
      });
    });
  }

  function buildChampionView(){
    var view = '';
    view += '' +
      '<div id="champion-page">'+
        '<div class="btn-group">'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2016-button">Season 6</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2015-button">Season 5</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON2014-button">Season 4</button>'+
          '<button type="button" class="btn btn-primary season-button" id="SEASON3-button">Season 3</button>'+
        '</div>'+
      '<div id="champion-stats-name">'+
        '<ul class="champion-row">'+
          '<li  class="champion-champion-pic champion-list-name">Champion</li>'+
          '<li class="champion-champion-won champion-list-name">Won</li>'+
          '<li class="champion-champion-lost champion-list-name">Loss</li>'+
          '<li class="champion-champion-kda champion-list-name">KDA</li>'+
          '<li class="champion-champion-gold champion-list-name">Average Gold</li>'+
          '<li class="champion-champion-cs champion-list-name">Average CS</li>'+
          '<li class="champion-champion-win champion-list-name">Win Rate</li>'+
          '<li class="champion-champion-mastery champion-list-name">Mastery Points</li>'+
          '<li class="champion-champion-penta champion-list-name">Penta</li>'+
          '<li class="champion-champion-quadra champion-list-name">Quadra</li>'+
          '<li class="champion-champion-triple champion-list-name">Triple</li>'+
        '</ul>'+
      '</div>'+
      '<div id="champion-list">'+
      '</div>'+
      '</div>';

    $('#summary-info').append(view);
  }

  function buildChampionList(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions;
    //console.log(data);
    $.each(data,function(key,rankedStats){
      buildChampionRow(rankedStats);
    });
  }

  function buildChampionRow(data){
    //console.log(data);
    var stats = data.stats;
    var masteries = dataModel.summonerSummary.championMastery.championMastery;
    //console.log(masteries);

    var averageKill,averageDeath,averageAssists,averageCS,averageGold;
    var totalSession;
    var view = '';
    var pic = '<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+data.image+'" class="champion-champion-img">';

    var ctx;
    var myDoughnutChart;
    var winRate;
    var pieData ={
      labels: [
          "Won",
          "Loss"
      ],
      datasets: [
          {
              data: [],
              backgroundColor: [
                  "#36A2EB",
                  "#FF6384"
              ],
              hoverBackgroundColor: [
                  "#36A2EB",
                  "#FF6384"
              ]
          }]
  };
    if(data.id != '0'){
      totalSession = Number(stats.totalSessionsPlayed);
      averageKill = Number(stats.totalChampionKills)/totalSession;
      averageDeath = Number(stats.totalDeathsPerSession)/totalSession;
      averageAssists = Number(stats.totalAssists)/totalSession;
      averageCS = Number(stats.totalMinionKills)/totalSession;
      averageGold = Number(stats.totalGoldEarned)/totalSession;

      averageKill = +averageKill.toFixed(1);
      averageDeath = +averageDeath.toFixed(1);
      averageAssists = +averageAssists.toFixed(1);
      averageCS = +averageCS.toFixed(1);
      averageGold = +averageGold.toFixed(1);

      winRate = Math.floor(Number(stats.totalSessionsWon)/totalSession*100);

      view += '' +
      '<div class="champion-row-div">'+
        '<ul class="champion-row">'+
          '<li id="champion-champion-pic'+data.id+'" class="champion-champion-pic">'+
            '<div id="champion-champion-name'+data.id+'" class="champion-champion-name"></div>'+
            '<div id="champion-champion-icon'+data.id+'"></div>'+
          '</li>'+
          '<li class="champion-champion-won champion-num">'+stats.totalSessionsWon+'</li>'+
          '<li class="champion-champion-lost champion-num">'+stats.totalSessionsLost+'</li>'+
          '<li class="champion-champion-kda champion-num">'+averageKill+'/'+averageDeath+'/'+averageAssists+'</li>'+
          '<li class="champion-champion-gold champion-num">'+averageGold+'</li>'+
          '<li class="champion-champion-cs champion-num">'+averageCS+'</li>'+
          '<li class="champion-champion-win"><canvas id="winrate'+data.id+'" width="60" height="60"></canvas><div class="winrate-num">'+winRate+'</li>'+
          '<li id="champion-champion-mastery'+data.id+'" class="champion-champion-mastery champion-num"></li>'+
          '<li class="champion-champion-penta champion-num">'+stats.totalTripleKills+'</li>'+
          '<li class="champion-champion-quadra champion-num">'+stats.totalQuadraKills+'</li>'+
          '<li class="champion-champion-triple champion-num">'+stats.totalPentaKills+'</li>'+
        '</ul>'+
      '</div>';
      $('#champion-list').append(view);

      ctx = document.getElementById('winrate'+data.id);
      //console.log(ctx);
      pieData.datasets[0].data.push(stats.totalSessionsWon);
      pieData.datasets[0].data.push(stats.totalSessionsLost);
      //console.log(pieData);
      myDoughnutChart = new Chart(ctx,{
          type: 'doughnut',
          data: pieData,
          options: {legend: {
              display: false
           },animation : false}
      });


      $('#champion-champion-pic'+data.id).append(pic);
      $.each(masteries,function(masteryIndex,mastery){
        if(data.id == mastery.championId){
          $('#champion-champion-name'+data.id).html(mastery.name);
          $('#champion-champion-icon'+data.id).html('<img src="images/mastery_image/Champ_Mastery_'+mastery.championLevel+'.png" class="champion-champion-icon">');
          $('#champion-champion-mastery'+data.id).html(mastery.championPoints);
        }
      });
    }
  }

  summonerBase.registerEvent('champions',function(data){
    //console.log('build Summoner Champion view');
    buildChampionView();
    buildChampionList();
    bindEvent();
  });

  return summonerBase;
}))
