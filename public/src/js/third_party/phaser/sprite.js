Polyworks.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		trace('SpriteController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);
		this.view.width = config.width;
		this.view.height = config.height;
		
		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.view, this.id);
		}
	}

	Controller.prototype.destroy = function() {
		trace('SpriteController['+this.id+']/destroy');
		this.view.destroy();
	};
	
	module.Controller = Controller;
	
	return module;
}());