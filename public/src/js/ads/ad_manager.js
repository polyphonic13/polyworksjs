var PWG = PWG || {};
PWG.AdManager = function(module) {
	var _controllers = [];
	var Systems = {
		TRE_SENSA: 'TGSAdapter'
	};
	var _systemKeys = Object.keys(Systems);
	
	function Controller(idx, type, config) {
		this.idx = idx;
		this.type = type;
		this.config = config;
	}
	
	Controller.prototype.callback = function(event) {
		trace('AdsController['+this.idx+']/callback, type = ' + event.type + ', event = ', event);
		if(this[event.type] instanceof Function) {
			this[event.type].call(this, event);
		}
	};
	
	Controller.prototype.turnStarted = function(params) {
		
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
		_controllers.push(controller);
		return controller;
	};
	
	module.Systems = Systems;
	
	return module;
}(PWG.AdManager || {});