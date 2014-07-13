PWG.PhaserTween = function() {
	var module = {};
	
	function TweenController(config, controller) {
		this.config = config;
		this.controller = controller; 
		this.name = viewController.name; 
		
	}
	
	module.TweenController = TweenController;
	module.controllers = {};
	
	module.addTweens = function(config, view) {
		var controller = new TweenController(config, view); 
		this.controllers[controller.name] = controller;
	};
	
	
	return module;
}();