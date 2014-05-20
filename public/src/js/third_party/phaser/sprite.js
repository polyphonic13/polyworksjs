Polyworks.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		// trace('SpriteController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);

		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);

		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.view, this.id);
		}
	}

	Polyworks.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}());