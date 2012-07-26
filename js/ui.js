$(function() {
	UI.resize();
	
	$( window ).resize( UI.resize );
});

var UI = {
	resize: function() {
		var $sidebar = $( '#utm-side-bar' ),
			$preview = $( '#utm-preview' ),
			winHeight = $( window ).height(),
			controlBarHeight = $( '#utm-control-bar' ).outerHeight(),
			topbarHeight = $( '#utm-top-bar' ).outerHeight(),
			sidebarPadding = parseInt( $sidebar.css( 'padding-top' ) ) +
				parseInt( $sidebar.css( 'padding-bottom' ) ),
			previewPadding = parseInt( $preview.css( 'padding-top' ) ) +
				parseInt( $preview.css( 'padding-bottom' ) );
		
		$sidebar.height( winHeight - sidebarPadding - topbarHeight );
		$preview.height( winHeight - previewPadding - controlBarHeight - topbarHeight );
	}
};