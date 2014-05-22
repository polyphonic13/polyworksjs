Polyworks.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		// trace('SpriteController['+config.name+']/constructor, config = ', config);
		this.name = config.name;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);

		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);

		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.view, this.name);
		}
	}

	Polyworks.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}());