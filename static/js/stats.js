if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

exports.stats = {
  init: function(){
    stats.update();
  },
  show: function(){
    // $('#stats').show();
  },
  hide: function(){
    $('#stats').hide();
  },
  update: function(){
    var html = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").html();
    var text = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").text();
    $('#length > .stats').html( text.replace(/\s/g,"").length );
    $('#lengthWhitespace > .stats').html( text.length );
    $('#wordCount > .stats').html(text.split(" ").length);
    $('#revCount > .stats').html( pad.getCollabRevisionNumber() );
    $('#savedRevCount > .stats').html( clientVars.savedRevisions.length );
    $('#authorCount > .stats').html( Object.keys(clientVars.collab_client_vars.historicalAuthorData).length );

    $('#wordsContributed > .stats').html( exports.stats.authors.numberOfWords() );
    $('#linesContributed > .stats').html( exports.stats.authors.numberOfLines() );
    $('#linesAsOnlyContributor > .stats').html( exports.stats.authors.numberOfLinesExclusive() );
    $('#numberOfCharsIncWS > .stats').html( exports.stats.authors.numberOfChars() );
    $('#numberOfCharsExcWS > .stats').html( exports.stats.authors.numberOfCharsExcWS() );
  }
}

exports.stats.authors = {
  numberOfWords: function(){
    // go through each word, does it have the class of this author?
  },
  numberOfLines: function(){
  },
  numberOfLinesExclusive: function(){
  },
  numberOfChars: function(){
  },
  numberOfCharsExcWS: function(){
  }
}

exports.postAceInit = function(hook, context){
  stats = exports.stats;
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

exports.aceEditEvent = function(hook_name, event, cb){
  // CAKE todo only enable if stats are enabled
  if(event.callstack.docTextChanged && event.callstack.domClean){
    exports.stats.update();
  }
}
