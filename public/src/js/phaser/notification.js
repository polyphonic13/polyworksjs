PWG.PhaserNotification = function() {
	var module = {};

	var _notifications = [];
	var _current = -1;
	
	function Controller(params) {
		
	};
	
	module.Controller = Controller;
	

	module.init = function() {
		
	};
	
	module.addNotification = function(config) {
		_notifications.push(config);
	};
	
	module.showAll = function() {
		module.showNotification(0);
	};
	
	module.showNotifcation = function(idx) {
		return _notifications[idx];
	};
	
	module.closeNotification = function() {
		_notifications.splice(0, 1);
		
	};
	
	return module;
}();