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
				this.view[key] = attr;
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
	
	Controller.prototype.hide = function() {
		this.view.visible = false;
	};
	
	Controller.prototype.show = function() {
		this.view.visible = true;
	};
	
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

	Controller.prototype.destroy = function() {
		trace('GroupController['+this.id+']/destroy');
		this.view.destroy(true);
	};
	
	module.Controller = Controller; 
	
	return module;
}());