Polyworks.PhaserGroup = (function() {
	var module = {};
	
	function Controller(config) {
		// trace('GroupController['+config.id+']/constructor, views = ', config.views);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.group();

		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);

		// create children collection
		this.children = Polyworks.DisplayFactory.createViews(config.views);
		// trace('\tchildren = ', this.children);

		// loop through children collection and add to group
		Polyworks.Utils.each(
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
		// trace('GroupController['+this.id+']/remove, children = ', this.children);
		this.view.removeAll();
		Polyworks.Utils.each(
			this.children,
			function(child) {
				delete this.children[child];
			}
		)
	};

	Polyworks.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}());