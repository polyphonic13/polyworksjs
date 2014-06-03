PWG.Initializer = function(){
	
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
	
	module.setViewAttributes = function(attrs, view) {
		if(attrs) {
			PWG.Utils.each(
				attrs,
				function(attr, key) {
					view[key] = attr;
				},
				this
			);
		}
	};
	
	module.addStandardMethods = function(controller) {
		PWG.Utils.each(
			standardMethods,
			function(method, key) {
				controller.prototype[key] = method;
			},
			this
		);
	};
	
	return module;
}();