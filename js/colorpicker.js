(function( $, WebPro, window, document, undefined ) {

  ThemeBot.Colorpicker = function( $element, options ) {
    var defaultOptions = {
      inputClassName: "tmb-colorpicker-input",
      graphClassName: "tmb-colorpicker-graph",
      hueClassName: "tmb-colorpicker-hue",
      offsetX: 0,
      offsetY: 20
    },
    options = $.extend( defaultOptions, options || {} );
    this.options = options
    this.$element = $element;
    this.offsetX = 0;
    this.offsetY = 20;
    this.value = { h: 0, s: 0, b:0 };

    this.init();
  };

  ThemeBot.Colorpicker.prototype = {
    init: function() {
      var self = this,
      opts = this.options;

      this.$fields = $( "." + opts.inputClassName );
      this.$graph = this.$element.find( "." + opts.graphClassName );
      this.$hue = this.$element.find( "." + opts.hueClassName );

      var sliderWidget = $( '#colorpicker .tmb-colorpicker-graph' ).data( 'slider' );
      if ( sliderWidget ) {
        this.graph = sliderWidget;
      } else {
        this.graph = new ThemeBot.Slider( "#colorpicker .tmb-colorpicker-graph", {
          trackClassName: "graph",
          thumbClassName: "thumb",
          ignoreY: false
        });
        $( '#colorpicker .tmb-colorpicker-graph' ).data( 'slider', this.graph );
      }

      $( this.graph ).on( "tmb-slider-update", function( evt, data ) {
        self.value.s = data.percentageX * 100;
        self.value.b = 100 - data.percentageY * 100;

        self._writeOut();
      });

      this.hue = new ThemeBot.Slider( "#colorpicker .tmb-colorpicker-hue", {
        trackClassName: "hue",
        thumbClassName: "thumb",
        ignoreY: false,
        ignoreX: true
      });

      $( this.hue ).on( "tmb-slider-update", function( evt, data ) {
        self.value.h = 360 - data.percentage * 360;
        self.$graph.css( "background-color", self._convert({ h: self.value.h, s: 100, b: 100 }, "hsb2hex" ) );

        self._writeOut();
      });

      this.$fields.on( "focus", function() {
        //colorpicker shows up underneath field on focus, hides on blur
        var $this = $( this ),
          x = $this.offset().left,
          y = $this.offset().top;

        self.$element.css({	
          left: x + self.offsetX + "px",
          top: y + self.offsetY + "px"
        }).show();

        self._readIn( $this.val() );

        self.$input = $this; 
        $( self.graph ).on( 'tmb-slider-update', function( evt, data ) {
          $this.css( 'background-color', self._convert({ h: self.value.h, s: 100, b: 100 }, "hsb2hex" ) );
        });
        $( self.hue ).on( 'tmb-slider-update', function( evt, data ) {
          $this.css( 'background-color', self._convert({ h: self.value.h, s: 100, b: 100 }, "hsb2hex" ) );
        });
      }).on( "blur", function() {
        self.$element.hide();
      });
    },

    _readIn: function( value ) {
      //process value
      this.value = this._convert( value, this._typeof( value ) + "2hsb" );
      this._update( this.value );
    },

    _writeOut: function() {
      if ( this.$input ) {
        this.$input.val( this._convert( this.value, "hsb2hex" ) );
      }
    },

    _typeof: function( val ) {
      if ( val.indexOf( '#' ) > -1 ) {
        return "hex";
      }
      return "rgb";
    },

    _update: function( color ) {
      this.graph.setPositionByPercentage( color.s / 100, 1 - color.b / 100 );
      this.hue.setPositionByPercentage( 0, 1 - color.h / 360 );
    },

    _convert: function( val, type ) {
      var hex, rgb, hsb;

      switch ( type ) {
        case "hex2rgb":
          hex = parseInt(((val.indexOf('#') > -1) ? val.substring(1) : val), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
        case "hex2hsb": 
          return this._convert( this._convert( val, "hex2rgb" ), "rgb2hsb" );
        case "rgb2hex":
          if ( val instanceof String ) {
          val = val.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          val = { r: val[ 0 ], g: val[ 1 ], b: val[ 2 ] };
        }
        rgb = {	r: val.r.toString( 16 ), g: val.g.toString( 16 ), b: val.b.toString( 16 ) };
        return "#" + ( rgb.r.length < 2 ? "0" + rgb.r : rgb.r )
        + ( rgb.g.length < 2 ? "0" + rgb.g : rgb.g )
        + ( rgb.b.length < 2 ? "0" + rgb.b : rgb.b );
        case "rgb2hsb":
          if ( val instanceof String ) {
          val = val.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          val = { r: val[ 0 ], g: val[ 1 ], b: val[ 2 ] };
        }
        rgb = val;
        hsb = {
          h: 0,
          s: 0,
          b: 0
        };
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        if (max != 0) {

        }
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
          if (rgb.r == max) {
            hsb.h = (rgb.g - rgb.b) / delta;
          } else if (rgb.g == max) {
            hsb.h = 2 + (rgb.b - rgb.r) / delta;
          } else {
            hsb.h = 4 + (rgb.r - rgb.g) / delta;
          }
        } else {
          hsb.h = -1;
        }
        hsb.h *= 60;
        if (hsb.h < 0) {
          hsb.h += 360;
        }
        hsb.s *= 100/255;
        hsb.b *= 100/255;
        return hsb;
        case "hsb2hex":
          return this._convert( this._convert( val, "hsb2rgb" ), "rgb2hex" );
        case "hsb2rgb":
          hsb = val;
        rgb = {};
        var h = Math.round(hsb.h);
        var s = Math.round(hsb.s*255/100);
        var v = Math.round(hsb.b*255/100);
        if(s == 0) {
          rgb.r = rgb.g = rgb.b = v;
        } else {
          var t1 = v;
          var t2 = (255-s)*v/255;
          var t3 = (t1-t2)*(h%60)/60;
          if(h==360) h = 0;
          if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
          else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
          else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
          else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
          else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
          else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
          else {rgb.r=0; rgb.g=0;	rgb.b=0}
        }
        return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
        default: return;
      }
    }
  };

})( jQuery, ThemeBot, window, document );
