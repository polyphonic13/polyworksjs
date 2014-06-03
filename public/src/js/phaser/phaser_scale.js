PWG.PhaserScale = function() {
	var module = {};
	
	module.init = function(config) {
		// trace('PhaserScale/init, config = ', config);
		var scaleManager = PhaserGame.phaser.scale;

		if(config.fullScreen) {
			scaleManager.startFullScreen();
		}
		scaleManager.scaleMode = config.scaleMode;
		scaleManager.setShowAll();
		this.scaleManager = scaleManager;
		this.refresh();
	};
	
	module.refresh = function() {
		this.scaleManager.refresh();
	};
	
	return module;
}();