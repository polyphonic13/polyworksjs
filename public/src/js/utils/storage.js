PWG.Storage = function() {
	var _listeners = [];
	
	var module = {};
	
	module.get = function(key) {
		if(_available) {
			if(!localStorage[key]) return;
			return JSON.parse(localStorage[key]);
		}
	};
	
	module.set = function(params) {
		if(_available) {
			// trace('Storage, about to set saved data with: ', params);
			for(var key in params) {
				if(params[key] instanceof Object || params[key] instanceof Array) {
					params[key] = JSON.stringify(params[key]);
				}
				// trace('Storage, about to set ' + key + ', to value ' + params[key]);
				localStorage[key] = params[key];
			}
		}
	};
	
	module.remove = function(prop) {
		if(_available) {
			localStorage.removeItem(prop);
		}
	};
	
	module.destroy = function() {
		// trace('Storage/destroy');
		localStorage.clear();
	};
	
	module.addListener = function(listener) {
		if(_available) {
			var attachNotAdd = false;
			if(window.addEventListener) {
				window.addEventListener('module', listener, false);
			} else {
				window.attachEvent('onmodule', listener);
				attachNotAdd = true;
			}
			_listeners.push(listener);
		}
	};
	
	module.removeListener = function(listener) {
		if(_available) {
			var length = _listeners.length;
			for(var i = 0; i < length; i++) {
				if(_listeners[i].listener === listener) {
					if(window.removeEventListener) {
						window.removeEventListener('module', listener, false);
					} else {
						window.detachEvent('onmodule', listener);
					}
					_listeners = _listeners.splice(i, 1);
					break;
				}
			}
		}
	};
	
	module.shutdown = function() {
		var length = _listeners.length;
		for(var i = 0; i < length; i++) {
			if(window.removeEventListener) {
				window.removeEventListener('module', listener, false);
			} else {
				window.detachEvent('onmodule', listener);
			}
		}
	};
	
	function _supportsLocalStorage() {
		try {
			// trace('STORAGE AVAILABLE');
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch(e) {
			// trace('STORAGE NOT AVAILABLE');
			return false;
		}
	}
	var _available = _supportsLocalStorage();
	
	return module;
}();
