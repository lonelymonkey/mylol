(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  const MAXGAME = 10;
  var config = {};

  function bindEvent() {

    $('.game-detail-button').each(function(){
      var gameId = $(this).attr('id').replace($(this).attr('class'),'');
      console.log(gameId);
      $('#game-detail-button'+gameId).click(function(){
        $('#game-detail-won-'+gameId).empty();
        $('#game-detail-loss-'+gameId).empty();
        matchDetail(gameId);
      });
      $('#game-detail-erase'+gameId).click(function(){
        $('#game-detail-won-'+gameId).empty();
        $('#game-detail-loss-'+gameId).empty();
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
    '<div id="recent-summoner">'+
      '<div id="recent-summoner-title">Recently Played With (Recent 10 Games)</div>'+
      '<div id="recent-summoner-detail">'+
        '<div id="recent-summoner-detail-title"></div>'+
        '<div id="recent-summoner-detail-row"></div>'+
      '</div>'+
    '</div>'+
    '<div id="champion-summary">'+
    '</div>'+
    '<div id="summoner-summary">'+
    '<div id="summoner-summary-title">Summoner Summary</div>'+
    '<div>'+
        '<div id="recent-winrate-div">'+
          '<canvas id="recent-winrate" width="100px" height="100px"></canvas>'+
          '<div id="recent-winrate-title">Recent Winrate</div>'+
        '</div>'+
        '<div id="recent-kda-div">'+
          '<canvas id="recent-kda" width="100px" height="100px"></canvas>'+
          '<div id="recent-kda-title">Recent KDA</div>'+
        '</div>'+
        '<div id="champion-winrate-div">'+
          '<canvas id="champion-winrate" width="100px" height="100px"></canvas>'+
          '<div id="champion-winrate-title">Champion Winrate</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div id="game-stat">'+
    '</div>';

    $('#summary-info').append(view);
  }

  function buildPlayerView(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.matchList.matchList.games;
    var players = {};
    var win = {};
    var loss = {};
    var playersArray = [];
    var displayData;
    var view = '';
    var title = '';
    console.log(data);
    data.forEach(function(game){
      var outcome = game.stats.win;
      var side = game.teamId;
      $.each(game.fellowPlayers,function(playerIndex,player){
        if(player.teamId == side){
          if(player.summonerName in players){
            players[player.summonerName] += 1;
            if(outcome){
              win[player.summonerName] += 1;
            }
            else{
              loss[player.summonerName] += 1;
            }
          }
          else{
            players[player.summonerName] = 1;
            if(outcome){
              win[player.summonerName] = 1;
              loss[player.summonerName] = 0;
            }
            else{
              loss[player.summonerName] = 1;
              win[player.summonerName] = 0;
            }
          }
        }
    });
  });
  for(var summoners in players){
    playersArray.push([summoners,players[summoners],win[summoners],loss[summoners]]);
  }
  playersArray.sort(function(a,b){
    return b[1]-a[1];
  });

  displayData = playersArray.slice(0,5);
  console.log(displayData);
  title += '<ul class="recent-data">' +
  '<li class="recent-name">Summoner</li>'+
  '<li class="recent-num">Played</li>'+
  '<li class="recent-num">Win</li>'+
  '<li class="recent-num">Loss</li>'+
  '</ul>';
  displayData.forEach(function(data){
    view += '<ul class="recent-data">' +
    '<li class="recent-name">'+data[0]+'</li>'+
    '<li class="recent-num">'+data[1]+'</li>'+
    '<li class="recent-num">'+data[2]+'</li>'+
    '<li class="recent-num">'+data[3]+'</li>'+
    '</ul>';
  });

  $('#recent-summoner-detail-row').append(view);
  $('#recent-summoner-detail-title').append(title);
}

  function buildRankedStatsView(){
    var data = dataModel.summonerSummary.rankedStats.rankedStats.champions.slice(1,11);
    var championPic = '';
    var championStats;
    var averageKill,averageDeath,averageAssists,averageCS;
    var totalSession;

    console.log(data);
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
    var championData = dataModel.summonerSummary.rankedStats.rankedStats.champions;
    var total = {
      kill : 0,
      death : 0,
      assist : 0,
      win : 0,
      loss : 0
    };
    console.log(championData);
    var view = '';
    var ctxKDA = document.getElementById('recent-kda');
    var ctxWinRate = document.getElementById('recent-winrate');
    var ctxChampion = document.getElementById('champion-winrate');
    var dataBar = {
    labels: ["Kill", "Death", "Assists"],
    datasets: [
        {
            label: "KDA",
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
            data: [],
        }
    ]
  };
      var dataDoughnut = {
        labels: [
            "Loss",
            "Win",
        ],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB"
                ]
            }]
      };

      var radarData = {
            labels: [],
            datasets: [
                {
                    label: "Champions Stats",
                    backgroundColor: "rgba(179,181,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: []
                }
            ]
        };


    championData = championData.sort(function(a,b){
      return b.stats.totalSessionsWon - a.stats.totalSessionsWon;
    });
    championData = championData.slice(1,11);


    $.each(data,function(key,game){
      if(game.stats.assists == null){
        total.assist += 0;
      }
      else{
        total.assist += game.stats.assists;
      }

      if(game.stats.numDeaths == null){
        total.death += 0;
      }
      else{
        total.death += game.stats.numDeaths;
      }

      if(game.stats.championsKilled == null){
        total.kill += 0;
      }
      else{
        total.kill += game.stats.championsKilled;
      }

      if(game.stats.win == true){
        total.win += 1;
      }
      else{
        total.loss += 1;
      }
    });
    dataBar.datasets[0].data.push(total.kill/MAXGAME);
    dataBar.datasets[0].data.push(total.death/MAXGAME);
    dataBar.datasets[0].data.push(total.assist/MAXGAME);
    //console.log(total);
    dataDoughnut.datasets[0].data.push(total.loss);
    dataDoughnut.datasets[0].data.push(total.win);

    championData.forEach(function(champion){
      radarData.labels.push(champion.name);
      radarData.datasets[0].data.push((champion.stats.totalSessionsWon/champion.stats.totalSessionsPlayed).toFixed(2)*100);
    });

    var myDoughnutChart = new Chart(ctxWinRate, {
      type: 'doughnut',
      data: dataDoughnut,
      options: {legend: {
          display: false
       }}
    });
    var myBarChart = new Chart(ctxKDA, {
      type: 'bar',
      data: dataBar,
      options: {legend: {
          display: false
       }}
    });
    var myRadarChart = new Chart(ctxChampion, {
    type: 'radar',
    data: radarData,
    options: {legend: {
        display: false
     }}
    });


    /*view = ''+
    '<div>'+total.Kill/MAXGAME+'</div>' +
    '<div>'+total.Death/MAXGAME+'</div>' +
    '<div>'+total.Assist/MAXGAME+'</div>' +
    '<div>'+total.win+'</div>' +
    '<div>'+total.loss+'</div>';
    $('#summoner-summary').append(view);*/
  }

  function loadAllMatchListData(){
    $.ajax({
        'dataType': 'json',
        'url': 'staticData/summoner.json',
        'data': {},
        'success': function(res){
          buildMatchListView(res);
          bindEvent();
        }
    });
  }

  function buildMatchListView(res) {
    var data = dataModel.summonerSummary.matchList.matchList.games;
    var summonerSpell = res.data;
    console.log(data);
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
        id: 'game-'+match.gameId,
        class: 'game'
      }).appendTo('#game-stat');

      jQuery('<div/>',{
        id: 'game-id-'+match.gameId,
        class: 'game-id'
      }).appendTo('#game-'+match.gameId);

      jQuery('<div/>',{
        id: 'game-detail-'+match.gameId,
        class: 'game-detail'
      }).appendTo('#game-'+match.gameId);

      jQuery('<div/>',{
        id:'game-detail-won-'+match.gameId,
        class: 'game-detail-won'
      }).appendTo('#game-detail-'+match.gameId);

      jQuery('<div/>',{
        id:'game-detail-loss-'+match.gameId,
        class: 'game-detail-loss'
      }).appendTo('#game-detail-'+match.gameId);

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
      jQuery('<div/>',{
        id: 'game-detail-button'+match.gameId,
        class: 'game-detail-button'
      }).appendTo('#game-id-'+match.gameId);
      jQuery('<div/>',{
        id: 'game-detail-erase'+match.gameId,
        class: 'game-detail-erase'
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
      $('#game-detail-button'+match.gameId).append('+');
      $('#game-detail-erase'+match.gameId).append('^');
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

  function matchDetail(gameId){
    //console.log('matchDetail is clicked');
    //console.log(matchId);
    var dataAPI = lolHistoryData(config);
    dataAPI.matchDetail(gameId,function(res){
      //console.log(res);
      matchDetailDiv(res);
  });
}

  function matchDetailDiv(data){
    var participantIdentities = data.matchDetail.participantIdentities;
    var participants = data.matchDetail.participants;
    var matchId = data.matchDetail.matchId;
    var view = '';
    for(var i=0; i<10; i++){
      view = '';
      view += '<ul class="match-detail-row">'+
      '<li><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/champion/'+participants[i].image+'" class="match-detail-row-champ-img"><div class="match-detail-row-champ-level">'+participants[i].stats.champLevel+'</div></li>'+
      '<li class="match-detail-spell-div"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/spell/'+participants[i].spellImg1+'" class="match-detail-spell1 match-detail-img"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/spell/'+participants[i].spellImg2+'" class="match-detail-spell2 match-detail-img"><img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/spell/'+participants[i].spellImg2+'" class="match-detail-mastery match-detail-img"></li>'+
      '<li class="match-detail-name-div"><div class="match-detail-name">'+participantIdentities[i].player.summonerName.substr(0,10)+'...</div></li>'+
      '<li>'+
        '<ul class="match-detail-items">'+
          '<li></li>'+
          '<li>'+itemList(participants[i].stats.itemImage0)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage1)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage2)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage3)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage4)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage5)+'</li>'+
          '<li>'+itemList(participants[i].stats.itemImage6)+'</li>'+
        '</ul>'+
      '</li>'+
      '<li class="match-detail-num">'+participants[i].stats.kills+'/'+participants[i].stats.deaths+'/'+participants[i].stats.assists+'</li>'+
      '<li class="match-detail-num">'+participants[i].stats.totalDamageDealtToChampions+'</li>'+
      '<li class="match-detail-num">'+participants[i].stats.totalDamageTaken+'</li>'+
      '<li class="match-detail-num">'+participants[i].stats.wardsPlaced+participants[i].stats.wardsKilled+'</li>'+
      '<li class="match-detail-num">'+participants[i].stats.minionsKilled+'</li>'+
      '</ul>';
      if(participants[i].stats.winner){
        $('#game-detail-won-'+matchId).append(view);
      }
      else{
        $('#game-detail-loss-'+matchId).append(view);
      }
    }
  }

  function itemList(item){
    if(item){
      return '<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/item/'+item+'" class="match-detail-items-img">';
    }
    else{
      return '';
    }
  }


  summonerBase.registerEvent('matches',function(data){
    buildSummonerView();
    buildPlayerView();
    buildRankedStatsView();
    buildSummonerAverageView();
    loadAllMatchListData();
  });
  //summonerBase.registerEvent('onLoad',buildView);
  /*
  summonerBase.buildView = function(data){
    var data = data;
    console.log(data);
  }*/

  return summonerBase;
}))
