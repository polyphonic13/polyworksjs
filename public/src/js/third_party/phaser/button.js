Polyworks.PhaserButton = (function() {

	var module = {};

	function Controller(config) {
		trace('ButtonController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.button(config.x, config.y, config.img, config.callback, config.context, config.frames[0], config.frames[0], config.frames[1], config.frames[0]);
		this.view.width = config.width;
		this.view.height = config.height;

		Polyworks.Utils.each(
			config.attrs,
			function(attr, key) {
				this.view[key] = attr;
			},
			this
		);
	}

	Controller.prototype.destroy = function() {
		trace('ButtonController['+this.id+']/destroy');
		this.view.destroy();
	};

	Controller.prototype.hide = function() {
		trace('ButtonController['+this.id+']/hide');
		this.view.visible = false;
	};
	
	Controller.prototype.show = function() {
		this.view.visible = true;
	};
	
	module.Controller = Controller;
	
	return module;
}());