(function( $, ThemeBot, window, document, undefined ) {

  ThemeBot.ComboBox = function( $element, options ) {
    this.$element = $element;
    var defaultOptions = {
        inputClassName: "tmb-combobox-input",
        optionsGroupClassName: "tmb-combobox-options-group",
        optionClassName: "tmb-combobox-option",
        buttonClassName: "tmb-combobox-button",
        openClassName: "tmb-combobox-open"
      };
    options = $.extend( defaultOptions, options || {} );

    this.$input = this.$element.find( "." + options.inputClassName );
    this.$optionsWrapper = this.$element.find( "." + options.optionsGroupClassName );
    this.$options = this.$element.find( "." + options.optionClassName );
    this.$button = this.$element.find( "." + options.buttonClassName );
    this.$select = this.$element.find( "select" );

    this.init();
  };

  ThemeBot.ComboBox.prototype = {
    init: function() {
      var self = this;

      this.$button.on( "click", function( evt ) {
        self.$element.toggleClass( self.openClassName );
      });

      this.$options.on( "click", function( evt ) {
        self.$input.val( $( this ).text() );
        self.$select.val( $( this ).attr( 'data-value' ) );
        self.$select.trigger( "wp-combobox-change" );

        self.$element.removeClass( self.openClassName );
      });



      var count = 0;

      this.$input.on( "keyup", function( evt ) {
        switch ( evt.which ) {
          case 9:
            //tab - handled by blur event
            return;
          case 38:
            //up
            var $highlight = self.$optionsWrapper.find( "." + self.optionClassName + ".highlight" ),
          $previous = $highlight.prev();
          if ( $previous.length ) {	
            $highlight.removeClass( "highlight" );
            $previous.addClass( "highlight" );
          }
          return;
          case 40:
            //down
            var $highlight = self.$optionsWrapper.find( "." + self.optionClassName + ".highlight" ),
          $next = $highlight.next();
          if ( $next.length ) {	
            $highlight.removeClass( "highlight" );
            $next.addClass( "highlight" );
          }
          return;
          default:
            break;
        }
        self.$optionsWrapper.addClass( "filter" );
        self.$options.removeClass( "active highlight" );
        self.$element.addClass( self.openClassName );
        if ( self.$input.val() != "" ) {
          var found = 0;
          self.$options.each( function() {
            var $this = $( this ),
            regex = new RegExp( "^" + self.$input.val(), "i" );
            if ( $this.text().match( regex ) ) {
              $this.addClass( "active" );
              if ( !found ) {
                $this.addClass( "highlight" );
                found = 1;
              }
            } else {
              $this.removeClass( "active highlight" );
            }
          });
        } else {
          self.$options.addClass( "active " ).first().addClass( "highlight" );
        }
      });

      this.$input.on( "blur", function( evt ) {

        self.$optionsWrapper.find( "." + self.optionClassName + ".highlight" ).trigger( "click" );

        self.$element.removeClass( self.openClassName );
        self.$optionsWrapper.removeClass( "filter" );
        self.$options.removeClass( "active" ).removeAttr( "id" );

      });
    }
  };

})( jQuery, ThemeBot, window, document );
