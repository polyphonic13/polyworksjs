Polyworks.Initializer = (function(){
	
	var standardMethods = {
		hide: function() {
			this.view.visible = false;
		},
		show: function() {
			this.view.visible = true;
		},
		destroy: function() {
			this.view.destroy(true);
		}
	};
	
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
	
	module.addStandardMethods = function(controller) {
		Polyworks.Utils.each(
			standardMethods,
			function(method, key) {
				controller.prototype[key] = method;
			},
			this
		);
	};
	
	return module;
}());