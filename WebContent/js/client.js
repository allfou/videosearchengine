$(function () {
	var videoList = '';
	var isFirstSearch = false;
	
    $('.search').keypress(function (e) {
        if (e.which == 13) {
            $('.searchcontainer .btn.check').click();
            return false;
        }
    });
    $('.searchcontainer .btn.check').on('click', function(){
    	$('.enter-keywords').hide();
    	$('.sub-info').html("");
        $('.loading').slideShow(200);                
		// if no keywords specified
	    if ($('.search').val() == ''){
			$('.loading').slideHide(100, function(){$('.loading').hide();});										
	    	$('.vid-not-found').hide();        
	    	$('.enter-keywords').slideShow();
		// Search for videos
		} else {				               		
			$('.extractcontainer').slideShow(200); 
			var encodedKeywords = encodeURIComponent($('.search').val());
			var url_search = '/VideoSearch/videosearch/search/' + encodedKeywords;
	        $.ajax({
	            url: url_search,
	            success: function(data){
	                $('.loading').slideHide(100, function(){$('.loading').hide();});					                
	                
					if(data) {						
						videoList = data; // Store video list						
						buildResultList(data); // Populate result list	
						isFirstSearch = true;
	                } else {
						$('.enter-keywords').hide();
	                    $('.vid-not-found').slideShow();                	
						alert('no result found');
	                }					
				}
	        });
		}
    });    
    
    $('.extract').keypress(function (e) {
        if (e.which == 13) {
            $('.extractcontainer .btn.check').click();
            return false;
        }
    });
    $('.extractcontainer .btn.check').on('click', function(){                       
		// if no keywords specified
	    if ($('.search').val() == ''){
			$('.loading').slideHide(100, function(){$('.loading').hide();});										
	    	$('.vid-not-found').hide();        
	    	$('.enter-keywords').slideShow();
		// Extract content from videos
		} else {		
			var encodedKeywords = encodeURIComponent($('.extract').val());
			if (!isFirstSearch) // rebuilt search list
				buildResultList(videoList);
				
			for (var i=0; i < videoList.video_id.length; i++) {
				extract(videoList.video_id[i].id.videoId, encodedKeywords, i);		
			}
			
			isFirstSearch = false;
		}
    });	    
    
    function extract(videoid, kewords, port) {
		var url_extract = '/VideoSearch/videosearch/extract/' + videoid + '/' + kewords + '/' + port;		
		$('#'+videoid).html("");
		$('#'+videoid).addClass("spinner");		
				
        $.ajax({
            url: url_extract,
            success: function(data){
            	$('#'+videoid).removeClass("spinner");            	            	
            	var extractListHtml = '';
            	var currentCell = $('#'+videoid).closest('.videoListEntry').show();
            	            	
        		if (data.search_result.length == 0) {        			        			
        			extractListHtml += ' no result found...';
        			currentCell.slideHide(500, function(){currentCell.remove();});	
        		} else {
                	for (var i=0; i < data.search_result.length; i++) { 
                		var index = data.search_result[i].indexOf(":") + 4;
                		var timeline = data.search_result[i].substring(0, index);
                		var textline = data.search_result[i].substring(index);
                		var timevalue = data.search_result[i].substring(0, index - 1);
                		var a = timevalue.split(':')
                		// minutes are worth 60 seconds. Hours are worth 60 minutes.
                		var seconds = (+a[0]) * 60 + (+a[1]); 
                		extractListHtml += '<a href="javascript:void callPlayer (\''+videoid+ '_embedded\',\'seekTo\', \''+seconds+'\')\">' + timeline + '</a> ' + textline + '...<br>';
                	}           			
        		}             	        	
            	$('#'+videoid).html(extractListHtml);
            },
            error: function(data) {
            	$('#'+videoid).removeClass("spinner");
            	$('#'+videoid).html('no data found');
            }
        });
    }      
    
    (function(win) {
        'use strict';

        var targets = $('[rel~=tooltip]'),
            target  = false,
            tooltip = false,
            tip;

        targets.on('mouseover', function() {
            target  = $(this);
            tip     = target.attr('title');
            tooltip = $('<div class="tooltip"></div>');

            if (!tip || tip === '') {
                return false;
            }

            target.removeAttr('title');
            tooltip.css('opacity', 0).html(tip).appendTo('body');

            var initTooltip = function() {
                if ($(win).width() < tooltip.width() * 1.5) {
                    tooltip.css('max-width', $(win).width() / 2);
                } else {
                    tooltip.css('max-width', 340);
                }

                var posLeft = target.offset().left + (target.width() / 2) - (tooltip.width() / 2),
                    posTop = target.offset().top - tooltip.height() - 20;

                if (posLeft < 0) {
                    posLeft = target.offset().left + target.width() / 2 - 20;
                    tooltip.addClass('left');
                } else {
                    tooltip.removeClass('left');
                }

                if (posLeft + tooltip.width() > $(win).width()) {
                    posLeft = target.offset().left - tooltip.width() + target.width() / 2 + 20;
                    tooltip.addClass('right');
                } else {
                    tooltip.removeClass('right');
                }

                if (posTop < 0) {
                    posTop = target.offset().top + target.height();
                    tooltip.addClass('top');
                } else {
                    tooltip.removeClass('top');
                }

                tooltip.css({
                    left: posLeft,
                    top: posTop
                }).animate({
                    translateY: '10px',
                    opacity: 1
                }, 50);
            };

            initTooltip();
            $(win).resize(initTooltip);

            var removeTooltip = function() {
                tooltip.animate({
                    translateY: '-10px',
                    opacity: 0
                }, 50, 'linear', function() {
                    $(this).remove();
                });

                target.attr('title', tip);
            };

            target.on('mouseout', removeTooltip);
            tooltip.on('click', removeTooltip);
        });
    }(window));

});

$.fn.slideShow = function (duration) {
    this.show();
    this.css({opacity: 0});
    this.animate({
        opacity: 1
    }, duration, 'ease-out');
};

$.fn.slideHide = function (duration, cb) {
    var _this = this;
    this.show();
    this.css({opacity: 1});
    this.animate({
        opacity: 0
    }, duration, 'ease-out', function(){
        if(!!cb){
            cb();
        }
    });
};

//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
(function($, undefined){
    var prefix = '', eventPrefix,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
        testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming, transitionDelay,
        animationName, animationDuration, animationTiming, animationDelay,
        cssReset = {}

    function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

    $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
            eventPrefix = event
            return false
        }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
            cssReset[transitionDelay    = prefix + 'transition-delay'] =
                cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
                    cssReset[animationName      = prefix + 'animation-name'] =
                        cssReset[animationDuration  = prefix + 'animation-duration'] =
                            cssReset[animationDelay     = prefix + 'animation-delay'] =
                                cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function(properties, duration, ease, callback, delay){
        if ($.isFunction(duration))
            callback = duration, ease = undefined, duration = undefined
        if ($.isFunction(ease))
            callback = ease, ease = undefined
        if ($.isPlainObject(duration))
            ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
        if (duration) duration = (typeof duration == 'number' ? duration :
            ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        if (delay) delay = parseFloat(delay) / 1000
        return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function(properties, duration, ease, callback, delay){
        var key, cssValues = {}, cssProperties, transforms = '',
            that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
            fired = false

        if (duration === undefined) duration = $.fx.speeds._default / 1000
        if (delay === undefined) delay = 0
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
            cssValues[animationDelay] = delay + 's'
            cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd
        } else {
            cssProperties = []
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
                cssValues[transitionDelay] = delay + 's'
                cssValues[transitionTiming] = (ease || 'linear')
            }
        }

        wrappedCallback = function(event){
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback)
            } else
                $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

            fired = true
            $(this).css(cssReset)
            callback && callback.call(this)
        }
        if (duration > 0){
            this.bind(endEvent, wrappedCallback)
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired
            setTimeout(function(){
                if (fired) return
                wrappedCallback.call(that)
            }, ((duration + delay) * 1000) + 25)
        }

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function() {
            that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
    }

    testEl = null
})(Zepto);

function playVideoAtFrame (videoid, frame){
	$('#'+videoid+'_embedded')[0].src += "&autoplay=1"; // t=0m12s
}

function callPlayer(frame_id, func, args, timevalue) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }
    if (iframe) {
        // Frame exists, 
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": [args,true] || [],
            "id": frame_id
        }), "*");
    }
}

function buildResultList(data) {
	var searchListHtml = '';
	for (var i=0; i < data.video_id.length; i++) {
		searchListHtml += '<div class=\"videoListEntry\">';
		searchListHtml += '<span class=\"video\"><iframe id=\"' + data.video_id[i].id.videoId + '_embedded\" width=\"210\" height=\"120\" src=\"//www.youtube.com/embed/' + data.video_id[i].id.videoId + '?enablejsapi=1\" frameborder=\"0\"></iframe></span>'		
		searchListHtml += '<span class=\"lines\" id=\"' + data.video_id[i].id.videoId + '\"></span>';
		searchListHtml += '</div>';
	}
	$('.sub-info').html(searchListHtml);	
}