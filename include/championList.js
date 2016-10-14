(function(factory){
  window.championList = factory({});
}(function(championList){
  var config = {};
  championList.load = function(cfg){
    saveConfig(cfg);
    view();
    getData();
  }

  function view(){
    var view='';
    view +=   '<div id="championSelect">'+
        '<div class="row">'+
          '<div class="col-sm-12">'+
            '<form class="form-inline">'+
              '<div class="form-group">'+
                '<label for="championName">Champion Name:</label>'+
                '<input type="text" class="form-control" id="championName" onkeyup="championList.showResult(this.value)">'+
              '</div>'+
            '</form>'+
          '</div>'+
        '</div>'+

        '<div id="championOverview">'+
          '<div id="championChart" class="row">'+

          '</div>'+
        '</div>'+

      '</div>';
      $('#'+config.containerId).append(view);
  }

  function saveConfig(cfg) {
    $.extend(config,cfg);
  }

  function getData(){
    $.get("include/lolAPI.php",
          function(data, status){
          data = JSON.parse(data);
          var imageURL = "http://ddragon.leagueoflegends.com/cdn/4.2.6/img/champion/" + data.data[1].image.full;
           //var numOfChampions = Object.keys(data.data).length;
           $.each(data.data, function(index, value) {
             console.log(value);
             imageURL = "http://ddragon.leagueoflegends.com/cdn/6.19.1/img/champion/" + data.data[index].image.full;
             $('#championChart').append('<div class="col-sm-2 champPic">'+
                                          '<img src='+imageURL+' style="max-width:100px;">'+
                                          '<div id=champion'+value.id+' class="champion">'+value.name+'</div>'+
                                        '</div>');
          });
       });
  }

  championList.showResult = function(championName){
    console.log(championName);
  }

  return championList;
}))
