Polyworks.ScreenManager = (function() {

	var module = {};
	
	function ScreenController(config) {
		this.config = config;
	};
	
	ScreenController.activate = function() {
		
	};
	
	module.ScreenController = ScreenController;
	
	module.init = function(config) {
		this.config = config;
		this.screens = {};
		this.currentScreen = '';
		
		Polyworks.Utils.each(
			config.screens,
			function(s) {
				this.screens[s.type] = new this.ScreenController(s);;
			},
			this
		);
	};
	
	module.changeScreen = function(id) {
		if(this.currentScreen !== id) {
			if(this.screens.hasOwnProperty(id)) {
				this.screens[id].activate();
			}
		}
	};
	
	return module;
}());