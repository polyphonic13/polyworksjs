var PWG = PWG || {};
PWG.Timer = function() {
	
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	function Controller(id) {
		this.id = id;
		this.timeout = null;
		this.interval = null;
	}
	
	Controller.prototype.start = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		var _this = this;
		this.timeout = setTimeout(function() {
			method.call(context, _this, params);
		},
		delay);
	};
	
	Controller.prototype.loop = function(delay, method, args, ctx) {
		var params = args || {};
		var context = ctx || window;
		var _this = this;
		this.interval = setInterval(function() {
			method.call(context, _this, params);
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
	
	module.add = function(id) {
		var key = id || _currentId;
		var instance = new Controller(key);
		_instances[key](instance);
		_currentId++;
		return instance;
	};
	
	module.get = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		return _instances[id];
	};
	
	module.stopAll = function() {
		PWG.Utils.each(
			_instances,
			function(instance) {
				instance.stop();
			},
			module
		);
	};

	module.remove = function(id) {
		if(_instances.hasOwnProperty(id)) {
			delete _instance[id];
		}
	};
	
	return module;
}();