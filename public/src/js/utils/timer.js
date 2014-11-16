var PWG = PWG || {};
PWG.Timer = function() {
	
	var module = {};
	var _instances = [];
	
	function Controller() {
		this.id = _instances.length;
		this.timeout = null;
		this.interval = null;
	}
	
	Controller.prototype.start = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		this.timeout = setTimeout(function() {
			method.call(context, params);
		},
		delay);
	};
	
	Controller.prototype.loop = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		this.interval = setInterval(function() {
			method.call(context, params);
		},
		delay);
	};
	
	Controller.prototype.stop = function() {
		// trace('Timer.Controller['+this.id+']/stop, this.timeout = ' + this.timeout + ', this.interval = ' + this.interval);
		if(this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		} else if(this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	};
	
	module.Controller = Controller; 
	
	module.add = function() {
		var instance = new Controller();
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