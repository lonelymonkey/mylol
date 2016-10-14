(function(factory){
  window.championSelect = factory({});
}(function(championSelect){
  var config = {};
  championSelect.load = function(cfg){
    saveConfig(cfg);
  }

  function saveConfig(cfg) {
    $.extend(config,cfg);
  }
}))
