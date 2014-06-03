PWG.PhaserText = function() {
	var module = {};
	
	function Controller(config) {
		// trace('TextController['+config.name+']/constructor, config = ', config);
		this.name = config.name;
		this.config = config;
		
		var phaser = PhaserGame.phaser;
		
		this.view = phaser.add.text(config.x, config.y, config.text, config.style);

		PWG.Initializer.setViewAttributes(config.attrs, this.view);

		if(config.centerX) {
			var newX = PWG.Stage.gameW/2 - this.view.width/2;
			this.view.x = newX;
		}
		if(config.centerY) {
			var newY = PWG.Stage.gameH/2 - this.view.height/2;
			this.view.y = newY;
		}
	}

	Controller.prototype.setText = function(text) {
		this.view.setText(text);
		if(this.config.centerX) {
			var newX = PWG.Stage.gameW/2 - this.view.width/2;
			this.view.x = newX;
		}
	};
	
	PWG.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller;
	return module;
}();