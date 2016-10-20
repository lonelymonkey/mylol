(function(factory){
  window.lolHistoryUI = factory({});
}(function(lolHistoryUI){
  var dataAPI ;
  var config;
  var dataModel = {
    matchList : [],
    matchDetail : []
  };

  saveConfig  = function(cfg){
    config = $.extend({},cfg);
  }
  function buildUIFrame () {
    $('#'+config.containerId).html(
      '<div id="data-body"></div>'
    );
  };
  function buildMatchListView(data) {
    var view = '';
    data.forEach(function(match){
      var statusView = (match.stats.win) ? 'YAY' : 'SUCKER' ;
      view += ''+
              '<div><h3>'+statusView+'</h3></div>'+
              '<div>'+match.championName+match.spellName1+match.spellName2+'</div>' +
              '<div>'+match.stats.itemName0+'</div>' +
              '<div>'+match.stats.itemName1+'</div>' +
              '<div>'+match.stats.itemName2+'</div>' +
              '<div>'+match.stats.itemName3+'</div>' +
              '<div>'+match.stats.itemName4+'</div>' +
              '<div>'+match.stats.itemName5+'</div>' +
              '<div>'+match.stats.itemName6+'</div>' +
              '<div>'+JSON.stringify(match.fellowPlayers)+'</div>'+
              '';
    });
    return view;
  }
  buildView = function(){
    var view = '';

    var data = dataModel.matchList.slice(0,5);

    view = buildMatchListView(data);

    $('#data-body').html(view);
  };
  lolHistoryUI.load = function(cfg){
    console.log('init from lolHistoryUI');
    saveConfig(cfg);

    dataAPI = lolHistoryData(cfg);
    console.log(dataAPI);
    buildUIFrame();

    dataAPI.matchList('epiccookierawr',function(res){
      dataModel.matchList = res.matchList.games;
      console.log(res);
      buildView();
          });
          /*
      dataAPI.matchDetail('2321498409',function(res){
        dataModel.matchDetail = res;
        console.log(res);
        buildView();
      });*/


  };
  return lolHistoryUI;
}))
