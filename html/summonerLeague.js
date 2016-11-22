(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};

  var leagueList = {
    rank1 : '',
    rank1Series : '',
    rank2 : '',
    rank2Series : '',
    rank3 : '',
    rank3Series : '',
    rank4 : '',
    rank4Series : '',
    rank5 : '',
    rank5Series : ''
  }

  function bindEvent() {
    $('.summoner-rank').click(function(){
      var rank = $(this).attr('id').replace('-button','');
      $('#league-series').empty();
      $('#league-points').empty();
      $('#league-series').append('<div id="league-series-title">Currently In Series</div>'+leagueList[rank+'Series']);
      $('#league-points').append(leagueList[rank]);
    });
  }

  function emblemsDetail(){
    var emblemTimer;
    //console.log(res);
    $('.emblemFinder').each(function(emblem){
      var identifier = $(this).attr('id');
      $(this).hover(function(){
        emblemTimer = setTimeout(function(){
          $('#'+identifier+'div').css('visibility','visible');
        },250);
      },function(){
        clearTimeout(emblemTimer);
        $('#'+identifier+'div').css('visibility','hidden');
      });
    });
  }

  function buildLeagueView(){
    var view = '';
    view += '' +
      '<div id="summoner-info">'+
        '<div id="search-league">'+
          '<div id="league-summary">'+
            '<div id="tier-icon"></div>'+
            '<div id="tier-info"></div>'+
          '</div>'+
          '<div id="league-menu">'+
            '<div id="league-league-name" class"bold"></div>'+
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
            '<div id="league-series">'+
              '<div id="league-series-title">Currently In Series</div>'+
            '</div>'+
            '<div id="league-points"></div>'+
          '</div>'+
        '</div>'+
      '</div>';

    $('#summary-info').append(view);
  }

  function buildYourLeague(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
  //  console.log(data);
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
    console.log(id);
    console.log(data);
    var array = {
      rank1 : [],
      rank2 : [],
      rank3 : [],
      rank4 : [],
      rank5 : []
    };
    var initialPage;
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
        if(otherSummoner.playerOrTeamId == id){
          switch (otherSummoner.division) {
            case 'I':
              initialPage = 'rank1';
            break;
            case 'II':
              initialPage = 'rank2';
            break;
            case 'III':
              initialPage = 'rank3';
            break;
            case 'IV':
              initialPage = 'rank4';
            break;
            default:
            initialPage = 'rank5';
          }
        }
      });
    });

    for(var i=1;i<=5;i++){
      array['rank'+i].sort(function(a, b) {
        return b.leaguePoints - a.leaguePoints;
      });
      var num = 1;
      array['rank'+i].forEach(function(summoner){
        if(summoner.leaguePoints != 100){
          leagueList['rank'+i] += '<ul id="league-column'+summoner.playerOrTeamId+'" class="league-column">'+
          '<li class="league-num league-stats">'+num+'</div>'+
          '<li class="league-summoner-name league-stats">'+summoner.playerOrTeamName+'</li>'+
          '<li class="league-emblems league-stats">'+emblems(summoner)+'</li>'+
          '<li class="league-game league-stats">'+summoner.wins+'W/'+summoner.losses+'L</li>'+
          '<li class="league-promotion league-stats">'+miniSeries(summoner)+'</li>'+
          '</ul>';
        }
        else{
          leagueList['rank'+i+'Series'] += '<ul id="league-column'+summoner.playerOrTeamId+'" class="league-column">'+
          '<li class="league-num league-stats">'+num+'</div>'+
          '<li class="league-summoner-name league-stats">'+summoner.playerOrTeamName+'</li>'+
          '<li class="league-emblems league-stats">'+emblems(summoner)+'</li>'+
          '<li class="league-game league-stats">'+summoner.wins+'W/'+summoner.losses+'L</li>'+
          '<li class="league-promotion league-stats">'+miniSeries(summoner)+'</li>'+
          '</ul>';
        }
        num++;
      });
    }
    $('#league-series').append(leagueList.rank1Series);
    $('#league-points').append(leagueList[initialPage]);
    $('#league-column'+id).css({'border':'solid yellow'})

    //console.log(array.rank5);
  }

  function emblems(summoner){
    //console.log(summoner);
    var view = '';
    if(summoner.isFreshBlood){
      view += '<div class="emblem-image"><img src="images/league_icons/isFreshBlood.png" id="isFreshBlood'+summoner.playerOrTeamId+'" class="isFreshBlood emblemFinder"><div id="isFreshBlood'+summoner.playerOrTeamId+'div" class="emblem-detail">Veteran</br>Played 100 or more games in this league</div></div>';
    }
    if(summoner.isHotStreak){
      view += '<div class="emblem-image"><img src="images/league_icons/isHotStreak.png" id="isHotStreak'+summoner.playerOrTeamId+'" class="isHotStreak emblemFinder"><div id="isHotStreak'+summoner.playerOrTeamId+'div" class="emblem-detail">Hot Streak</br>Won three or more games in a row</div></div>';
    }
    if(summoner.isInactive){
      view += '<div class="emblem-image"><img src="images/league_icons/isInactive.png" id="isInactive'+summoner.playerOrTeamId+'" class="isInactive emblemFinder"><div id="isInactive'+summoner.playerOrTeamId+'div" class="emblem-detail">Inactive user</div></div>';
    }
    if(summoner.isVeteran){
      view += '<div class="emblem-image"><img src="images/league_icons/isVeteran.png" id="isVeteran'+summoner.playerOrTeamId+'" class="isVeteran emblemFinder"><div id="isVeteran'+summoner.playerOrTeamId+'div" class="emblem-detail">Recruit</br>Recently joined this league</div></div>';
    }
    return view;
  }

  function miniSeries(summoner){
    var view = '';
    var unattempted;
    if(summoner.leaguePoints == 100){
      unattempted = summoner.miniSeries.progress.length - summoner.miniSeries.losses - summoner.miniSeries.wins;
      //console.log(unattempted);
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
    emblemsDetail();
  });

  return summonerBase;
}))
