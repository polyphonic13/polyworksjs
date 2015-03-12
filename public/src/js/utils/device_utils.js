PWG.DeviceUtils = function() {
	var ua = navigator.userAgent.toLowerCase();
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	var _isFullScreen = false;
	var _fullScreenExitCallbacks = [];
	
	if (document.addEventListener) {
	    document.addEventListener('webkitfullscreenchange', exitHandler, false);
	    document.addEventListener('mozfullscreenchange', exitHandler, false);
	    document.addEventListener('fullscreenchange', exitHandler, false);
	    document.addEventListener('MSFullscreenChange', exitHandler, false);
	}

	var module = {};
	
	module.browsers = {
		IPHONE: 'Iphone',
		ANDROID: 'Android',
		CHROME: 'Chrome',
		SAFARI: 'Safari',
		FIREFOX: 'Firefox',
		OPERA: 'Opera',
		IE: 'IE'
	};

	module.isMobile = function() {
		return ua.match(/iphone|ipad|android/);
	};

	module.isIphone = function() {
		return ua.match(/iphone/);
	};

	module.isAndroid = function() {
		return ua.match(/android/);
	};

	module.isChrome = function() {
		return !!window.chrome && !module.isOpera(); // Chrome 1+
		// return ua.match(/chrome/);
	};

	module.isSafari = function() {
		return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	    // At least Safari 3+: "[object HTMLElementConstructor]"
		// return ua.match(/safari/);
	};

	module.isFirefox = function() {
		return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	};

	module.isOpera = function() {
		return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	};

	module.isIE = function() {
		return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	};

	module.getType = function(type) {
		var method = 'is' + type;
		return module[method]();
	};

	module.getBrowser = function() {
		var browser = '';
		var browsers = module.browsers; 

		for(var key in browsers) {
			if(module.getType(browsers[key])) {
				browser = browsers[key];
				break;
			}
		}
		return browser;
	};

	module.toggleFullScreen = function() {
		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			module.enterFullScreen();
		}
		else {
			module.exitFullScreen();
		}
	};

	module.enterFullScreen = function() {
		// trace('requesting fullscreen');
		if(!module._isFullScreen) {
			module._isFullScreen = true;
			requestFullScreen.call(docEl);
			// trace('device utils _isFullScreen = ' + module._isFullScreen);
		}
	};

	module.exitFullScreen = function() {
		if(module._isFullScreen) {
			module._isFullScreen = false;
			cancelFullScreen.call(doc);
		}
	};

	module.getIsFullScreen = function() {
		return _isFullScreen;
	};

	module.addFullScreenExitCallback = function(callback, context, params) {
		var ctx = context || window;
		var p = params || {};
		_fullScreenExitCallbacks.push({
			callback: callback,
			context: ctx,
			params: p
		});
	};

	function exitHandler() {
	    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
			// trace('exit fullscreen handler');
			module._isFullScreen = false;
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
    }; true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    }; true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
    }; true);
}
*/

// compass: 
// http://stackoverflow.com/questions/16317599/android-compass-that-can-compensate-for-tilt-and-pitch