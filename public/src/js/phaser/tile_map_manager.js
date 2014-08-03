PWG.TilemapManager = function() {
	var module = {};

	function TilemapController(config) {
		trace('TilemapController, creating map with: ' + config.json);
		this.map = PWG.Game.phaser.add.tilemap(config.json);

		//  Add a Tileset image to the map
		trace('\tadding image: ' + config.image.jsonName + '/' + config.image.reference);
		this.map.addTilesetImage(config.image.jsonName, config.image.reference);

		if(config.layers) {
			this.layers = {};
			
			PWG.Utils.each(
				config.layers,
				function(lyr, key) {
					// var layer = this.map.createBlankLayer(key, lyr.width, lyr.height, lyr.tileW, lyr.tileH, lyr.group);
					// var layer = this.map.createLayer(key, lyr.width, lyr.height, lyr.group);
					trace('\tadding layer['+key+']: ', lyr);
					this.layers[key] = this.map.createLayer(key);
					this.layers[key].scrollFactorX = lyr.scrollFactorX;
					this.layers[key].scrollFactorY = lyr.scrollFactorY;

					// if(lyr.tiles) {
					// 	PWG.Utils.each(
					// 		lyr.tiles,
					// 		function(tile) {
					// 			this.map.putTile(tile.index, tile.x, this.y, lyr);
					// 		},
					// 		this
					// 	);
					// }
					// 
					// if(lyr.resizeWorld) {
					// 	layer.resizeWorld();
					// }
					// 
					// this.layers[key] = layer;
				},
				this
			);
		}
	}

	module.TilemapController = TilemapController; 
	
	module.build = function(maps) {
		trace('TilemapManager/build, map = ', maps);
		var tilemaps = {};
		
		PWG.Utils.each(
			maps,
			function(map, key) {
				tilemaps[key] = new TilemapController(map);
			},
			this
		);
		return tilemaps;

		// var map; 
		// 
		// switch (map.type) {
		// case TilemapTypes.DATA:
		// 	map = module.buildDataTilemap(map);
		// 	break;
		// 
		// default:
		// 	trace('ERROR unknown tile map type: ' + map.type);
		// 	break;
		// }
	};

	return module;
}();
