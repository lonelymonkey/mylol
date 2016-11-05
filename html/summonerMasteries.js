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
          '<img src="http://ddragon.leagueoflegends.com/cdn/6.21.1/img/mastery/6121.png">';
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
    $.ajax({
        'dataType': "json",
        'url': 'staticData/mastery.json',
        'data': data,
        'success': function(res){
          masteryImagePlacement(data,res);
        }
        });
  }

  function masteryImagePlacement(data,res){
    var top = [20,102,186,268,352];
    var left = {
      '1' : [20,48,220],
      '2' : [102,48,136,220],
      '3' : [186,48,220],
      '4' : [268,95,174],
      '5' : [352,48,220]
    }
    var leftResolve = {
      '1' : [20,48,220],
      '2' : [102,95,174],
      '3' : [186,48,220],
      '4' : [268,95,174],
      '5' : [352,48,220]
    }
    var view = '';
    var onMasteries = [];
    var cunning = [];
    var ferocity = [];
    var resolve =  [];
    /*{
      first: [],
      second: [],
      third: [],
      fourth: [],
      fifth: [],
      sixth: []
    };*/
    //console.log(data);
    console.log(res);
    jQuery('<img/>', {
      id: 'masteryPage',
      src: 'images/masteries/masterySlots.PNG'
    }).appendTo('#masteries-img');
    $.each(data.masteries,function(key,mastery){
      /*jQuery('<img>',{
        src: 'http://ddragon.leagueoflegends.com/cdn/6.21.1/img/mastery/'+mastery.id+'.png'
      }).appendTo('#masteries-img');*/
      onMasteries.push(mastery.id);
      //console.log(onMasteries);
    });
    console.log(onMasteries);
    onMasteries.forEach(function(masteryId){
      var groupId = masteryId.toString().substr(0,2);
      var columnId = masteryId.toString().substr(3,1);
      var row = '';
      console.log(groupId);
      switch (groupId) {
        case '63':
          cunning.push(masteryId);
        break;
        case '61':
          ferocity.push(masteryId);
        break;
        default:
          resolve.push(masteryId);
      }
    });
    console.log(ferocity);
    ferocity.forEach(function(mastery){
      var rowId = mastery.toString().substr(2,1);
      var columnId = mastery.toString().substr(3,1);
          console.log(mastery+'top:'+left[rowId][0]+' left:'+left[rowId][columnId]);
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
