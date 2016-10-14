(function(factory){
  window.generalView = factory({});
}(function(generalView){
  var config = {};
  generalView.load = function(cfg){
    saveConfig(cfg);
    view();
  }

  function saveConfig(cfg) {
    $.extend(config,cfg);
  }

  //menu list for each webpage

  function menu(){
    var menuList = '';
    switch (config.page) {
      case 'home':
      menuList +=
      '<li class="option"><a href="#">Recent News</a></li>'+
      '<li class="option"><a href="#">League News</a></li>'+
      '<li class="option"><a href="#">Events</a></li>';
        break;
      case 'championStats':
      menuList +=
      '<li class="option"><a href="#">Ability</a></li>'+
      '<li class="option"><a href="#">Basic Stats</a></li>'+
      '<li class="option"><a href="#">Build</a></li>'+
      '<li class="option"><a href="#">Runes & Masteries</a></li>'+
      '<li class="option"><a href="#">Lore</a></li>';
        break;
      case 'tournament':
        menuList +=
      '<li class="option"><a href="#">Regions</a></li>'+
      '<li class="option"><a href="#">Schedule</a></li>';
        break;
      case 'sfu':
        menuList +=
      '<li class="option"><a href="#">Teams</a></li>'+
      '<li class="option"><a href="#">Tournaments Generator</a></li>'+
      '<li class="option"><a href="#">Poll</a></li>';
        break;
      case 'about':
        menuList +=
      '<li class="option"><a href="#">Teams</a></li>'+
      '<li class="option"><a href="#">Tournaments Generator</a></li>'+
      '<li class="option"><a href="#">Poll</a></li>';
        break;
      default:
      menuList = '';

    }
    console.log(menuList);
    $('#menuContent').append(menuList);
  }

  //Common interface for each webpage

  function view(){
    var view = '';
    view += '<div id="header" class="container">' +
      '<div class="row">' +
        '<div id="sfuIconDiv" class="col-sm-8">'+
          '<img id="sfuIcon" src="images/icons/websiteIcon.JPG"></img>'+
          '<h1 id="sfuLogo">SFU League <br/> of legend</h1>'+
        '</div>'+

        '<div id="searchDiv" class="col-sm-4">'+
          '<form>'+
            '<div class="form-group">'+
                '<input type="search" class="form-control" id="search">'+
            '</div>'+
              '<button type="submit" class="btn btn-default">Submit</button>'+
          '</form>'+
        '</div>'+
      '</div>'+
    '</div>'+

      '<div id="pills" class="container">'+
            '<ul class="nav nav-pills">'+
                '<li><a href="#">Home</a></li>'+
                '<li><a href="#">Champion</a></li>'+
                '<li><a href="#">Tournament</a></li>'+
                '<li><a href="#">SFU Teams</a></li>'+
                '<li><a href="#">About</a></li>'+
              '</ul>'+
      '</div>'+

      '<div id="midSection" class="container">'+
        '<div class="row">'+
          '<div id="menu" class="col-sm-2">'+
            '<ul id="menuContent">'+
            '</ul>'+
            '<div id="currentPatch">'+
              'Current Patch: </br> <span class="smallFont">123123</span> </br>'+
              'Some little stuff'+
            '</div>'+
          '</div>'+

          '<div id="content" class="col-sm-10">'+
          '</div>'+
        '</div>'+
      '</div>'+

      '<div id="footer" class="container">'+
          '<div id="webInfo" class="col-sm-8">'+
            'gsfggfdgfddfggdffdgdfgdfgdfgdfg'+
          '<div id="link" class="col-sm-4">'+
          '</div>'+
      '</div>';

      $('#'+config.containerId).append(view);
      menu();
  }

  return generalView;
}))
