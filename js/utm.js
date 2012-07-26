(function( jQuery, UI, window ) {

	var UTM = function(){
		this.init();
	};
	UTM.prototype = {
		init: function() {
			//read in styleMap and bind everything accordingly
			//initialize UI elements
		},
		
		styleMap: {},
	};
	UTM.extend = function( props ) {
		var SubClass = function() {
			UTM.call( this );
		}
		SubClass.prototype = $.extend( UTM, props );
		
		return SubClass;
	};
	
})( jQuery, UI, window )