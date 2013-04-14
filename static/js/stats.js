if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

exports.stats = {
  init: function(){
    stats.update();
  },
  show: function(){
    $('#stats').show();
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
    $('#savedRevCount > .stats').html( clientVars.savedRevisions.length ); // TODO cake doesnt update in real time
    $('#authorCount > .stats').html( Object.keys(clientVars.collab_client_vars.historicalAuthorData).length );

    $('#wordsContributed > .stats').html( tb(exports.stats.authors.numberOfWords()) );
    $('#linesContributed > .stats').html( tb(exports.stats.authors.numberOfLines()) );
    $('#linesAsOnlyContributor > .stats').html( tb(exports.stats.authors.numberOfLinesExclusive()) );
    $('#numberOfCharsIncWS > .stats').html( tb(exports.stats.authors.numberOfChars()) );
    $('#numberOfCharsExcWS > .stats').html( tb(exports.stats.authors.numberOfCharsExcWS()) );
  }
}

exports.stats.authors = {
  numberOfWords: function(){
    var results = {};
    // go through each word, does it have the class of this author?
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
          if( classes.indexOf("author") !== -1){ // if an author class exists on this span
            // how many words are in this string?
            var number = $(this).text().split(" ").length;
            if( !results[ $(this).attr("class") ] ){
              results[ $(this).attr("class") ] = number;
            }else{
              results[ $(this).attr("class") ] = results[ $(this).attr("class") ] + number;
            }
          }
        }
      });
    });
    // to do make a clean html format
    return results;
  },
  numberOfLines: function(){
    var results = {};
    // output format.  John -- 2, Dave -- 3
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){ // each line
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
          if( classes.indexOf("author") !== -1){ // if an author class exists on this span
            // how many words are in this string?
            if( !results[ $(this).attr("class") ] ){
              results[ $(this).attr("class") ] = 1; // todo cake this is wrong
            }else{
              results[ $(this).attr("class") ] = results[ $(this).attr("class") ] + 1;
            }
          }
        }
      });
    });
    // to do make a clean html format
    return results;

  },
  numberOfLinesExclusive: function(){
  },
  numberOfChars: function(){
    var results = {};
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
          if( classes.indexOf("author") !== -1){ // if an author class exists on this span
            var number = $(this).text().length;
            if( !results[ $(this).attr("class") ] ){
              results[ $(this).attr("class") ] = number;
            }else{
              results[ $(this).attr("class") ] = results[ $(this).attr("class") ] + number;
            }
          }
        }
      });
    });
    // to do make a clean html format
    return results;
  },
  numberOfCharsExcWS: function(){
    var results = {};
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){ 
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
          if( classes.indexOf("author") !== -1){ // if an author class exists on this span
            var number = $(this).text().replace(/\s/g,"").length; // get length without whitespace
            if( !results[ $(this).attr("class") ] ){
              results[ $(this).attr("class") ] = number;
            }else{
              results[ $(this).attr("class") ] = results[ $(this).attr("class") ] + number;
            }
          }
        }
      });
    });
    // to do make a clean html format
    return results;
  }
}

exports.postAceInit = function(hook, context){
  stats = exports.stats;

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
  if($('#options-stats').is(':checked')) { // if stats are enabled
    if(event.callstack.docTextChanged && event.callstack.domClean){
      exports.stats.update();
    }
  }
}

exports.className2Author = function(className)
{
  return className.substring(7).replace(/[a-y0-9]+|-|z.+?z/g, function(cc)
  {
    if (cc == '-') return '.';
    else if (cc.charAt(0) == 'z')
    {
      return String.fromCharCode(Number(cc.slice(1, -1)));
    }
    else
    {
      return cc;
    }
  });
}

exports.getAuthorClassName = function(author)
{
  return "ep_cursortrace-" + author.replace(/[^a-y0-9]/g, function(c)
  {
    if (c == ".") return "-";
    return 'z' + c.charCodeAt(0) + 'z';
  });
}

function tb(data){ // turns data object into a table
  var table = "<table>";
  for (var value in data){
    table += "<tr><td>"+authorNameFromClass(value)+"</td><td>"+data[value]+"</td></tr>";
  };
  table += "</table>";
  return table;
}

function authorNameFromClass(authorClass){ // turn authorClass into authorID then authorname..
  // get the authorID from the class..
  var authorId = exports.className2Author(authorClass);

  // It could always be me..
  var myAuthorId = pad.myUserInfo.userId;
  if(myAuthorId == authorId){
    return "Me";
  }

  // Not me, let's look up in the DOM
  var authorObj = {};
  $('#otheruserstable > tbody > tr').each(function(){
    if (authorId == $(this).data("authorid")){
      $(this).find('.usertdname').each( function() {
        var name = $(this).text();
        if(name == "") name = "Unknown Author";
      });
      return name;
    }
  });

  // Else go historical
  return clientVars.collab_client_vars.historicalAuthorData[authorId] || "Unknown Author"; // Try to use historical data
}

