PWG.PhaserButton = function() {

	var module = {};

	function Controller(config) {
		// trace('ButtonController['+config.name+']/constructor, config = ', config);
		this.name = config.name;
		this.config = config;
		this.view = PhaserGame.phaser.add.button(config.x, config.y, config.img, config.callback, config.context, config.frames[0], config.frames[0], config.frames[1], config.frames[0]);
		this.view.width = config.width;
		this.view.height = config.height;

		PWG.Initializer.setViewAttributes(config.attrs, this.view);
	}

	PWG.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}();