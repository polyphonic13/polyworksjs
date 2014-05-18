Polyworks.PhaserText = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TextController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		
		var phaser = PhaserGame.phaser;
		
		this.view = phaser.add.text(config.x, config.y, config.text, config.style);

		Polyworks.Utils.each(
			config.attrs,
			function(attr, key) {
				this.view[key] = attr;
			},
			this
		);

		if(config.centerX) {
			var newX = Polyworks.Stage.gameW/2 - this.view.width/2;
			this.view.x = newX;
		}
		if(config.centerY) {
			var newY = Polyworks.Stage.gameH/2 - this.view.height/2;
			this.view.y = newY;
		}
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