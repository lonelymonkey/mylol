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
      '</div>';
      console.log(view);

    $('#summary-info').append(view);
  }

  function buildMasteriesList(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.masteries.summonerMasteries[id]['pages'];
    console.log(data);
    var list = '';
    var detail = '';

    $.each(data,function(key, masteriesPage){
      //console.log(masteriesPage);
      list += '<div>'+masteriesPage.name+'</div>';
      $.each(masteriesPage.masteries,function(key,mastery){
        detail += '<div>'+mastery.masteryName+mastery.rank+'</div>';
      });
    });


    $('#masteries-list').append(list);
    $('#masteries-detail').append(detail);
  }

  summonerBase.registerEvent('masteries',function(data){
    console.log('build summoner runes view');
    buildMasteriesView();
    buildMasteriesList();
    bindEvent();
  });

  return summonerBase;
}))
