PWG.TilemapManager = function() {
	var module = {};

	function TilemapController(config) {
		this.config = config;
		this.layers = {};
		this.map = null;
		
		switch (config.type) {
			case TilemapTypes.DATA:
			this.addDataTilemap();
			break;

			case TilemapTypes.JSON: 
			this.addJsonTilemap();
			break;
			
			default:
			trace('ERROR unknown tile map type: ' + map.type);
			break;
		}
		
		if(this.map !== null) {
			if(this.config.image) {
				this.addImage(this.config.image);
			}
			if(this.config.layers) {
				this.addLayers(this.config.layers);
			}
		}
	}
	
	TilemapController.prototype.addDataTilemap = function() {
		this.map = PWG.Game.phaser.add.tilemap();
	};
	
	TilemapController.prototype.addJsonTilemap = function() {
		trace('TilemapController, creating map with: ' + this.config.json);
		this.map = PWG.Game.phaser.add.tilemap(this.config.json);
	};
	
	TilemapController.prototype.addImage = function(image) {
		trace('\tadding image: ' + image.jsonName + '/' + image.reference);
		this.map.addTilesetImage(image.jsonName, image.reference);
	};
	
	TilemapController.prototype.addLayers = function(layers) {	

		PWG.Utils.each(
			layers,
			function(lyr, key) {
				trace('\tadding layer['+key+']: ', lyr);
				if(this.config.type === TilemapTypes.DATA) {
					this.layer = this.map.createBlankLayer(key, lyr.width, lyr.height, lyr.tileW, lyr.tileH, lyr.group);

					if(lyr.tiles) {
						this.addTiles(lyr.tiles, layer);
					}
					
					if(lyr.resizeWorld) {
						layer.resizeWorld();
					}
					

				} else if(this.config.type === TilemapTypes.JSON) {
					this.layers[key] = this.map.createLayer(key);
				}
				this.layers[key].scrollFactorX = lyr.scrollFactorX;
				this.layers[key].scrollFactorY = lyr.scrollFactorY;

			},
			this
		);
	};

	TilemapController.prototype.addTiles = function(tiles, layer) {
		PWG.Utils.each(
			tiles,
			function(tile) {
				this.map.putTile(tile.imgIndex, tile.xCell, this.yCell, layer);
			},
			this
		);
	};
	
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

	};

	return module;
}();
