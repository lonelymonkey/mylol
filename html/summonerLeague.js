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
      $('#league-list').empty();
      $('#league-list').append(leagueList[rank]);
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
          '<ul class="league-column">'+
            '<li class="league-stats">Summoners</li>'+
            '<li class="league-stats">Emblems</li>'+
            '<li class="league-stats">Victory</li>'+
            '<li class="league-stats">Promotion series/Point</li>'+
          '</ul>'+
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

    if(playerInfo.miniSeries){
      //this needs graphical representation
      summary += '<div>'+JSON.stringify(playerInfo.miniSeries)+'</div>';
    }

    $('#tier-info').append(summary);
    $('#tier-icon').append('<div><img src="images/tier_icons/'+rank+'.png" style="width: 100px"></div>');
    $('#league-league-name').append(leagueName);
  }

  function buildLeagueListView(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
    //console.log(data);
    //console.log(data.entries);

    $.each(data,function(key,summoner){
      $.each(summoner.entries,function(key,otherSummoner){
        if(otherSummoner.division == 'I'){
          leagueList.rank1 += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'II'){
          leagueList.rank2 += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'III'){
          leagueList.rank3 += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'IV'){
          leagueList.rank4 += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }
        else if(otherSummoner.division == 'V'){
          leagueList.rank5 += '<ul class="league-column">'+
          '<li class="league-stats">'+otherSummoner.division+'</li>' +
          '<li class="league-stats">'+otherSummoner.leaguePoints+'</li>' +
          '<li class="league-stats">'+otherSummoner.playerOrTeamName+'</li>' +
          '<li class="league-stats">'+otherSummoner.wins+'</li>' +
          '<li class="league-stats">'+otherSummoner.losses+'</li>' +
          '</ul>';
        }

      });
    });
    //console.log(leagueList);
    //$('#league-icon').append(generalInfo);
    $('#league-list').append(leagueList.rank2);

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
