var path = require('path');
var eejs = require("ep_etherpad-lite/node/eejs");
var settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_exportColumn = function(hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_stats/templates/exportcolumn.html", {}, module);
  return cb();
};

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_stats/templates/scripts.html", {}, module);
  return cb();
};

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + '<link href="../static/plugins/ep_stats/static/css/stats.css" rel="stylesheet">';
  return cb();
};

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_stats/templates/stats.html", {}, module);
  return cb();
};

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  if (!settings.ep_stats_default){
    checked_state = 'unchecked';
  }else{
    if(settings.ep_stats_default == true){
      checked_state = 'checked';
    }
  }
  args.content = args.content + eejs.require('ep_stats/templates/stats_entry.ejs', {checked : checked_state});
  return cb();
}


exports.eejsBlock_dd_view = function (hook_name, args, cb){
  args.content = args.content + "<li><a href='#' onClick='$(\"#options-stats\").click();'>Pad Statistics</a></li>";
}
