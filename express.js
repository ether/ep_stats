var eejs = require("ep_etherpad-lite/node/eejs");

exports.expressCreateServer = function (hook_name, args, cb) {
  args.app.get('/p/:pad/:rev?/export/stats', function(req, res, next) {
    var padID = req.params.pad;
    var revision = req.params.rev ? req.params.rev : null;
    var template = eejs.require("ep_stats/templates/stats.html");
    res.send(template);
  });
};

