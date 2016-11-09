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
    '<div id="summoner-mastery">'+
      '<div id="summoner-mastery-title">Champion Mastery</div>'+
      '<div id="summoner-mastery-detail"></div>'+
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
      //this needs graphical representation
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
    var championPic = '';
    var championStats;
    var averageKill,averageDeath,averageAssists,averageCS;
    var totalSession;

    //console.log(data);
    $.each(data,function(key,rankedStats){
      championStats = '';
      jQuery('<div/>',{
        id: rankedStats.name+'-info',
        class: 'ranked-stats-div'
      }).appendTo('#champion-summary');
      totalSession = Number(rankedStats.stats.totalSessionsPlayed);
      averageKill = Number(rankedStats.stats.totalChampionKills)/totalSession;
      averageDeath = Number(rankedStats.stats.totalDeathsPerSession)/totalSession;
      averageAssists = Number(rankedStats.stats.totalAssists)/totalSession;
      averageCS = Number(rankedStats.stats.totalMinionKills)/totalSession;

      averageKill = +averageKill.toFixed(2);
      averageDeath = +averageDeath.toFixed(2);
      averageAssists = +averageAssists.toFixed(2);
      averageCS = +averageCS.toFixed(2);

      championStats += '<div class="ranked-stats-info">'+
      '<div>'+rankedStats.name+'</div>' +
      '<div>KDA:'+averageKill+'/'+averageDeath+'/'+averageAssists+'</div>' +
      '<div>CS:'+averageCS+'</div>' +
      '<div>Total Played:'+rankedStats.stats.totalSessionsPlayed+'</div>'+
      '</div>';

      jQuery('<div/>',{
        id: rankedStats.name+'-image',
        class: 'ranked-stats-pic',
      }).appendTo('#'+rankedStats.name+'-info');

      $('#'+rankedStats.name+'-image').css(
        'background-image', 'url(http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+rankedStats.image+')'
      );

      $('#'+rankedStats.name+'-image').addClass("ranked-stats-pic-style");

      $('#'+rankedStats.name+'-info').append(championStats);
    });
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
  }

  function championMastery(){
    var data= dataModel.summonerSummary.championMastery.championMastery.slice(0,6);
    var championMasteryDetail;
    var championMasteryImg;

    $.each(data,function(index,champion){
      championMasteryDetail = '';
      championMasteryImg = '';
      jQuery('<div/>',{
        id: 'champion-mastery'+champion.name,
        class: 'champion-mastery'
      }).appendTo('#summoner-mastery-detail');
      jQuery('<div/>',{
        id: 'champion-mastery-div-img'+champion.name,
        class: 'champion-mastery-div-img'
      }).appendTo('#champion-mastery'+champion.name);
      jQuery('<div/>',{
        id: 'champion-mastery-info'+champion.name,
        class: 'champion-mastery-info'
      }).appendTo('#champion-mastery'+champion.name);

      championMasteryDetail += '' +
      '<div>'+champion.name+'</div>'+
      '<div>'+champion.championPoints+' points</div>';

      championMasteryImg += '<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+champion.image+'" class="champion-mastery-img">'+
                            '<img src="images/mastery_icons/Champ_Mastery_'+champion.championLevel+'.png" class="champion-mastery-icon">';

      $('#champion-mastery-info'+champion.name).append(championMasteryDetail);
      $('#champion-mastery-div-img'+champion.name).append(championMasteryImg);
    });
    //console.log(data);
  }

  function loadAllMatchListData(){
    $.ajax({
        'dataType': 'json',
        'url': 'staticData/summoner.json',
        'data': {},
        'success': function(res){
          buildMatchListView(res);
        }
    });
  }

  function buildMatchListView(res) {
    var data = dataModel.summonerSummary.matchList.matchList.games;
    var summonerSpell = res.data;
    console.log(data);
    console.log(res);
    var view = '';
    var gameType = '';
    var gamePic = '';
    var gameInfo = '';
    var gameItems = '';
    var gameMembers = '';
    var teamColor;
    var date;
    var win;
    data.forEach(function(match){
      gameType = '';
      gamePic = '';
      gameInfo = '';
      gameItems = '';
      gameMembers = '';
      jQuery('<div/>',{
        id: 'game-id-'+match.gameId,
        class: 'game-id'
      }).appendTo('#game-stat');

      jQuery('<div/>',{
        id: 'game-type-'+match.gameId,
        class: 'game-type'
      }).appendTo('#game-id-'+match.gameId);
      jQuery('<div/>',{
        id: 'game-pic-'+match.gameId,
        class: 'game-pic'
      }).appendTo('#game-id-'+match.gameId);
      jQuery('<div/>',{
        id: 'game-info-'+match.gameId,
        class: 'game-info'
      }).appendTo('#game-id-'+match.gameId);
      jQuery('<div/>',{
        id: 'game-items-'+match.gameId,
        class: 'game-items'
      }).appendTo('#game-id-'+match.gameId);
      jQuery('<div/>',{
        id: 'game-members-'+match.gameId,
        class: 'game-members'
      }).appendTo('#game-id-'+match.gameId);

      if(match.teamId == 100){
        teamColor = "Blue";
      }
      else{
        teamColor = "Purple";
      }
      date = Date.now() - match.createDate; //difference between now and the createdDate
      date = Math.floor(date/1000); //convert timestamp from unix to milliseconds
      date = Math.floor(date/86400);//convert timestamp from milliseconds to days

      win = (match.stats.win)? 'Victory':'Defeat';

      var img = '';
      for(var i=1; i<=2;i++){
        var spell = match['spellName'+i];
        //console.log(spell);
        $.each(summonerSpell,function(name,detail){
          if(name.replace('Summoner','') == spell){
            img += '<img src=http://ddragon.leagueoflegends.com/cdn/6.22.1/img/spell/'+detail.image.full+'>';
            console.log(img);
          }
        });
      }

      gameType += ''+
      '<div>'+match.subType.replace('_',' ')+'</div>'+
      '<div>'+match.ipEarned+' ip earned</div>'+
      '<div>'+teamColor+' team</div>'+
      '<div>'+win+'</div>'+
      '<div>'+date+' days ago</div>';
      gamePic += '' +
      '<div>'+match.image+'</div>'+
      '<div>'+match.championName+'</div>'+
      '<div>'+img+'</div>';
      gameInfo += '' +
      '<div>'+match.stats.championsKilled+'/'+match.stats.championsKilled+'/'+match.stats.numDeaths+'</div>'+
      '<div>'+match.stats.timePlayed+'</div>'+
      '<div>'+match.stats.minionsKilled+'</div>'+
      '<div>'+match.stats.wardPlaced+'</div>'+
      '<div>'+match.stats.level+'</div>';
      gameItems += '' +
      '<div>'+match.stats.itemName0+'</div>'+
      '<div>'+match.stats.itemName1+'</div>'+
      '<div>'+match.stats.itemName2+'</div>'+
      '<div>'+match.stats.itemName3+'</div>'+
      '<div>'+match.stats.itemName4+'</div>'+
      '<div>'+match.stats.itemName5+'</div>'+
      '<div>'+match.stats.itemName6+'</div>';

      $('#game-type-'+match.gameId).append(gameType);
      $('#game-pic-'+match.gameId).append(gamePic);
      $('#game-info-'+match.gameId).append(gameInfo);
      $('#game-items-'+match.gameId).append(gameItems);
    });
  }

  summonerBase.matchDetail = function(matchId){
    //console.log('matchDetail is clicked');
    //console.log(matchId);
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
    loadAllMatchListData();
    championMastery();
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
