if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

exports.stats = {
  init: function(){
    stats.update();
  },
  show: function(){
    $('#stats').show();
    $('#stats').css("top", $('#editorcontainer').offset().top+'px');
    exports.stats.update();
  },
  hide: function(){
    $('#stats').hide();
  },
  update: function(){
    var html = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").html();
    var text = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").text();
    $('#length > .stats').html( text.replace(/\s/g,"").length );
    $('#lengthWhitespace > .stats').html( text.length );
    $('#wordCount > .stats').html( exports.wordCount());
  }
}


exports.wordCount = function(){
  var totalCount = 0;
  var summaryCount = 0;
  var commentaryCount = 0;
  var evidenceCount = 0;
  var synthesisCount = 0;

  $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
    var lineCount = 0;
    $(this).contents().each(function(){ // each span.
       var classes = $(this).attr("class");
       if(classes){
         if(classes.indexOf("summary") !== -1){
           var numberOf = $(this).text().split(" ");
           numberOf = numberOf.clean(""); // dont include spaces or line breaks or other nastyness
           summaryCount += numberOf.length;
         }
         if(classes.indexOf("commentary") !== -1){
           var numberOf = $(this).text().split(" ");
           numberOf = numberOf.clean(""); // dont include spaces or line breaks or other nastyness
           commentaryCount += numberOf.length;
         }
         if(classes.indexOf("evidence") !== -1){
           var numberOf = $(this).text().split(" ");
           numberOf = numberOf.clean(""); // dont include spaces or line breaks or other nastyness
           evidenceCount += numberOf.length;
         }
         if(classes.indexOf("synthesis") !== -1){
           var numberOf = $(this).text().split(" ");
           numberOf = numberOf.clean(""); // dont include spaces or line breaks or other nastyness
           synthesisCount += numberOf.length;
         }
       }
       var numberOf = $(this).text().split(" ");
       numberOf = numberOf.clean(""); // dont include spaces or line breaks or other nastyness
       lineCount += numberOf.length;
    });
    totalCount += lineCount;
  });
  if(summaryCount){
    $('#summaryCount > .stats').text(summaryCount);
  }else{
    $('#summaryCount > .stats').text(0);
  }
  if(commentaryCount){
    $('#commentaryCount > .stats').text(commentaryCount);
  }else{
    $('#commentaryCount > .stats').text(0);
  }
  if(evidenceCount){
    $('#evidenceCount > .stats').text(evidenceCount);
  }else{
    $('#commentaryCount > .stats').text(0);
  }
  if(synthesisCount){
    $('#synthesisCount > .stats').text(synthesisCount);
  }else{
    $('#synthesisCount > .stats').text(0);
  }

  // Next to update percentages..
  setTimeout(function(){

  var wordCount = parseInt($('#wordCount > .stats').text());
  var unmarkedCount = wordCount - summaryCount - commentaryCount - evidenceCount - synthesisCount;
  $('#unmarkedCount > .stats').text(unmarkedCount);

  var summaryP = (summaryCount / wordCount)*100;
  $('#summaryP > .stats').text(Math.round(summaryP));
  var commentaryP = (commentaryCount / wordCount)*100;
  $('#commentaryP > .stats').text(Math.round(commentaryP));
  var evidenceP = (evidenceCount / wordCount)*100;
  $('#evidenceP > .stats').text(Math.round(evidenceP));
  var synthesisP = (synthesisCount / wordCount)*100;
  $('#synthesisP > .stats').text(Math.round(synthesisP));
  var unmarkedP = (unmarkedCount / wordCount)*100;
  $('#unmarkedP > .stats').text(Math.round(unmarkedP));
  }, 100);

  return totalCount;
}

exports.stats.authors = {
  numberOfWords: function(){
    /*
    var results = {};
    // go through each word, does it have the class of this author?
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
      $(this).contents().each(function(){
        var line = this;
        var classes = $(this).attr("class");
        if(classes){
          classes = classes.split(" ");
          $.each(classes, function(k, spanClass){
            if( spanClass.indexOf("author") !== -1){ // if an author class exists on this span
              // how many words are in this string?
              var number = $(line).text().split(" ").length;
              if( !results[ spanClass ] ){
                results[ spanClass ] = number;
              }else{
                results[ spanClass ] = results[ spanClass ] + number;
              }
            }
          });
        }
      });
    });
    return results;
    */
  },
  numberOfLines: function(){
    var results = {};
    // output format.  John -- 2, Dave -- 3
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){ // each line
      $(this).contents().each(function(){
        var line = this;
        var classes = $(this).attr("class");
        if(classes){
          classes = classes.split(" ");
          $.each(classes, function(k, spanClass){
            if( spanClass.indexOf("author") !== -1){ // if an author class exists on this span
              // how many words are in this string?
              var number = $(line).text().split(" ").length;
              if( !results[ spanClass ] ){
                results[ spanClass ] = 1;
              }else{
                results[ spanClass ] = results[ spanClass ] + 1;
              }
            }
          });
        }
      });

    });
    return results;

  },
  numberOfLinesExclusive: function(){
    var results = {};
    var lineCount = 1;
    // output format.  John -- 1, Dave -- 1
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){ // For Each LINE
      var line = {};
      $(this).contents().each(function(){ // For SPAN!
        var classes = $(this).attr("class");
        if(classes){
          classes = classes.split(" ");
          $.each(classes, function(k, spanClass){
            if( spanClass.indexOf("author") !== -1){ // if an author class exists on this span
              if( !line[ lineCount ] ){
                line[ lineCount ] = {};
                line[ lineCount ].author = spanClass; // first author!
              }else{
                delete line[ lineCount ];// already has an author so nuke!
              }
            }
          });


        }
        // End Span
      });
      var lineHasOneAuthor = (line[lineCount])
      if(lineHasOneAuthor){
        // add author to results obj
        var author = line[lineCount].author;
        results[author] = (results[author] +1) || 1
      }
      lineCount++;
      // End Line
    });
    return results;
  },
  numberOfChars: function(){
    var results = {};
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
          classes = classes.split(" ");
          var number = $(this).text().length;
          $.each(classes, function(k, spanClass){
            if( spanClass.indexOf("author") !== -1){ // if an author class exists on this span
              results[ spanClass ] = number;
            }else{
              results[ spanClass ] = results [ spanClass] + 1;
            }
          });
        };
      });
    });
    return results;
  },
  numberOfCharsExcWS: function(){
    var results = {};
    // output format.  John -- 6, Dave -- 9
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().each(function(){ 
      $(this).contents().each(function(){
        var classes = $(this).attr("class");
        if(classes){
 
          classes = classes.split(" ");
          var number = $(this).text().replace(/\s/g,"").length; // get length without whitespace
          $.each(classes, function(k, spanClass){
            if( classes.indexOf("author") !== -1){ // if an author class exists on this span
              results[ spanClass ] = number;
            }else{
              results[ spanClass ] = results[ spanClass] + number;
            }
          });
        }
      });
    });
    return results;
  }
}

// Our lineHeights attribute will result in a heaading:h1... :h6 class
exports.aceAttribsToClasses = function(hook, context){
  if(context.key == 'summary'){
    return ['summary'];
  }
  if(context.key == 'commentary'){
    return ['commentary'];
  }
  if(context.key == 'evidence'){
    return ['evidence'];
  }
  if(context.key == 'synthesis'){
    return ['synthesis'];
  }
}

exports.postAceInit = function(hook, context){
  $('#options-stats').attr('checked', true);
  exports.stats.show();
  $('#clearAuthorship').hide();
  pad.changeViewOption('showAuthorColors', false);
  stats = exports.stats;

  /* on click */
  $('#options-stats').on('click', function() {
    if($('#options-stats').is(':checked')) {
      stats.show();
    } else {
      stats.hide();
    }
  });

  $('#statButtons > li').click(function(){
    var attr = this.id;
    // remove all other attr and apply the new attr
    context.ace.callWithAce(function(ace){
console.log(ace);
      var rep = ace.ace_getRep(); // get the current user selection
      var isSelection = (rep.selStart[0] !== rep.selEnd[0] || rep.selStart[1] !== rep.selEnd[1]);
      if(!isSelection) return false; // No point proceeding if no selection..
      ace.ace_setAttributeOnSelection("summary", false); // set the attribute to false
      ace.ace_setAttributeOnSelection("commentary", false); // set the attribute to false
      ace.ace_setAttributeOnSelection("evidence", false); // set the attribute to false
      ace.ace_setAttributeOnSelection("synthesis", false); // set the attribute to false
      ace.ace_toggleAttributeOnSelection(attr); // set the attribute to false
    },'ogreFunk' , true);
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
    table += "<tr><td class='statsAuthorColor' style='background-color:"+authorColorFromClass(value)+"'></td><td>"+authorNameFromClass(value)+":</td><td>"+data[value]+"</td></tr>";
  };
  table += "</table>";
  return table;
}

function authorNameFromClass(authorClass){ // turn authorClass into authorID then authorname..
  // get the authorID from the class..
  /*
  var authorId = exports.className2Author(authorClass);

  // It could always be me..
  var myAuthorId = pad.myUserInfo.userId;
  if(myAuthorId == authorId){
    return "Me";
  }

  // Not me, let's look up in the DOM
  var name = null;
  $('#otheruserstable > tbody > tr').each(function(){
    if (authorId == $(this).data("authorid")){
      $(this).find('.usertdname').each( function() {
        name = $(this).text();
      });
    }
  });

  // Else go historical
  if(!name){
    return clientVars.collab_client_vars.historicalAuthorData[authorId].name || "Unknown Author"; // Try to use historical data
  }else{
    return name || "Unknown Author";
  }
  */
}

function authorColorFromClass(authorClass){ // turn authorClass into authorID then authorname..
  // get the authorID from the class..
  /*
  var authorId = exports.className2Author(authorClass);

  // It could always be me..
  var myAuthorId = pad.myUserInfo.userId;
  if(myAuthorId == authorId){
    return "#fff";
  }

  // Not me, let's look up in the DOM
  var color = null;
  $('#otheruserstable > tbody > tr').each(function(){
    if (authorId == $(this).data("authorid")){
      $(this).find('.usertdswatch > div').each( function() {
        color = $(this).css("background-color");
      });
    }
  });

  // Else go historical
  if(!color){
    return clientVars.collab_client_vars.historicalAuthorData[authorId].color || "#fff"; // Try to use historical data
  }else{
    return color;
  }
  */
}


Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};



exports.collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = tname;

  if(tname == "summary"){
    context.cc.doAttrib(state, "summary");
  }
};


exports.aceEditorCSS = function(hook_name, cb){return ["/ep_stats/static/css/ace.css"];} // inner pad CSS
