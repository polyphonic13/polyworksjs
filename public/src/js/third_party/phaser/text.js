Polyworks.PhaserText = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TextController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		
		var phaser = PhaserGame.phaser;
		
		var x = (config.centerX) ? phaser.world.centerX : config.x;
		var y = (config.centerY) ? phaser.world.centerY : config.y;
		trace('\t\t\tx is = ' + x);
		this.view = phaser.add.text(x, y, config.text, config.style);
	}

	Controller.prototype.setText = function(text) {
		this.view.setText(text);
	};
	
	Controller.prototype.destroy = function() {
		trace('TextController['+this.id+']/destroy');
		this.view.destroy();
	};
	
	module.Controller = Controller;
	return module;
}());