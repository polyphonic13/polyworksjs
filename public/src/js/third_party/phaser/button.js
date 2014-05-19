Polyworks.PhaserButton = (function() {

	var module = {};

	function Controller(config) {
		trace('ButtonController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.button(config.x, config.y, config.img, config.callback, config.context, config.frames[0], config.frames[0], config.frames[1], config.frames[0]);
		this.view.width = config.width;
		this.view.height = config.height;

		Initializer.setViewAttributes(config.attrs, this.view);
	}

	Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}());