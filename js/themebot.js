(function ( jQuery, window ) {

	$(function() {
		CSS = $('#style').text();
	});
	
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
		
		rules: [],
		
		pieces: [],
		
		parse: function() {
			var commentRegex = /\/\*[\s\S]*?\*\//g,
				selectorRegex = /[\.\#\>\s\:\,A-z0-9]*(?=\{)/,
				allRulesRegex = /([^:\}]*)\s*:\s*([^;\}]*)\s*;/g,
				ruleRegex = /([^:\}]*)\s*:\s*([^;\}]*)\s*;/,
				valueRegex = /[^;]*/,
				openRegex = /\s*\{\s*/,
				closeRegex = /\s*\}\s*/,
				pos, pos2, length, block,
				selector, rules, string;
				
			while ( CSS ) {
				//get comments
				pos = CSS.search( commentRegex );
				if ( pos == 0 ) {
					this._tokenize( commentRegex, 'string' );
				}
				
				//get selector
				selector = this._tokenize( selectorRegex, 'selector' );
				
				//skip open bracket
				this._tokenize( openRegex, 'string' );
				
				//get all rules within brackets
				while ( CSS.search( closeRegex ) !== 0 ) {
					this._tokenize( ruleRegex, 'rule', selector );
				}
				
				//skip closed bracket
				this._tokenize( closeRegex, 'string' );
			}
			
		},
		
		_tokenize: function( regex, type, selector ) {
			var pos = CSS.search( regex ),
				match = CSS.match( regex ),
				length = match[ 0 ].length,
				string = CSS.substr( pos, length );
				
			CSS = CSS.substring( pos + length );

			//switch type to see create the token
			switch ( type ) {
				case 'selector':
				case 'string':
					this.pieces.push({
						type: type,
						literal: string,
						formatted: $.trim( string )
					});
					return $.trim( string );
				case 'rule':
					this.pieces.push({
						selector: selector,
						literal: string,
						rule: $.trim( match[ 1 ] ),
						value: $.trim( match[ 2 ] )
					});
					return { rule: $.trim( match[ 1 ] ), value: $.trim( match[ 2 ] ) };
				default: break;
			}
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