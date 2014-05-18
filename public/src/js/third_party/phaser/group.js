Polyworks.PhaserGroup = (function() {
	var module = {};
	
	function Controller(config) {
		trace('GroupController['+config.id+']/constructor, views = ', config.views);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.group();
		
		// set any group attributes
		Polyworks.Utils.each(
			config.attrs,
			function(attr, key) {
				this.group[key] = attr;
			},
			this
		);
		
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
	
	module.Controller = Controller; 
	
	return module;
}());