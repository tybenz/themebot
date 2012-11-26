/**
 * wp-drag-tracker.js - version 0.1 - WebPro Release 0.1
 *
 * Copyright (c) 2012. Adobe Systems Incorporated.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Adobe Systems Incorporated nor the names of its
 *     contributors may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

// A component class that handles the DOM events necessary to simulate someone dragging
// an element on screen. Developers can either derive from this class and define the following
// methods:
//
//    DerivedClass.prototype.dragStart  = function( dx, dy ) { ... };
//    DerivedClass.prototype.dragUpdate = function( dx, dy ) { ... };
//    DerivedClass.prototype.dragStop   = function( dx, dy ) { ... };
//
// Or, they can simply create an instance of this class and pass in some callback handlers:
//
//		var dt = new DragTracker( someElement, {
//				dragStart:  function( tracker, dx, dy ) { ... },
//				dragUpdate: function( tracker, dx, dy ) { ... },
//				dragStop:   function( tracker, dx, dy ) { ... },
//			});
//
// It should be noted that this class does *NOT* move anything on screen. It merely tracks
// when the mouse goes down on a specific element, and then it dispatches the x/y position
// of the mouse, as it moves, relative to the point at which the mouse was clicked. This
// class was meant to encapsulate the event code that every developer writes/re-writes
// whenever they implement drag & drop, or selection marquee/outline/movement.

var ThemeBot = ThemeBot || {};

(function( $, ThemeBot, window ) {

  ThemeBot.DragTracker = function( element, options ) {
    var self = this;

    this.element = element;

    this.options = $.extend( {}, ThemeBot.DragTracker.prototype.defaultOptions, options );
    this.dragStarted = false;
    this.enabled = true;

    this.mdFunc = function( e, data ) { return self._startDrag( e, data); };
    this.mmFunc = function( e, data ) { return self._handleDrag( e, data); };
    this.muFunc = function( e, data ) { return self._stopDrag( e, data); };

    this.startX = 0;
    this.startY = 0;

    $( element ).bind( this.options.startEvent, this.mdFunc );
  };

  $.extend( ThemeBot.DragTracker.prototype, {
    defaultOptions: {
      dragThreshold: 5,         // Must exceed this many pixels in any direction to start drag.
      ignoreX: false,           // If true don't report any changes in the x-direction.
      ignoreY: false,           // If true don't report any changes in the y-direction.
      dragStart: null,          // callback
      dragUpdate: null,         // callback
      dragStop: null,           // callback
      startEvent: "mousedown",  // Event that triggers the installation of drag handlers.
      updateEvent: "mousemove", // Event that triggers drag update events.
      stopEvent: "mouseup"      // Event that triggers the end of a drag.
    },

    enable: function() {
      this.enabled = true;
    },

    disable: function() {
      this.enabled = false;
      this._removeDragHandlers();
    },

    dragStart: function( dx, dy ) {
      // Base class implementation simply calls
      // any callback defined.

      var o = this.options;
      if ( o.dragStart ) {
        o.dragStart( this, dx, dy );
      }
    },

    dragUpdate: function( dx, dy ) {
      // Base class implementation simply calls
      // any callback defined.

      var o = this.options;
      if ( o.dragUpdate ) {
        o.dragUpdate( this, dx, dy );
      }
    },

    dragStop: function( dx, dy ) {
      // Base class implementation simply calls
      // any callback defined.

      var o = this.options;
      if ( o.dragStop ) {
        o.dragStop( this, dx, dy );
      }
    },

    _installDragHandlers: function() {
      var opts = this.options;
      $( document )
      .bind( opts.updateEvent, this.mmFunc )
      .bind( opts.stopEvent, this.muFunc );
    },

    _removeDragHandlers: function() {
      var opts = this.options;
      $( document )
      .unbind( opts.updateEvent, this.mmFunc )
      .unbind( opts.stopeEvent, this.muFunc );
    },

    _getPageOffset: function( ele ) {
      return $( ele ).offset();
    },

    _startDrag: function( e, data ) {
      if ( !this.enabled ) {
        return;
      }

      this.dragStarted = false;
      this.startX = e.pageX;
      this.startY = e.pageY;

      this._installDragHandlers();

      return false;
    },

    _handleDrag: function( e, data ) {
      var dx = e.pageX - this.startX,
      dy = e.pageY - this.startY,
      o = this.options;

      if ( !this.dragStarted ) {
        if ( ( !o.ignoreX && Math.abs( dx ) < o.dragThreshold ) && ( !o.ignoreY && Math.abs( dy ) < o.dragThreshold ) ) {
          return false;
        }

        this.dragStarted = true;

        this.dragStart( 0, 0 );
      }

      this.dragUpdate( o.ignoreX ? 0 : dx, o.ignoreY ? 0 : dy );

      return false;
    },

    _stopDrag: function( e, data ) {
      this._removeDragHandlers();

      if ( this.dragStarted ) {
        var dx = e.pageX - this.startX,
        dy = e.pageY - this.startY,
        o = this.options;

        this.dragStop( o.ignoreX ? 0 : dx, o.ignoreY ? 0 : dy );
      }

      this.dragStarted = false;

      return false;
    }
  });

})( jQuery, ThemeBot, window );
