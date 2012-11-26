(function( $, ThemeBot, window, document, undefined ) {

  ThemeBot.Spinner = function( $element, options ) {
    var defaultOptions = {
        buttonWrapperClassName: "tmb-spinner-buttons",
        upButtonClassName: "tmb-spinner-up-button",
        downButtonClassName: "tmb-spinner-down-button",
        inputClassName: "tmb-spinner"
      };
    options = $.extend( defaultOptions, options || {} );

    this.$buttons = $element.find( "." + options.buttonWrapperClassName );
    this.$up = this.$buttons.find( "." + options.upButtonClassName );
    this.$down = this.$buttons.find( "." + options.downButtonClassName );
    this.$input = $element.find( "input." + options.inputClassName );

    this.init();
  };

  ThemeBot.Spinner.prototype = {
    init: function() {
      var self = this,
        intervalID = 0;

      var dt = new ThemeBot.DragTracker( this.$buttons.get( 0 ), {
        dragStart: function( tracker, dx, dy ) {
          this.value = parseInt( self.$input.val() );
        },

        dragUpdate: function( tracker, dx, dy ) {
          self.$input.val( Math.floor( this.value - ( dy / 3 ) ) );
          self.$input.trigger( "change" );
        },
      });

      this.$input.on( "keydown", function( evt ) {
        if ( evt.which == 38 || evt.which == 40 ) {
          evt.preventDefault();
          if ( evt.which == 38 ) {
            //up
            self._incrementValue();
          } else if ( evt.which == 40 ){
            //down
            self._decrementValue();
          }
        }
      });

      this.$up.on( "click", function() {
        self._incrementValue();
      });

      this.$up.on( "mousedown", function() {
        intervalID = setInterval( function() {
          self._incrementValue();
        }, 170);
      }).on( "mouseup mouseleave", function() {
        if ( intervalID ) {
          clearInterval( intervalID );
        }
      });

      this.$down.on( "mousedown", function() {
        intervalID = setInterval( function() {
          self._decrementValue();
        }, 170);
      }).on( "mouseup mouseleave", function() {
        if ( intervalID ) {
          clearInterval( intervalID );
        }
      });

      this.$down.on( "click", function() {
        self._decrementValue();
      });
    },

    _decrementValue: function() {
      this.$input.val( parseInt( this.$input.val() ) - 1 ).trigger( "change" );
    },

    _incrementValue: function() {
      this.$input.val( parseInt( this.$input.val() ) + 1 ).trigger( "change" );
    }
  };

  $.fn.tmbSpinner = function( options ) {
    $( this ).each( function() {
      var spinner = new ThemeBot.Spinner( this, options );
    });
    return this;
  };

})( jQuery, ThemeBot, window, document );
