(function( jQuery, window ) {

	CSS = 'body {\
		margin: 0;\
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\
	}\
\
	h1, h2, h3, h4, h5, h6 {\
		font-family: "Bitstream", "Helvetica Neue", Helvetica, Arial, sans-serif;\
		font-weight: normal;\
		color: #FA9403;\
	}\
\
	h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\
		color: inherit;\
		text-decoration: none;\
	}\
\
	h1 a:hover, h2 a:hover, h3 a:hover, h4 a:hover, h5 a:hover, h6 a:hover,\
	h1 a:active, h2 a:active, h3 a:active, h4 a:active, h5 a:active, h6 a:active,\
	h1 a:visited, h2 a:visited, h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {\
		text-decoration: underline;\
		color: inherit;\
	}';
	
	ThemeBot = function(){
		this.init();
	};
	ThemeBot.prototype = {
		init: function() {
			//initialize UI elements
			this.initUI();
			
			//build panel and bind form elements and draggables
			this.panel();
			
			//parse CSS
			this.parse();
		},
		
		$panel: "#tmb-side-bar",
		
		setPanel: function() {
			this.$panel = $( this.panel );
		},
		
		spec: {},
		
		styleMap: {},
		
		controls: [],
		
		initUI: function() {
			
		},
		
		parse: function() {
			var regex = /([\.\#\>\s\:\,A-z0-9]*)\{\s*([A-z\-]*\:\s*[^\}]*\s*\;\s*)*\s*\}/g;
			
			matches = regex.exec( CSS );
		},
		
		panel: function() {
			this.$panel = $( this.$panel );
			
			var group, control,
				$group, $control;
			
			for ( var label in this.spec ) {
				group = this.spec[ label ];
				$group = $( '<fieldset><legend>' + label + '</legend></fieldset>' );
				for ( var idx in group ) {
					$group.append( this.createControl( idx, group[ idx ] ) );
				}
				this.$panel.append( $group );
			}
		},
		
		createControl: function( name, props ) {
			var $control;
			
			switch ( name ) {
				case 'background-color':
				case 'color':
					$control = $( '<label>' + name + '</label><br /><input class="' +
						name + '" data-selector="' + props.selector + '" /><br/>' );
					break;
				case 'text-shadow':
					$control = $( '<label>' + name + '</label><br /><input class="' +
						name + '" data-selector="' + props.selector + '" /><br/>' );
					break;
				case 'border-radius':
					$control = $( '<label>' + name + '</label><br /><input class="' +
						name + '" data-selector="' + props.selector + '" /><br/>' );
					break;
				case 'font-family':
					$control = $( '<label>' + name + '</label><br /><input class="' +
						name + '" data-selector="' + props.selector + '" /><br/>' );
					break;
				default:
					break;
			}
			
			return $control;
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