(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};
  var hoverTimer;

  function bindEvent() {
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.masteries.summonerMasteries[id]['pages'];
    $(".rune-page").click(function(){
      //console.log($(this).html());
      var selectedPage = {};
      var selectedName = $(this).html();
      $("#ferocity").empty();
      $("#cunning").empty();
      $("#resolve").empty();
      $.each(data,function(key,mastery){
        //console.log(mastery.name);
        if(mastery.name == selectedName){
          selectedPage = mastery;
        }
      });
      //console.log(selectedPage);
      masteryDetail(selectedPage);
      buildMasteriesImage(selectedPage);
    });
  }

  function buildMasteriesView(){
    //console.log('buildMasteriesView');
    var view = '';
    view += '' +
      '<div id="masteries-list">'+
      '</div>'+
      '<div id="masteries-detail">'+
        '<div id="masteries-img">'+
            '<img src="images/masteries/masterySlots.PNG" style="position:absolute">'+
            '<div id="ferocity" class="group">'+
            '</div>'+
            '<div id="cunning" class="group"></div>'+
            '<div id="resolve" class="group"></div>'+
        '</div>'+
      '</div>';
      //console.log(view);

    $('#summary-info').append(view);
  }

  function buildMasteriesList(){
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.masteries.summonerMasteries[id]['pages'];
    //console.log(data);
    var list = '<ul class="nav nav-pills">';
    var detail = '';

    $.each(data,function(key, masteriesPage){
      //console.log(masteriesPage);
      list += '<li><a class="rune-page">'+masteriesPage.name+'</a></li>';
    });

    list += '</ul>';
    $('#masteries-list').append(list);
    //$('#masteries-detail').append(detail);
  }

  function masteryDetail(){
    //console.log(data);
    $('.img').each(function(){
      var masteryId = $(this).attr('id').replace('img','');
      //console.log(masteryId);
      $(this).hover(function(){
        hoverTimer = setTimeout(function(){
          //console.log(masteryId);
          $('#rank-detail'+masteryId).css({'visibility':'visible'})
        }, 500);
      },function(){
        clearTimeout(hoverTimer);
        $('#rank-detail'+masteryId).css({'visibility':'hidden'})
      });
    });
  }

  function buildMasteriesImage(data){
    $.ajax({
        'dataType': "json",
        'url': 'staticData/mastery.json',
        'data': data,
        'success': function(res){
          masteryImagePlacement(data,res);
          masteryDetail();
        }
        });
  }

  function masteryImagePlacement(data,res){
    //console.log(res);
    var onMasteries = {};
    var cunning = [6311,6312,6321,6322,6323,6331,6332,6341,6342,6351,6352,6361,6362,6363];
    var ferocity = [6111,6114,6121,6122,6123,6131,6134,6141,6142,6151,6154,6161,6162,6164];
    var resolve =  [6211,6212,6221,6223,6231,6232,6241,6242,6251,6252,6261,6262,6263];
    var cunningTotal = 0;
    var ferocityTotal = 0;
    var resolveTotal = 0;
    var ferocityAndCunningRows = [1,3,1,2,1,3];
    var resolveRows = [1,2,1,2,1,3];
    $.each(data.masteries,function(key,mastery){
      //console.log(mastery);
      onMasteries[mastery.id] = mastery.rank;
    });
    //console.log(onMasteries);
    constructGroup(ferocity,'ferocity',ferocityAndCunningRows);
    constructGroup(cunning,'cunning',ferocityAndCunningRows);
    constructGroup(resolve,'resolve',resolveRows);
    $.each(onMasteries,function(mastery,rank){
      var image = document.getElementById(mastery);
      var row = mastery.toString().substr(2,1);
      var group = mastery.toString().substr(0,2);

      switch(group){
        case '61':
          ferocityTotal += rank;
          break;
        case '63':
          cunningTotal += rank;
          break;
        default:
          resolveTotal += rank;
      }

      if(image){
        $('#'+mastery).append('<img src="http://ddragon.leagueoflegends.com/cdn/6.22.1/img/mastery/'+mastery+'.png" id="img'+mastery+'" class="img">');
        switch (row) {
          case '1':
          case '3':
          case '5':
            $('#'+mastery).append('<div class="rank'+row+'">'+rank+'/5</div>');

            break;
          default:
          $('#img'+mastery).css({
            border: 'solid orange 1px'
          });
        }
        $('#'+mastery).append('<div id="rank-detail'+mastery+'" class="rank-detail">'+res.data[mastery].name+'</br></br>'+res.data[mastery].description[rank-1]+'</div>');
      }
    });

      $('#total-count-ferocity').append(ferocityTotal);
      $('#total-count-cunning').append(cunningTotal);
      $('#total-count-resolve').append(resolveTotal);
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
          '<div id='+list.shift()+' class="type-1-1 row'+row+' rune">'+
          '</div>'+
          '<div id='+list.shift()+' class="type-1-3 row'+row+' rune"></div>'+
        '</div>';
      }
      else if (type == 2) {
        view += '' +
        '<div class="row-type-2">'+
          '<div id='+list.shift()+' class="type-2-1 row'+row+' rune"></div>'+
          '<div id='+list.shift()+' class="type-2-2 row'+row+' rune"></div>'+
        '</div>';
      }
      else if(type == 3){
        view += '' +
        '<div class="row-type-3">'+
          '<div id='+list.shift()+' class="type-3-1 row'+row+' rune"></div>'+
          '<div id='+list.shift()+' class="type-3-2 row'+row+' rune"></div>'+
          '<div id='+list.shift()+' class="type-3-3 row'+row+' rune"></div>'+
        '</div>';
      }
      row++;
    });
    view += '<div id="total-count-'+groupName+'" class="total-count"></div>';

    $('#'+groupName).append(view);
  }

  summonerBase.registerEvent('masteries',function(data){
    //console.log('build summoner runes view');
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var firstPage = dataModel.masteries.summonerMasteries[id]['pages'][0];
    buildMasteriesView();
    buildMasteriesList();
    //buildMasteriesDetail(firstPage);
    buildMasteriesImage(firstPage);
    bindEvent();
  });

  return summonerBase;
}))
