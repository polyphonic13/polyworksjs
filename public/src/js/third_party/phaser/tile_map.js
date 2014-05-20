Polyworks.PhaserTileMap = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TileMapController['+config.id+']/constructor, views = ', config.views);
		this.id = config.id;
		this.config = config;
		
		var phaser = PhaserGame.phaser;
		this.view = phaser.add.tilemap();
		this.view.addTilesetImage(config.img);

		if(config.layers) {
			this.layers = {};
			Polyworks.Utils.each(
				config.layers,
				function(layer) {
					trace('\tmaking layer['+layer.id+']: ', layer);
					this.layers[layer.id] = this.view.create(layer.id, layer.xCells, layer.yCells, layer.cellW, layer.cellH);
				},
				this
			);
		}
		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);
	}

	Polyworks.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}());