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
    $('.rank').click(function(){
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
          '</div>'+
          '<div id="league-menu">'+
            '<div class="btn-group">'+
              '<button type="button" class="btn btn-primary rank" id="rank1-button">I</button>'+
              '<button type="button" class="btn btn-primary rank" id="rank2-button">II</button>'+
              '<button type="button" class="btn btn-primary rank" id="rank3-button">III</button>'+
              '<button type="button" class="btn btn-primary rank" id="rank4-button">IV</button>'+
              '<button type="button" class="btn btn-primary rank" id="rank5-button">V</button>'+
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

  function buildLeagueListView(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.summonerSummary.league.summonerLeague[id];
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
    console.log(leagueList);
    $('#league-icon').append(generalInfo);
    $('#league-list').append(leagueList.rank2);

  }

  summonerBase.registerEvent('league',function(data){
    console.log('build summoner league view');
    buildLeagueView();
    buildLeagueListView();
    bindEvent();
  });

  return summonerBase;
}))
