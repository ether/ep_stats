'use strict';

const eejs = require('ep_etherpad-lite/node/eejs');
const settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_exportColumn = (hookName, args, cb) => {
  args.content += eejs.require('ep_stats/templates/exportcolumn.html', {}, module);
  return cb();
};

exports.eejsBlock_scripts = (hookName, args, cb) => {
  args.content += eejs.require('ep_stats/templates/scripts.html', {}, module);
  return cb();
};

exports.eejsBlock_styles = (hookName, args, cb) => {
  args.content += '<link href="../static/plugins/ep_stats/static/css/stats.css" rel="stylesheet">';
  return cb();
};

exports.eejsBlock_body = (hookName, args, cb) => {
  args.content += eejs.require('ep_stats/templates/stats.html', {}, module);
  return cb();
};

exports.eejsBlock_mySettings = (hookName, args, cb) => {
  let checkedState;
  if (!settings.ep_stats_default) {
    checkedState = 'unchecked';
  } else if (settings.ep_stats_default === true) {
    checkedState = 'checked';
  }
  args.content += eejs.require('ep_stats/templates/stats_entry.ejs', {checked: checkedState});
  return cb();
};


exports.eejsBlock_dd_view = (hookName, args, cb) => {
  args.content +=
      "<li><a href='#' onClick='$(\"#options-stats\").click();'>Pad Statistics</a></li>";
};
