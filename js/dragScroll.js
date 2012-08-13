/**
 * jQuery Drag and Scroll
 *
 * Copyright (c) 2012 Ryan Naddy (ryannaddy.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($){
	var down = false;
	var prevX = 0;
	var prevY = 0;
	var x = 0;
	var y = 0;
	var px = 0;
	var py = 0;
	var lastPX = -1;
	var lastPY = -1;
	var $target = null;
	var $me = null;
	var $selector = "";
	var settings = {
		mouseButton: 3,
		context: false,
		selectText: false
	};
	$.fn.dragScroll = function(options){
		settings = $.extend(settings, options);
		$selector = $(this).selector;
		$(this).contextmenu(function(){
			return false;
		}).bind("mousedown touchstart", function(e){
			$me = $(this);
			e = event.touches ? event.touches[0] : e;
			$target = $(e.target);
			$target = $target.closest($selector);
			if(settings.viewPort){
				if(!settings.context){
					$me.contextmenu(function(){
						return false;
					});
				}
			}
			if(!settings.selectText){
				$me.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
			}
			$me = $me.closest($selector);
			if($target && $me.attr("id") != $target.attr("id")){
				return false;
			}
			if(e.which == settings.mouseButton || event.touches){
				$me.css("cursor", "move");
				down = true;
			}
			px = $me.scrollLeft();
			py = $me.scrollTop();
			x = px + e.pageX;
			y = py + e.pageY;
			prevX = x;
			prevY = y;
			return true;
		}).bind("mouseup touchend", function(e){
			$me = $(this);
			e = event.touches ? event.touches[0] : e;
			$me.css("cursor", "auto");
			down = false;
		}).bind("mousemove touchmove", function(e){
			$me = $(this);
			$me = $me.closest($selector);
			e = event.touches ? event.touches[0] : e;
			if((e.which == settings.mouseButton || event.touches) && down){
				if(event.touches){
					event.preventDefault();
				}
				if($target && $me.attr("id") != $target.attr("id")){
					return false;
				}
				$me.css("cursor", "move");
				px = $me.scrollLeft();
				py = $me.scrollTop();
				x = px + e.pageX;
				y = py + e.pageY;
				$me.scrollLeft(px + (-(x - prevX)));
				$me.scrollTop(py + (-(y - prevY)));

				prevX = x - (x - prevX);
				prevY = y - (y - prevY);
				if(lastPX == px)
					prevX = x;
				if(lastPY == py)
					prevY = y;
				lastPX = px;
				lastPY = py;
			}
			return true;
		});
		return this;
	}
})(jQuery);