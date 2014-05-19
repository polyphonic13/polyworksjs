Polyworks.PhaserSprite = (function() {

	var module = {};

	function Controller(config) {
		trace('SpriteController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);
		this.view.width = config.width;
		this.view.height = config.height;
		
		Polyworks.Utils.each(
			config.attrs,
			function(attr, key) {
				this.view[key] = attr;
			},
			this
		);
		
		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.view, this.id);
		}
	}

	Controller.prototype.hide = function() {
		trace('SpriteController['+this.id+']/hide');
		this.view.visible = false;
	};
	
	Controller.prototype.show = function() {
		this.view.visible = true;
	};
	
	Controller.prototype.destroy = function() {
		trace('SpriteController['+this.id+']/destroy');
		this.view.destroy();
	};
	
	module.Controller = Controller;
	
	return module;
}());