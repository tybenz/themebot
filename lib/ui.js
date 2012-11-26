$(function() {
  UI.resize();

  $( window ).resize( UI.resize );
});

var UI = {
  resize: function() {
    var $sidebar = $( '#tmb-side-bar' ),
      $preview = $( '#tmb-preview' ),
      winHeight = $( window ).height(),
      controlBarHeight = $( '#tmb-control-bar' ).outerHeight(),
      topbarHeight = $( '#tmb-top-bar' ).outerHeight(),
      sidebarPadding = parseInt( $sidebar.css( 'padding-top' ) ) +
        parseInt( $sidebar.css( 'padding-bottom' ) ),
      previewPadding = parseInt( $preview.css( 'padding-top' ) ) +
        parseInt( $preview.css( 'padding-bottom' ) );

    $sidebar.height( winHeight - sidebarPadding - topbarHeight );
    $preview.height( winHeight - previewPadding - controlBarHeight - topbarHeight );
  }
};
