(function(factory){
  window.summonerBase = factory(window.summonerBase);
}(function(summonerBase){
  var dataModel = summonerBase.dataModel;
  var config = {};
  var allpages = [];

  function bindEvent() {
    var display = 'teemo';
    var runeId = '';
    $('.rune-page').click(function(){
      $('#runes-img').empty();
      $('#runes').empty();
      runeId = $(this).html();
      $.each(allpages,function(key,page){
        if(page.name == runeId){
          //buildRunesDetail(page.slots);
          buildRunesImage(page.slots);
        }
      });
    });
  }

  function buildRunesDetail(data){
    var runes = {};
    var detail = '<ul>';
    $.each(data,function(key,rune){
      if(!(rune.runeName in runes)){
        runes[rune.runeName] = 1;
      }
      else{
        runes[rune.runeName] += 1;
      }
    });
    console.log(runes);
    $.each(runes,function(key,sum){
      detail += '<li>'+key+sum+'</li>';
    });
    detail += '</ul>';
    console.log(detail);
    $('#runes').append(detail);
  }

  function buildRunesImage(data){
    var runePage = document.createElement("img");
    runePage.setAttribute('src','images/runes/runeSlots.png');
    console.log(runePage);
    $("#runes-img").append(runePage);
  }



  function buildRunesView(){
    //console.log('buildRunesView');
    var view = '';
    view += '' +
      '<div id="runes-list">'+
      '</div>'+
      '<div id="runes-detail">'+
        '<div id="runes">'+
        '</div>'+
        '<div id="runes-img">'+
        '</div>'+
      '</div>';
      //console.log(view);

    $('#summary-info').append(view);
  }

  function buildRunesList(){
    allpages = [];
    var id = dataModel.summonerSummary.summonerInfo[summonerBase.search]['id'];
    var data = dataModel.runes.summonerRunes[id]['pages'];
    var list = '<ul class="list-group">';
    var detail = '';

  //  console.log(data);
    $.each(data,function(key, runePage){
      list += '<li class="list-group-item"><button class="rune-page">'+runePage.name+'</button></li>';
      allpages.push(runePage);
    });
    list += '</ul>';
    console.log(allpages);
    $('#runes-list').append(list);
  }

  summonerBase.registerEvent('runes',function(data){
    //console.log('build summoner runes view');
    buildRunesView();
    buildRunesList();
    bindEvent();
  });

  return summonerBase;
}))
