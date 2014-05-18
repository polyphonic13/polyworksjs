Polyworks.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		trace('SpriteController/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);
		this.view.width = config.width;
		this.view.height = config.height;
		
		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.view, this.id);
		}
	}

	Controller.prototype.show = function() {
		trace('Controller['+this.id+']/show')
	};
	
	Controller.prototype.hide = function() {
		
	};
	
	module.Controller = Controller;
	
	return module;
}());