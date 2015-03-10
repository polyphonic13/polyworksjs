var PWG = PWG || {};
PWG.AdManager = function(module) {
	var _controllers = [];
	var Systems = {
		TRE_SENSA: 'TGSAdapter'
	};
	var _systemKeys = Object.keys(Systems);
	
	function Controller(idx, type, config) {
		if(!Systems.hasOwnProperty(type)) {
			return;
		}
		// trace('AdsController/constructor, type = ' + type + ', config = ', config);
		this.idx = idx;
		this.type = type;
		// this.config = config;
		this.system = PWG[Systems[type]];

		config.callback = {
			fn: this.callback,
			ctx: this
		};

		this.system.init(config);
	}
	
	Controller.prototype.callback = function(event) {
		// trace('AdsController['+this.idx+']/callback, type = ' + event.type + ', event = ', event);
		if(this[event.type] instanceof Function) {
			this[event.type].call(this, event);
		}
	};
	
	Controller.prototype.turnStarted = function(params) {
		// trace('AdsController/turnStarted, params = ', params);
		if(params.userTurn) {
			// user is up, time to make a request
			this.system.turnStarted(params);
		}
	};
	
	Controller.prototype.turnCompleted = function(params) {
		
	};
	
	Controller.prototype.levelStarted = function(params) {
		
	};
	
	Controller.prototype.levelCompleted = function(params) {
		
	};
	
	Controller.prototype.updateData = function(params) {
		
	};
	
	Controller.prototype.gameOver = function(params) {
		
	};
	
	module.create = function(type, config) {
		if(_systemKeys.indexOf(type) === -1) {
			return;
		}
		var controller;
		controller = new Controller(_controllers.length, type, config);
		if(controller) {
			_controllers.push(controller);
		}
		return controller;
	};
	
	module.Systems = Systems;
	
	return module;
}(PWG.AdManager || {});