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
            '<div id="ferocity" class="group">'+
            '</div>'+
            '<div id="cunning" class="group"></div>'+
            '<div id="resolve" class="group"></div>'+
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
    console.log(res);
    var onMasteries = [];
    var cunning = [6311,6312,6321,6322,6323,6331,6332,6341,6342,6351,6352,6361,6362,6363];
    var ferocity = [6111,6114,6121,6122,6123,6131,6134,6141,6142,6151,6154,6161,6162,6164];
    var resolve =  [6211,6212,6221,6223,6231,6232,6241,6242,6251,6252,6261,6262,6263];
    var ferocityAndCunningRows = [1,3,1,2,1,3];
    var resolveRows = [1,2,1,2,1,3];
    $.each(data.masteries,function(key,mastery){
      onMasteries.push(mastery.id);
    });
    console.log(onMasteries);
    constructGroup(ferocity,'ferocity',ferocityAndCunningRows);
    constructGroup(cunning,'cunning',ferocityAndCunningRows);
    constructGroup(resolve,'resolve',resolveRows);
    onMasteries.forEach(function(mastery){
      var image = document.getElementById(mastery);
      if(image){
        $('#'+mastery).append('<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/mastery/'+mastery+'.png">');
      }
    });
  }

  function constructGroup(list,groupName,rowOrder){
    var row = 1;
    var view = '';
    /*$.each(group,function(rowIndex,row){
      $.each(row,function(masteryIndex,mastery){
        list.push(mastery.masteryId);
      });
    });*/
    rowOrder.forEach(function(type){
      if(type == 1){
        view += '' +
        '<div class="row-type-1">'+
          '<div id='+list.shift()+' class="type-1-1 row'+row+'">'+
          '<div class="rank">1/5</div>'+
          '</div>'+
          '<div id='+list.shift()+' class="type-1-3 row'+row+'"></div>'+
        '</div>';
      }
      else if (type == 2) {
        view += '' +
        '<div class="row-type-2">'+
          '<div id='+list.shift()+' class="type-2-1 row'+row+'"></div>'+
          '<div id='+list.shift()+' class="type-2-2 row'+row+'"></div>'+
        '</div>';
      }
      else if(type == 3){
        view += '' +
        '<div class="row-type-3">'+
          '<div id='+list.shift()+' class="type-3-1 row'+row+'"></div>'+
          '<div id='+list.shift()+' class="type-3-2 row'+row+'"></div>'+
          '<div id='+list.shift()+' class="type-3-3 row'+row+'"></div>'+
        '</div>';
      }
      row++;
    });

    $('#'+groupName).append(view);
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
