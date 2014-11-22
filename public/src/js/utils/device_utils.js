PWG.DeviceUtils = function() {
	var ua = navigator.userAgent.toLowerCase();
	var _fullScreenExitCallbacks = [];
	
	if (document.addEventListener)
	{
	    document.addEventListener('webkitfullscreenchange', exitHandler, false);
	    document.addEventListener('mozfullscreenchange', exitHandler, false);
	    document.addEventListener('fullscreenchange', exitHandler, false);
	    document.addEventListener('MSFullscreenChange', exitHandler, false);
	}

	var module = {
		isFullScreen: false,
		browsers: {
			IPHONE: 'Iphone',
			ANDROID: 'Android',
			CHROME: 'Chrome',
			SAFARI: 'Safari',
			FIREFOX: 'Firefox',
			OPERA: 'Opera',
			IE: 'IE'
		},
		isMobile: function() {
			return ua.match(/iphone|ipad|android/);
		},
		isIphone: function() {
			return ua.match(/iphone/);
		},
		isAndroid: function() {
			return ua.match(/android/);
		},
		isChrome: function() {
			return !!window.chrome && !module.isOpera(); // Chrome 1+
			// return ua.match(/chrome/);
		},
		isSafari: function() {
			return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		    // At least Safari 3+: "[object HTMLElementConstructor]"
			// return ua.match(/safari/);
		},
		isFirefox: function() {
			return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		},
		isOpera: function() {
			return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		},
		isIE: function() {
			return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
		},
		getType: function(type) {
			var method = 'is' + type;
			return module[method]();
		},
		getBrowser: function() {
			var browser = '';
			var browsers = module.browsers; 

			for(var key in browsers) {
				if(module.getType(browsers[key])) {
					browser = browsers[key];
					break;
				}
			}
			return browser;
		},
		toggleFullScreen: function() {
			var doc = window.document;
			var docEl = doc.documentElement;

			var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
				trace('requesting fullscreen');
				requestFullScreen.call(docEl);
				module.isFullScreen = true;
			}
			else {
				cancelFullScreen.call(doc);
				module.isFullScreen = false;
			}
		},
		addFullScreenExitCallback: function(callback, context, params) {
			var ctx = context || window;
			var p = params || {};
			_fullScreenExitCallbacks.push({
				callback: callback,
				context: ctx,
				params: p
			})
		}
	};
	
	function exitHandler()
	{
	    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
	    {
			module.isFullScreen = false;
			if(_fullScreenExitCallbacks.length > 0) {
				PWG.Utils.each(
					_fullScreenExitCallbacks,
					function(exitCb) {
						exitCb.callback.call(exitCb.context, exitCb.params);
					},
					module
				);
			}
	    }
	}

	return module;
}();
/*
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        tilt([event.beta, event.gamma]);
    }, true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    }, true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
    }, true);
}
*/

// compass: 
// http://stackoverflow.com/questions/16317599/android-compass-that-can-compensate-for-tilt-and-pitch