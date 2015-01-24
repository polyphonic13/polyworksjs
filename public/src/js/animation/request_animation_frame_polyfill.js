(function() {
	// MIT license
	// https://gist.github.com/paulirish/1579671
	
	/**
	 * A polyfill for requestAnimationFrame
	 * You can actually use both requestAnimationFrame and requestAnimFrame, 
	 * you will still benefit from the polyfill
	 *
	 * @method requestAnimationFrame
	 */
	/**
	 * A polyfill for cancelAnimationFrame
	 *
	 * @method cancelAnimationFrame
	 */
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
	        window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function(callback) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	          timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };
	}

	if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	    };
	}

	window.requestAnimFrame = window.requestAnimationFrame;
})();