PWG.PhaserGroup = function() {
	var module = {};
	
	function Controller(config) {
		// trace('GroupController['+config.name+']/constructor, views = ', config.views);
		this.name = config.name;
		this.config = config;
		this.view = PWG.Game.phaser.add.group();

		PWG.Initializer.setViewAttributes(config.attrs, this.view);

		// create children collection
		this.children = PWG.DisplayFactory.createPhaserViews(config.views);
		// trace('\tchildren = ', this.children);

		// loop through children collection and add to group
		PWG.Utils.each(
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
		PWG.Utils.each(
			this.children,
			function(child) {
				delete this.children[child];
			}
		)
	};

	PWG.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}();