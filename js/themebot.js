(function ( jQuery, window ) {

  ThemeBot = function(){
    this.init();
  };
  ThemeBot.prototype = {
    $panel: "#tmb-side-bar",

    styleMap: {},
    stylesheet: '',
    pattern: null,
    controls: [],
    props: [],
    pieces: [],

    init: function() {
      //get stylesheet
      this.getStyleSheet();

    },

    getStyleSheet: function() {
      var self = this;

      $.ajax({
        url: 'css/blackout.css',
      }).complete( function( data ) {
        self.stylesheet = data.responseText;
        self.parse();
      });
    },

    panel: function() {
    },

    writeOut: function() {
    },

    parse: function() {
      var pos, str,
        li, index, length, matches,
        stylesheet = this.stylesheet,
        pattern = this.pattern;

      while ( matches = pattern.exec( stylesheet ) ) {
        // console.log(stylesheet);
        console.log(matches);
        index = pattern.index;
        li = pattern.lastIndex;
        length = stylesheet.length - li;
        //String
        this.pieces.push({
          value: stylesheet.substring( 0, index ),
          type: "string"
        });
        //Placeholder
        this.pieces.push({
          value: matches[1],
          type: "placeholder",
          ref: matches[2]
        });
      }
      this.pieces.push({
        value: stylesheet,
        type: "string"
      });
      stylesheet = "";
    },

    tokenize: function( regex, type, selector ) {

    },

    createControl: function( name, group ) {

    }
  };

  //Used for inhertance
  ThemeBot.extend = function( props ) {
    var SubClass = function() {
      ThemeBot.call( this );
    }
    $.extend( SubClass.prototype, ThemeBot.prototype, props );
    return SubClass;
  };

})( jQuery, window )
