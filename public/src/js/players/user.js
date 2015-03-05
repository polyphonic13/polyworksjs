var PWG = PWG || {};
PWG.User = function() {
	"use strict";

	var module = {};
	
	module.localStorageKey = 'pwgUser';
	
	var _data = {
		isFirstPlay: true,
		needsGameOverMessage: true,
		needsPlayerStatMessage: true,
		players: {},
		tournaments: {}
	};
	
	module.init = function(cb, storageKey) {
		module.localStorageKey = storageKey || module.localStorageKey;
		var savedData = PWG.Storage.get(module.localStorageKey);
		
		if(typeof(savedData) !== 'undefined') {
			_data = PWG.Utils.extend(_data, savedData);
		}
		// trace('User/init, _data = ', _data);
		if(cb) {
			cb.call(module, _data);
		}
	};

	module.get = function(key) {
		return _data[key];
	};

	module.getData = function() {
		return _data;
	};
	
	module.set = function(key, value) {
		if(key === 'players' && _data.players) {
			_data.players = PWG.Utils.extend(_data.players, value);
		} else {
			_data[key] = value;
		}
		_saveData();
	};
	
	function _saveData() {
		// trace('User/_saveData, _data = ', _data);
		var params = {};
		params[module.localStorageKey] = _data;
		PWG.Storage.set(params);
	}
	
	return module;
}();