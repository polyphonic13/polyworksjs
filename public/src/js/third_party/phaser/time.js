Polyworks.PhaserTime = (function() {
	var _timers = {};
	module = {};
	
	module.init = function(phaser) {
		module.phaser = phaser;
	};
	
	module.add = function(timer, delay, callback, context) {
		var t = timer || module.phaser.time.events;
		t.add(delay, callback, context);
	};

	module.repeat = function(timer, time, iterations, callback, context) {
		var t = timer || module.phaser.time.events;
		t.repeat(time, iterations, callback, context);
	};
	
	module.loop = function(timer, interval, callback, context) {
		var t = timer || module.phaser.time.events;
		t.loop(interval, callback, context);
	};
	
	module.getTimer = function(id) {
		return _timers[id];
	};
	
	module.removeTimer = function(id) {
		if(_timers.hasOwnProperty(id)) {
			_timers[id].destroy();
			module.phaser.time.events.remove(_timers[id]);
			delete _timers[id];
		}
	};
	
	function Controller(id) {
		this.timer = module.phaser.time.create(false);
		_timers[id] = this.timer;
	}
	
	Controller.prototype.start = function() {
		this.timer.start();
	};
	
	Controller.prototype.pause = function() {
		this.timer.pause();
	};
	
	Controller.prototype.resume = function() {
		this.timer.resume();
	};
	
	Controller.prototype.add = function(delay, callback, context) {
		module.add(this.timer, delay, callback, context);
	};
	
	Controller.prototype.loop = function(interval, callback, context) {
		module.loop(this.timer, interval, callback, context);
	};
	
	Controller.prototype.repeat = function(time, callback, context) {
		module.repeat(this.timer, time, callback, context);
	};

	module.Controller = Controller;
	
	return module;
}());