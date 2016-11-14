(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};

  var leagueList = {
    rank1 : '',
    rank2 : '',
    rank3 : '',
    rank4 : '',
    rank5 : ''
  }

  function bindEvent() {
    $('.summoner-rank').click(function(){
      var rank = $(this).attr('id').replace('-button','');
      $('#league-list-detail').empty();
      $('#league-list-detail').append(leagueList[rank]);
    });
  }

  function buildLeagueView(){
    var view = '';
    view += '' +
      '<div id="summoner-info">'+
        '<div id="search-league">'+
          '<div id="league-icon">'+
            '<div id="tier-icon"></div>'+
            '<div id="tier-info"></div>'+
          '</div>'+
          '<div id="league-menu">'+
            '<div id="league-league-name"></div>'+
            '<div>'+
              /*'<button type="button" class="btn btn-primary summoner-rank" id="rank1-button">I</button>'+
              '<button type="button" class="btn btn-primary summoner-rank" id="rank2-button">II</button>'+
              '<button type="button" class="btn btn-primary summoner-rank" id="rank3-button">III</button>'+
              '<button type="button" class="btn btn-primary summoner-rank" id="rank4-button">IV</button>'+
              '<button type="button" class="btn btn-primary summoner-rank" id="rank5-button">V</button>'+*/
              '<ul id="summoner-rank-list">'+
                '<li class="summoner-rank" id="rank1-button">I</li>'+
                '<li class="summoner-rank" id="rank2-button">II</li>'+
                '<li class="summoner-rank" id="rank3-button">III</li>'+
                '<li class="summoner-rank" id="rank4-button">IV</li>'+
                '<li class="summoner-rank" id="rank5-button">V</li>'+
              '</ul>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div id="league-list">'+
          '<div id="league-list-names">'+
            '<ul class="league-column">'+
              '<li class="league-num league-stats">#</li>'+
              '<li class="league-summoner-name league-stats">Summoners</li>'+
              '<li class="league-emblems league-stats">Emblems</li>'+
              '<li class="league-game league-stats">Game Played</li>'+
              '<li class="league-promotion league-stats">Promotion series/Point</li>'+
            '</ul>'+
          '</div>'+
          '<div id="league-list-detail">'+
          '</div>'+
        '</div>'+
      '</div>';

    $('#summary-info').append(view);
  }

  function buildYourLeague(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
    console.log(data);
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
      '<div>'+rank.replace('_',' ')+'</div>'+
      //'<div>'+playerInfo.isHotStreak+'</div>' +
      '<div>Points: '+playerInfo.leaguePoints+'</div>' +
      '<div>'+playerInfo.wins+'W/'+playerInfo.losses+'L</div>' +
      '<div>Win Rate: '+Math.floor(winRate)+'%</div>';

    /*if(playerInfo.miniSeries){
      //this needs graphical representation
      summary += '<div>'+JSON.stringify(playerInfo.miniSeries)+'</div>';
    }*/

    $('#tier-info').append(summary);
    $('#tier-icon').append('<div><img src="images/tier_icons/'+rank+'.png" style="width: 100px"></div>');
    $('#league-league-name').append(leagueName);
  }

  function buildLeagueListView(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
    var array = {
      rank1 : [],
      rank2 : [],
      rank3 : [],
      rank4 : [],
      rank5 : []
    };
    //console.log(data);
    //console.log(data.entries);
    $.each(data,function(key,summoner){
      $.each(summoner.entries,function(key,otherSummoner){
        switch (otherSummoner.division) {
          case 'I':
            array.rank1.push(otherSummoner);
          break;
          case 'II':
            array.rank2.push(otherSummoner);
          break;
          case 'III':
            array.rank3.push(otherSummoner);
          break;
          case 'IV':
            array.rank4.push(otherSummoner);
          break;
          default:
            array.rank5.push(otherSummoner);
        }
      });
    });

    for(var i=1;i<=5;i++){
      array['rank'+i].sort(function(a, b) {
        return b.leaguePoints - a.leaguePoints;
      });
      var num = 1;
      array['rank'+i].forEach(function(summoner){
        leagueList['rank'+i] += '<ul class="league-column">'+
        '<li class="league-num league-stats">'+num+'</div>'+
        '<li class="league-summoner-name league-stats">'+summoner.playerOrTeamName+'</li>'+
        '<li class="league-emblems league-stats">'+emblems(summoner)+'</li>'+
        '<li class="league-game league-stats">'+summoner.wins+'W/'+summoner.losses+'L</li>'+
        '<li class="league-promotion league-stats">'+miniSeries(summoner)+'</li>'+
        '</ul>';
        num++;
      });
    }
    $('#league-list-detail').append(leagueList.rank1);
    console.log(array.rank5);
  }

  function emblems(summoner){
    var view = '';
    if(summoner.isFreshBlood){
      view += '<img src="images/league_icons/isFreshBlood.png" class="league-icon">';
    }
    if(summoner.isHotStreak){
      view += '<img src="images/league_icons/isHotStreak.png" class="league-icon">';
    }
    if(summoner.isInactive){
      view += '<img src="images/league_icons/isInactive.png" class="league-icon">';
    }
    if(summoner.isVeteran){
      view += '<img src="images/league_icons/isVeteran.png" class="league-icon">';
    }
    return view;
  }

  function miniSeries(summoner){
    var view = '';
    var unattempted;
    if(summoner.leaguePoints == 100){
      unattempted = summoner.miniSeries.progress.length - summoner.miniSeries.losses - summoner.miniSeries.wins;
      console.log(unattempted);
      if(summoner.miniSeries.wins>0){
          for(var i=0; i<summoner.miniSeries.wins; i++){
          view += '<div class="miniseries-win miniseries">W</div>'
        }
      }
      if(summoner.miniSeries.losses>0){
          for(var i=0; i<summoner.miniSeries.losses; i++){
          view += '<div class="miniseries-losses miniseries">L</div>'
        }
      }
      for(var i=0; i<unattempted; i++){
      view += '<div class="miniseries-neutral miniseries">N</div>'
    }
    return view;
  }
    else{
      return summoner.leaguePoints;
    }
  }

  summonerBase.registerEvent('league',function(data){
    //console.log('build summoner league view');
    buildLeagueView();
    buildLeagueListView();
    buildYourLeague();
    bindEvent();
  });

  return summonerBase;
}))
