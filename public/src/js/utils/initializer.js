Polyworks.Initializer = (function(){
	
	var module = {};
	
	module.setGlobalAttributes = function(config, controller) {
		controller.config = config;
		if(config.id) {
			controller.id = config.id;
		}
	};
	
	module.setViewAttributes = function(config, view) {
		if(config.attrs) {
			Polyworks.Utils.each(
				config.attrs,
				function(attr, key) {
					view[key] = attr;
				},
				this
			);
		}
	};
	
	return module;
}());