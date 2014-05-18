Polyworks.PhaserText = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TextController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.view = PhaserGame.phaser.add.text(config.x, config.y, config.text, config.style);
	}

	Controller.prototype.setText = function(text) {
		this.view.setText(text);
	};
	
	Controller.prototype.destroy = function() {
		trace('SpriteController['+this.id+']/destroy');
		this.view.destroy();
	};
	
	module.Controller = Controller;
	return module;
}());