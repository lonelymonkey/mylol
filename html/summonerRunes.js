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
    console.log(data);
    var top = [442,442,445,375,371,389,315,320,268,216,211,158,131,77,45,24,2,61,5,64,5,108,52,5,46,93,156,30,254,193];
    var left = [27,99,186,11,83,148,38,132,87,42,125,77,143,179,247,314,390,423,470,510,548,566,602,646,703,656,682,44,227,501];
    var runePage = document.createElement("img");
    var rune;
    jQuery('<img/>', {
      id: 'runePage',
      src: 'images/runes/runeSlots.png'
    }).appendTo('#runes-img');
    $('#runePage').css({width:'775px'});
  //  console.log(runePage);
    $("#runes-img").append(runePage);
    $.each(data,function(key,rune){
      //console.log(rune);
      jQuery('<div/>', {
        id: 'rune'+key,
      }).appendTo('#runes-img');
      $('#rune'+key).css({position: 'absolute', left: left[key]+'px',
              top: top[key]+'px'});
      runeImg = document.createElement("img");
      runeImg.setAttribute('src','http://ddragon.leagueoflegends.com/cdn/6.21.1/img/rune/'+rune.runeImage);
      runeImg.setAttribute('id','runeImg'+key);
      $('#rune'+key).append(runeImg);
    });
    for(var i=27;i<=29;i++){
      console.log(i);
      $('#runeImg'+i).css({
        width: '110px',
        height: '110px'
      });
    }
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
