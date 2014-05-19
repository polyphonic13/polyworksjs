Polyworks.PhaserText = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TextController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		
		var phaser = PhaserGame.phaser;
		
		this.view = phaser.add.text(config.x, config.y, config.text, config.style);

		Initializer.setViewAttributes(config.attrs, this.view);

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
		if(this.config.centerX) {
			var newX = Polyworks.Stage.gameW/2 - this.view.width/2;
			this.view.x = newX;
		}
	};
	
	Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	return module;
}());