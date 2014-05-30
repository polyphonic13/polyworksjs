pwg.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		// trace('SpriteController['+config.name+']/constructor, config = ', config);
		this.name = config.name;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);

		pwg.Initializer.setViewAttributes(config.attrs, this.view);

		if(config.input) {
			this.inputController = new pwg.PhaserInput.InputController(config.input, this.view, this.name);
		}
	}

	pwg.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}());