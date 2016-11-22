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

    $.ajax({
        'dataType': 'json',
        'url': 'staticData/item.json',
        'data': {},
        'success': function(res){
          itemDetail(res);
        }
    });
  }

  function itemDetail(res){
    var data = res.data;
    var itemTimer;
    //console.log(res);
    $('.game-items-img').each(function(item){
      var identifier = $(this).attr('id').replace($(this).attr('class'),'');
      var itemDiv = $(this).attr('id');
      var itemId = identifier.substr(0,4);
      //console.log(itemId);
      $(this).hover(function(){
        itemTimer = setTimeout(function(){
          $('#itemDesDiv'+identifier).html('<div id="item-title">'+data[itemId].name+'</div>'+data[itemId].description);
          $('#itemDesDiv'+identifier).css('visibility','visible');
        },250);
      },function(){
        clearTimeout(itemTimer);
        $('#itemDesDiv'+identifier).css('visibility','hidden');
      });
    });
  }

  function buildSummonerView() {
    //check if dataModel changed?
    //if unchanged return
    var view = '';
    view += '' +
    '<div id="summary-left">'+
      '<div id="summary">'+
        '<div id="tier-icon"></div>'+
        '<div id="tier-info"></div>'+
        '<div id="tier-league" class="bold"></div>'+
      //  '<canvas id="myChart" width="2px" height="2px"></canvas>'+
      '</div>'+
      '<div id="champion-summary">'+
      '</div>'+
    '</div>'+
    '<div id="summary-right">'+
      '<div id="summoner-mastery">'+
        '<div id="summoner-mastery-title">Champion Mastery</div>'+
        '<div id="summoner-mastery-detail"></div>'+
      '</div>'+
      '<div id="game-stat">'+
      '</div>'+
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
      '<div class="rank-color">'+rank.replace('_',' ')+'</div>'+
      //'<div>'+playerInfo.isHotStreak+'</div>' +
      '<div>Points: '+playerInfo.leaguePoints+'</div>' +
      '<div class="bold">'+playerInfo.wins+'W/'+playerInfo.losses+'L</div>' +
      '<div>Win Rate: '+Math.floor(winRate)+'%</div>';

    /*if(playerInfo.miniSeries){
      //this needs graphical representation
      summary += '<div>'+JSON.stringify(playerInfo.miniSeries)+'</div>';
    }*/

    $('#tier-info').append(summary);
    $('#tier-icon').append('<div><img src="images/tier_icons/'+rank+'.png" style="width: 100px"></div>');
    $('#tier-league').append(leagueName);
  }

  function buildRankedStatsView(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions;
    var championPic = '';
    var championStats;
    var averageKill,averageDeath,averageAssists,averageCS;
    var totalSession;
    var winRate;

    data = data.sort(function(a,b){
      return b.stats.totalSessionsWon - a.stats.totalSessionsWon;
    });
    data = data.slice(1,11);


    //console.log(data);
    $.each(data,function(key,rankedStats){
      championStats = '';
      jQuery('<div/>',{
        id: rankedStats.id+'-info',
        class: 'ranked-stats-div'
      }).appendTo('#champion-summary');
      totalSession = Number(rankedStats.stats.totalSessionsPlayed);
      averageKill = Number(rankedStats.stats.totalChampionKills)/totalSession;
      averageDeath = Number(rankedStats.stats.totalDeathsPerSession)/totalSession;
      averageAssists = Number(rankedStats.stats.totalAssists)/totalSession;
      averageCS = Number(rankedStats.stats.totalMinionKills)/totalSession;
      winRate = Number(rankedStats.stats.totalSessionsWon)/totalSession*100;

      averageKill = +averageKill.toFixed(2);
      averageDeath = +averageDeath.toFixed(2);
      averageAssists = +averageAssists.toFixed(2);
      averageCS = +averageCS.toFixed(2);
      winRate = +winRate.toFixed(2);

      championStats += '<div class="ranked-stats-info">'+
      '<div class="bold">'+rankedStats.name+'</div>' +
      '<div>KDA:'+averageKill+'/'+averageDeath+'/'+averageAssists+'</div>' +
      '<div>Win Rate: '+winRate+'%</div>' +
      '<div>Total Played:'+rankedStats.stats.totalSessionsPlayed+'</div>'+
      '</div>';

      jQuery('<div/>',{
        id: rankedStats.id+'-image',
        class: 'ranked-stats-pic',
      }).appendTo('#'+rankedStats.id+'-info');

      $('#'+rankedStats.id+'-image').css(
        'background-image', 'url(http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+rankedStats.image+')'
      );

      $('#'+rankedStats.id+'-image').addClass("ranked-stats-pic-style");

      $('#'+rankedStats.id+'-info').append(championStats);
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
    console.log(data);

    $.each(data,function(index,champion){
      championMasteryDetail = '';
      championMasteryImg = '';
      jQuery('<div/>',{
        id: 'champion-mastery'+champion.championId,
        class: 'champion-mastery'
      }).appendTo('#summoner-mastery-detail');
      jQuery('<div/>',{
        id: 'champion-mastery-div-img'+champion.championId,
        class: 'champion-mastery-div-img'
      }).appendTo('#champion-mastery'+champion.championId);
      jQuery('<div/>',{
        id: 'champion-mastery-info'+champion.championId,
        class: 'champion-mastery-info'
      }).appendTo('#champion-mastery'+champion.championId);

      championMasteryDetail += '' +
      '<div>'+champion.name+'</div>'+
      '<div>'+champion.championPoints+' points</div>';

      championMasteryImg += '<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+champion.image+'" class="champion-mastery-img">'+
                            '<img src="images/mastery_icons/Champ_Mastery_'+champion.championLevel+'.png" class="champion-mastery-icon">';

      $('#champion-mastery-info'+champion.championId).append(championMasteryDetail);
      $('#champion-mastery-div-img'+champion.championId).append(championMasteryImg);
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
    //console.log(data);
    //console.log(res);
    var view = '';
    var gameType = '';
    var gamePic = '';
    var gameInfo = '';
    var gameItems = '';
    var gameMembers = '';
    var teamColor;
    var date;
    var win;
    var gameDuration;
    var kill,death,assists;
    var fellowPlayerName;
    data.forEach(function(match){
      gameType = '';
      gamePic = '';
      gameInfo = '';
      gameItems = '';
      gameMembers = '';
      jQuery('<div/>',{
        id: 'game-id-'+match.gameId,
        class: 'game-id game'
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

      var img = '';
      for(var i=1; i<=2;i++){
        var spell = match['spellName'+i];
        //console.log(spell);
        $.each(summonerSpell,function(name,detail){
          if(detail.name == spell){
            img += '<img src=http://ddragon.leagueoflegends.com/cdn/6.22.1/img/spell/'+detail.image.full+' class="game-summoner-spell-pic">';
          }
        });
      }

      gameDuration = (match.stats.timePlayed/60).toFixed(2);

      kill = (match.stats.championsKilled)? match.stats.championsKilled:0;
      death = (match.stats.numDeaths)? match.stats.numDeaths:0;
      assists = (match.stats.assists)? match.stats.assists:0;

      gameType += ''+
      '<div>'+match.subType.replace('_',' ')+'</div>'+
      '<div>'+match.ipEarned+' ip earned</div>'+
      '<div>'+teamColor+' team</div>'+winGame(match.stats.win)+
      '<div>'+date+' days ago</div>';
      gamePic += '' +
      '<div class="game-champion-pic-div"><img src=http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+match.image+' class="game-champion-pic"></div>'+
      '<div class="game-champion-name-div">'+match.championName+'</div>'+
      '<div class="game-summoner-spell-div">'+img+'</div>';
      gameInfo += '' +
      '<div>KDA: '+kill+'/'+death+'/'+assists+'</div>'+
      '<div>'+gameDuration+' minutes</div>'+
      '<div>'+match.stats.minionsKilled+' CS</div>'+
      '<div>'+match.stats.wardPlaced+' wards placed</div>'+
      '<div>level '+match.stats.level+'</div>';

      for(i=0; i<=6; i++){
        if(match.stats['itemImage'+i] && match.stats['itemImage'+i] != '2043.png'){
          gameItems += '<div class="game-items-img-div"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/item/'+match.stats['itemImage'+i]+'" class="game-items-img" id="game-items-img'+match.stats['item'+i]+match.gameId+'">'+
          '<div id="itemDesDiv'+match.stats['item'+i]+match.gameId+'" class="itemDesDiv"></div></div>';
        }
        //console.log(i);
      }

      jQuery('<div/>',{
        id: 'purple-'+match.gameId,
        class: 'fellow-players'
      }).appendTo('#game-members-'+match.gameId);

      jQuery('<div/>',{
        id: 'blue-'+match.gameId,
        class: 'fellow-players'
      }).appendTo('#game-members-'+match.gameId);
      var yourNameAbbre = summonerBase.search.substring(0,6)+'.....';
      var yourChamp = '<div class="player-div"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+match.image+'" class="player-img">  '+yourNameAbbre+'</div>';

        if(match.teamId == 100){
            $('#blue-'+match.gameId).append(yourChamp);
        }
        else{
          $('#purple-'+match.gameId).append(yourChamp);
        }

      $.each(match.fellowPlayers,function(index,player){
        fellowPlayerName = player.summonerName.substring(0,6)+'.....';
        gameMembers = '<div class="player-div"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+player.image+'" class="player-img">  '+fellowPlayerName+'</div>';
        //console.log(gameMembers);
        if(player.teamColor == 'blue'){
          $('#blue-'+match.gameId).append(gameMembers);
        }
        else{
          $('#purple-'+match.gameId).append(gameMembers);
        }
      });




      $('#game-type-'+match.gameId).append(gameType);
      $('#game-pic-'+match.gameId).append(gamePic);
      $('#game-info-'+match.gameId).append(gameInfo);
      $('#game-items-'+match.gameId).append(gameItems);
    });
  }

  function winGame(data){
    var view = '';
    if(data){
      return '<div class="victory">Victory</div>';
    }
    else{
      return '<div class="defeat">Defeat</div>';
    }
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
