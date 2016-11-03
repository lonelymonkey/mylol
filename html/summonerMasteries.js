(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};

  function bindEvent() {
  }

  function buildMasteriesView(){
    console.log('buildMasteriesView');
    var view = '';
    view += '' +
      '<div id="masteries-list">'+
      '</div>'+
      '<div id="masteries-detail">'+
        '<div id="masteries-img">'+
        '</div>'+
      '</div>';
      console.log(view);

    $('#summary-info').append(view);
  }

  function buildMasteriesList(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.masteries.summonerMasteries[id]['pages'];
    console.log(data);
    var list = '<ul class="nav nav-pills">';
    var detail = '';

    $.each(data,function(key, masteriesPage){
      console.log(masteriesPage);
      list += '<li><a>'+masteriesPage.name+'</a></li>';
      $.each(masteriesPage.masteries,function(key,mastery){
        detail += '<div>'+mastery.masteryName+mastery.rank+'</div>';
      });
    });

    list += '</ul>';
    $('#masteries-list').append(list);
    //$('#masteries-detail').append(detail);
  }

  function buildMasteriesDetail(data){
    //console.log(data);
  }

  function buildMasteriesImage(data){
    var view = '';
    console.log(data);
    jQuery('<img/>', {
      id: 'masteryPage',
      src: 'images/masteries/masterySlots.PNG'
    }).appendTo('#masteries-img');
    $.each(data.masteries,function(key,mastery){
      jQuery('<img>',{
        src: 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/mastery/'+mastery.id+'.png'
      }).appendTo('#masteries-img');
    });
  }

  summonerBase.registerEvent('masteries',function(data){
    console.log('build summoner runes view');
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var firstPage = dataModel.masteries.summonerMasteries[id]['pages'][0];
    buildMasteriesView();
    buildMasteriesList();
    buildMasteriesDetail(firstPage);
    buildMasteriesImage(firstPage);
    bindEvent();
  });

  return summonerBase;
}))
