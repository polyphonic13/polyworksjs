Polyworks.PhaserTime = (function() {
	var _phaser;
	var _timers = {};
	module = {};
	
	module.init = function(phaser) {
		_phaser = phaser;
	};
	
	module.add = function(timer, time, callback, context) {
		var t = timer || _phaser.time.events;
		t.add(time, callback, context);
	};

	module.repeat = function(timer, time, iterations, callback, context) {
		var t = timer || _phaser.time.events;
		t.repeat(time, iterations, callback, context);
	};
	
	module.loop = function(timer, interval, callback, context) {
		var t = timer || _phaser.time.events;
		t.loops(interval, callback, context);
	};
	
	module.getTimer = function(id) {
		return _timers[id];
	};
	
	function Controller(id) {
		this.timer = _phaser.time.create(false);
		_timers[id] = this.timer;
	}
	
	Controller.start = function() {
		this.timer.start();
	};
	
	Controller.add = function(time, callback, context) {
		module.add(this.timer, time, callback, context);
	};
	
	Controller.loop = function(time, callback, context) {
		module.loop(this.timer, time, callback, context);
	};
	
	Controller.repeat = function(time, callback, context) {
		module.repeat(this.timer, time, callback, context);
	};

	module.Controller = Controller;
	
	return module;
}());