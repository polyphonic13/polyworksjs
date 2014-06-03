PWG.PhaserSprite = function() {

	var module = {};

	function Controller(config) {
		// trace('SpriteController['+config.name+']/constructor, config = ', config);
		this.name = config.name;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);

		PWG.Initializer.setViewAttributes(config.attrs, this.view);

		if(config.input) {
			this.inputController = new PWG.PhaserInput.InputController(config.input, this.view, this.name);
		}
	}

	PWG.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	
	return module;
}();