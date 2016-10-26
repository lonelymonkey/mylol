(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;

  function buildSummonerView() {
    //check if dataModel changed?
    //if unchanged return
    console.log(dataModel);
    
  }

  summonerBase.registerEvent('onLoad',function(data){
    console.log('build Summoner Summary view');
    buildSummonerView();
  });
  //summonerBase.registerEvent('onLoad',buildView);
  /*
  summonerBase.buildView = function(data){
    var data = data;
    console.log(data);
  }*/

  return summonerBase;
}))
