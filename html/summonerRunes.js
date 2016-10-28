(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};

  function bindEvent() {
  }

  function buildRunesView(){
    console.log('buildRunesView');
    var view = '';
    view += '' +
      '<div id="runes-list">'+
      '</div>'+
      '<div id="runes-detail">'+
      '</div>';
      console.log(view);

    $('#summary-info').append(view);
  }

  function buildRunesList(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    console.log(dataModel);
    var data = dataModel.runes.summonerRunes[id]['pages'];
    var list = '<ul class="list-group">';
    var detail = '';
    var sum = [];

  //  console.log(data);
    $.each(data,function(key, runePage){
      list += '<li class="list-group-item">'+runePage.name+'</li>';
      $.each(runePage.slots,function(key,rune){
        detail += '<div>'+rune.runeName+'</div>';
      });
    });
    list += '</ul>';

    $('#runes-list').append(list);
    $('#runes-detail').append(detail);
  }

  summonerBase.registerEvent('runes',function(data){
    console.log('build summoner runes view');
    buildRunesView();
    buildRunesList();
    bindEvent();
  });

  return summonerBase;
}))
