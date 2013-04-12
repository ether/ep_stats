if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}


exports.stats = {
  init: function(){
    var html = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").html();
    var text = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").text();
    $('body').append("<div id='stats'></div>");
    $('#stats').append("<h1>Pad Stats</h1>");
    $('#stats').append("<div id='length'>Characters (no whitespace):" + text.length + "</div>");
    $('#stats').append("<div id='lengthWhitespace'>Characters (with whitespace):" + text.length + "</div>");
//    $('#stats').append("<div id='wordCount'>Word Count:" + wordCount(text) + "</div>");
    $('#stats').append("<div id='revCount'>Revision Count:" + pad.getCollabRevisionNumber() + "</div>");
    $('#stats').append("<div id='savedRevCount'>Saved Revision Count:" + clientVars.savedRevisions + "</div>");
//    $('#stats').append("<div id='authorCount'># of Authors:" + clientVars.collab_client_vars.historicalAuthorData() + "</div>");
    $('#stats').append("<h1>Author Stats</h1>");
  },
  show: function(){
    $('#stats').show();
  },
  hide: function(){
    $('#stats').hide();
  }
}

function wordCount (text) {
  var number = 0;
  var matches = text.match(/\b/g);
  if (matches) {
    number = matches.length / 2;
  }
  wordCount[field] = number;
  var finalCount = 0;
  $.each(wordCount, function(k, v) {
    finalCount += v;
  });
  return finalCount;
}


exports.postAceInit = function(hook, context){
  stats = exports.stats;
  stats.init();
  stats.show();

  /* on click */
  $('#options-stats').on('click', function() {
    if($('#options-stats').is(':checked')) {
      stats.show();
    } else {
      stats.hide();
    }
  });
}

