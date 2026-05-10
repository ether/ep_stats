'use strict';

const {template} = require('ep_plugin_helpers');
const {padToggle} = require('ep_plugin_helpers/pad-toggle-server');

// Parallel User Settings + Pad Wide Settings checkboxes for "Show Pad and
// Author stats". Helper owns markup, storage, broadcast, enforce, and i18n.
const statsToggle = padToggle({
  pluginName: 'ep_stats',
  settingId: 'stats',
  l10nId: 'ep_stats.stats_entry.show_pad_and_author_stats',
  defaultLabel: 'Show Pad and Author stats',
  defaultEnabled: true,
});

// Older settings.json used a top-level `ep_stats_default` key. Translate it
// to the helper's nested `ep_stats.defaultEnabled` so an admin who set it
// to `false` keeps a default-off pad.
exports.loadSettings = async (hookName, args) => {
  const root = args && args.settings;
  if (root) {
    const ps = (root.ep_stats = root.ep_stats || {});
    if (typeof ps.defaultEnabled !== 'boolean' &&
        typeof root.ep_stats_default === 'boolean') {
      ps.defaultEnabled = root.ep_stats_default;
    }
  }
  return statsToggle.loadSettings(hookName, args);
};

exports.clientVars = statsToggle.clientVars;
exports.eejsBlock_mySettings = statsToggle.eejsBlock_mySettings;
exports.eejsBlock_padSettings = statsToggle.eejsBlock_padSettings;

exports.eejsBlock_exportColumn =
    template('ep_stats/templates/exportcolumn.html');

exports.eejsBlock_scripts =
    template('ep_stats/templates/scripts.html');

exports.eejsBlock_styles = (hookName, args, cb) => {
  args.content += '<link href="../static/plugins/ep_stats/static/css/stats.css" rel="stylesheet">';
  return cb();
};

exports.eejsBlock_body =
    template('ep_stats/templates/stats.html');
