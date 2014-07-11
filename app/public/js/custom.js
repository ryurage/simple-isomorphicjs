;!(function ($) {
	// append a text node to a selected set
	$.fn.appendText = function(text) {
	    return this.each(function() {
	        var textNode = document.createTextNode(text);
	        $(this).append(textNode);
	    });
	};
	$.fn.center = function(left, top) {
	    return this.each(function(){
	    		var el = $(this);
	    		var h = el.height();
	    		var w = el.width();
	    		var w_box = $(window).width();
	    		var h_box = $(window).height();	
	    		var w_total = left || (w_box - w)/2;
	    		var h_total = top || (h_box - h)/2;
	    		var css = {"position": 'absolute', "left": w_total+"px", "top":
	h_total+"px"};
	    		el.css(css)
	    });
	};
	$.fn.postTransition = function (callback) {
		return this.each(function() {
			$(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				callback();
			});
		});
	}
	$.fn.classes = function (callback) {
        var classes = [];
        $.each(this, function (i, v) {
            var splitClassName = v.className.split(/\s+/);
            for (var j in splitClassName) {
                var className = splitClassName[j];
                if (-1 === classes.indexOf(className)) {
                    classes.push(className);
                }
            }
        });
        if ('function' === typeof callback) {
            for (var i in classes) {
                callback(classes[i]);
            }
        }
        return classes;
    };
    $.fn.outerHTML = function(s) {
	    return s
	        ? this.before(s).remove()
	        : $("<p>").append(this.eq(0).clone()).html();
	};
	$.fn.dragAction = function ($targ, callback) {
        var $el = $(this);
        if ($el.isTouching($targ)) {
            callback($el, $targ);
        } else {
            $el.removeAttr('style');
        }
    };
    $.fn.isTouching = function(rect) {
        if (rect instanceof jQuery) {
            rect = rect[0];
        }
        var rect1 = this[0].getBoundingClientRect(),
            rect2 = rect.getBoundingClientRect();

        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);

    };
	$.extend({  // take a get or post form and submit it
        getGo: function(url, params) {
            document.location = url + '?' + $.param(params);
        },
        postGo: function(url, params) {
            var $form = $("<form>")
                .attr("method", "post")
                .attr("action", url);
            $.each(params, function(name, value) {
                $("<input type='hidden'>")
                    .attr("name", name)
                    .attr("value", value)
                    .appendTo($form);
            });
            $form.appendTo("body");
            $form.submit();
        }
    });
})(jQuery);