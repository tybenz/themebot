(function ( jQuery, window ) {

  ThemeBot = function(){
    this.init();
  };
  ThemeBot.prototype = {
    $panel: "#tmb-side-bar",

    styleMap: {},
    stylesheet: '',
    pattern: /\:([^\/\*\n\:]*)\/\*\{(([^-\}]*)-([^-\}]*)-([^-\}]*))\}\*\/;/g,
    controls: [],
    props: [],
    pieces: [],
    parseStyle: "CSS",

    init: function() {
      if ( this.isReady ) {
        this.parse = this.parseStyle == "CSS" ? this.parseCSS : this.parseLESS;
        this.$frame = $( '#preview-frame' ).contents();
        this.getStyleSheet();
      }
    },

    frameReady: function() {
      this.isFrameReady = true;
      if ( this.isDomReady ) {
        this.isReady = true;
        this.init();
      }
    },

    domReady: function() {
      this.isDomReady = true;
      if ( this.isFrameReady ) {
        this.isReady = true;
        this.init();
      }
    },

    getStyleSheet: function() {
      var self = this;

      $.ajax({
        url: 'skeleton/skeleton.css',
      }).complete( function( data ) {
        self.stylesheet = data.responseText;
        self.$frame.find( '#stylesheet' ).remove();
        self.stylesheet = self.stylesheet.replace( /\.\.\//g, '' );
        self.$stylesheet = $( '<style id="stylesheet" type="text/css">' + self.stylesheet + '</style>' );
        self.$frame.find( 'head' ).append( self.$stylesheet );
        self.parse();
      });
    },

    initPanel: function() {
      var self = this,
        controlName,
        groupName, subgroupName, propName,
        dissected, $group;

      this.$panel = $( '#tmb-side-bar' );

      for ( controlName in this.styleMap ) {
        dissected = controlName.split( '-' );
        groupName = dissected[0];
        subgroupName = dissected[1];
        propName = dissected[2];

        if ( $( '#tmb-side-bar .tmb-' + groupName ).length ) {
          $group = this.$panel.find( '#' + controlName.split('-')[0] + '-panel' );
          $group.append( self.createControl( controlName ) );
        } else {
          $group = this.$panel.find( '#' + controlName.split('-')[0] + '-panel .collapsible-content' );
          $group.append( self.createControl( controlName ) );
          // this.$panel.append( $group );
        }
      }

      new ThemeBot.Colorpicker( $( '#colorpicker' ) );
    },

    createControl: function( name ) {
      var type = name.split( '-' )[2],
        $control,
        self = this;

      switch ( type ) {
        case 'background':
        case 'color':
        case 'hover':
        case 'active':
        case 'visited':
          $control = $( '<label>' + name + '</label><br /><input class="tmb-colorpicker-input" data-prop="' + name + '" value="' + this.styleMap[ name ] + '" /><br/>' );
          $($control[2]).on('change keyup blur', function() {
            self.updateStyle( $( this ) );
          });
          break;
        case 'textshadow':
          $control = $( '<label>' + name + '</label><br /><input data-prop="' + name + '" value="' + this.styleMap[ name ] + '" /><br/>' );
          break;
        case 'radius':
        case 'border':
          $control = $( '<label>' + name + '</label><br /><input data-prop="' + name + '" value="' + this.styleMap[ name ] + '" /><br/>' );
          break;
        case 'font':
          $control = $( '<label>' + name + '</label><br /><input data-prop="' + name + '" value="' + this.styleMap[ name ].replace( /"/g, "'" ) + '" /><br/>' );
          $control = $( '<div class="select"> \
                <select id="select" name="select"> \
                    <option value="0">Option 1</option> \
                    <option value="1">Option 2</option> \
                    <option value="2">Option 3</option> \
                    <option value="3">Option 4</option> \
                </select> \
                <div class="clearfix select-box"> \
                    <input type="text" class="tmb-combobox-input textbox round-l input" value="Myriad Pro, Arial, sans-serif"> \
                    <div class="tmb-combobox-button button grey round-r"></div> \
                </div> \
                <div class="tmb-combobox-options-group options round-b"> \
                    <div class="tmb-combobox-option option textbox round-t" data-value="0"><div class="option-inner">Myriad Pro, Arial, sans-serif</div></div> \
                    <div class="tmb-combobox-option option textbox round-t" data-value="1"><div class="option-inner">Monaco, sans-serif, monospace</div></div> \
                    <div class="tmb-combobox-option option textbox" data-value="2"><div class="option-inner">Helvetica, Arial, sans-serif</div></div> \
                    <div class="tmb-combobox-option option textbox round-b" data-value="3"><div class="option-inner">Times New Roman, serif</div></div> \
                </div> \
            </div>' );
          new ThemeBot.ComboBox( $control, {openClassName: "open"} );
          break;
        case 'padding':
          $control = $( '<label>' + name + '</label><br />' +
                          '<div class="number"> \
                            <div class="tmb-spinner-buttons"> \
                              <div class="button tmb-spinner-up-button"></div> \
                              <div class="button tmb-spinner-down-button"></div> \
                            </div> \
                            <input type="" class="tmb-spinner" data-prop="' + name + '" value="0" name="" /> \
                            <input type="" class="tmb-spinner-unit" value="px" name="" /> \
                          </div>' );
          var spinner = new ThemeBot.Spinner( $( $control[2] ) );
          $( $control[2] ).find( 'input:first' ).on( 'blur keyup change', function(){
            self.updateStyle( $( this ) );
          });
          break;
        default:
          break;
      }
      $wrapper = $( '<div class="field"></div>' );
      $wrapper.append( $control );

      return $wrapper;
    },

    updateStyle: function( $element ) {
      var name = $element.data( 'prop' );

      this.styleMap[ name ] = $element.val();
      this.writeOut();
    },

    writeOut: function() {
      var temp = '';
      for ( var i in this.pieces ) {
        piece = this.pieces[i];
        if ( piece.type == 'placeholder' ) {
          this.pieces[i].value = this.styleMap[ piece.ref ];
          temp += ': ' + this.pieces[i].value + ' /*{' + piece.ref + '}*/;';
        } else {
          temp += this.pieces[i].value;
        }
      }
      this.$stylesheet.text( temp );
    },

    parse: null,

    parseLESS: function() {
    },

    parseCSS: function() {
      var pos, str,
        index, length, matches,
        li = 0,
        stylesheet = this.stylesheet;

      this.styleMap = {};

      while ( matches = this.pattern.exec( stylesheet ) ) {
        //String
        index = matches.index;
        this.pieces.push({
          value: stylesheet.substring( li, index ),
          type: "string"
        });
        li = this.pattern.lastIndex;

        //Placeholder
        value = matches[1];
        ref = matches[2];
        this.pieces.push({
          value: value,
          type: "placeholder",
          ref: ref
        });

        //StyleMap
        this.styleMap[ref] = $.trim( value )
      }

      this.pieces.push({
        value: stylesheet.substring( li, stylesheet.length ),
        type: "string"
      });

      if ( this.$panel.length ) {
        this.initPanel();
      }
    },

    tokenize: function( regex, type, selector ) {

    },
  };

  //Used for inhertance
  ThemeBot.extend = function( props ) {
    var SubClass = function() {
      ThemeBot.call( this );
    }
    $.extend( SubClass.prototype, ThemeBot.prototype, props );
    return SubClass;
  };

  ThemeBot.Widget = function( $element, themebot, options ) {
    this.themebot = themebot;
    this.options = $.extend( this.defaultOptions, options || {} );
    this.$element = typeof $element == "string" ? $( $element ) : $element;
    this.init();
  }

  ThemeBot.Widget.prototype = {
    themebot: null,
    defaultOptions: {},
    init: function(){},
    writeOut: function() {
      var name = $element.data( 'prop' );

      this.themebot.styleMap[ name ] = this.val();
      this.themebot.writeOut();
    },
    val: function() {
      return this.$element.val();
    }
  };

  ThemeBot.Widget.extend = function( props ) {
    var SubClass = function( $element, themebot, options ) {
      ThemeBot.Widget.call( this, $element, themebot, options );
    }
    $.extend( SubClass.prototype, ThemeBot.prototype, props );
    return SubClass;
  };

})( jQuery, window )
