pwg.PhaserGroup = (function() {
	var module = {};
	
	function Controller(config) {
		// trace('GroupController['+config.name+']/constructor, views = ', config.views);
		this.name = config.name;
		this.config = config;
		this.view = PhaserGame.phaser.add.group();

		pwg.Initializer.setViewAttributes(config.attrs, this.view);

		// create children collection
		this.children = pwg.DisplayFactory.createPhaserViews(config.views);
		// trace('\tchildren = ', this.children);

		// loop through children collection and add to group
		pwg.Utils.each(
			this.children,
			function(child) {
				// trace('\t\tchild = ', child);
				this.view.add(child.view);
			},
			this
		);
	}
	
	Controller.prototype.remove = function(child) {
		this.view.remove(child);
		delete this.children[child];
	};
	
	Controller.prototype.removeAll = function() {
		// trace('GroupController['+this.name+']/remove, children = ', this.children);
		this.view.removeAll();
		pwg.Utils.each(
			this.children,
			function(child) {
				delete this.children[child];
			}
		)
	};

	pwg.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}());