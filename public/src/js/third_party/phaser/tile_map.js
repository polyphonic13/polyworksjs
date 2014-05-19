Polyworks.PhaserTileMap = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TileMapController['+config.id+']/constructor, views = ', config.views);
		this.id = config.id;
		this.config = config;

		this.view = PhaserGame.phaser.add.tilemap();
		this.view.addTilesetImage(config.img);

		Initializer.setViewAttributes(config.attrs, this.view);
	}

	Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}());