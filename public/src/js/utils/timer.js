var PWG = PWG || {};
PWG.Timer = function() {
	
	var module = {};
	var _instances = [];
	
	function Controller(config) {
		this.id = _instance.length;
		this.config = config;
	}
	
	Controller.prototype.start = function(delay, method, ctx, args) {
		var context = ctx || window;
		var params = args || {};
		this.timeout = setTimeout(function() {
			method.call(context, params);
		},
		delay);
	};
	
	Controller.prototype.loop = function(delay, method, ctx, args) {
		var context = ctx || window;
		var params = args || {};
		this.interval = setInterval(function() {
			method.call(context, params);
		},
		delay);
	};
	
	Controller.prototype.stop = function() {
		if(this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		} else if(this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	};
	
	module.add = function(config) {
		var instance = new Controller(config);
		_instances.push(instance);
		return instance;
	};
	
	module.stopAll = function() {
		if(_instances.length > 0) {
			PWG.Utils.each(
				_instances,
				function(instance) {
					instance.stop();
				},
				module
			);
		}
	};

	module.get = function(id) {
		if(_instances.length < id) {
			return;
		}
		return _instances[id];
	};
	
	return module;
}();