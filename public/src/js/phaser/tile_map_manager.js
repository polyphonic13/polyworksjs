PWG.TilemapManager = function() {
	var module = {};

	function TilemapController(config) {
		trace('TilemapController/constructor, config = ', config);
		this.config = config;
		this.layers = {};
		this.map = null;
		
		this.map = PWG.Game.phaser.add.tilemap(config.json);
		
		PWG.Utils.each(
			config.tilesets,
			function(tileset) {
				trace('\tadding tileset image: ' + tileset);
				this.map.addTilesetImage(tileset);
			},
			this
		);
		
		// this.map.addTilesetImage('caveForeground01', 'caveForeground01');
		// this.map.addTilesetImage('caveBackground02', 'caveBackground02');

		PWG.Utils.each(
			config.layers,
			function(layer, key) {
				trace('\tadding layer['+key+']: ', layer);
				this.layers[key] = this.map.createLayer(key);
				if(layer.attrs) {
					PWG.Utils.extend(this.layers[key], layer.attrs);
				}
			},
			this
		);
		// this.background = this.map.createLayer('background');
		// this.background.scrollFactorX = 0.33;
		// this.foreground = this.map.createLayer('foreground');
		// this.foreground.scrollFactorX = 0.66;

		// if(config.attrs) {
		// 	PWG.Utils.extend(this.map, config.attrs);
		// }
		// 
		// if(this.map !== null) {
		// 	if(this.config.image) {
		// 		this.addImage(this.config.image);
		// 	}
		// 	if(this.config.layers) {
		// 		this.addLayers(this.config.layers);
		// 	}
		// }
		// 
		// if(config.type === TilemapTypes.DATA && config.data) {
		// 	this.addTiles(config.data.getTiles());
		// }
	}
	
	TilemapController.prototype.addImage = function(image) {
		if(this.config.type === TilemapTypes.DATA) {
			trace('\tadding image: ' + image);
			this.map.addTilesetImage(image);
		} else if(this.config.type === TilemapTypes.JSON) {
			trace('\tadding image: ' + image.jsonName + '/' + image.reference);
			this.map.addTilesetImage(image.jsonName, image.reference);
		}
	};
	
	TilemapController.prototype.addLayers = function(layers) {	

		PWG.Utils.each(
			layers,
			function(lyr, key) {
				trace('\tadding layer['+key+']: ', lyr);
				if(this.config.type === TilemapTypes.DATA) {
					this.layers[key] = this.map.createBlankLayer(key, lyr.width, lyr.height, lyr.tileW, lyr.tileH, lyr.group);

					if(lyr.tiles) {
						this.addTiles(lyr.data.getTileConfig(key), layer);
					}
					
				} else if(this.config.type === TilemapTypes.JSON) {
					this.layers[key] = this.map.createLayer(key);
				}

				if(lyr.attrs) {
					trace('ADDING ATTRIBUTES TO LAYER: ' + key + ': ', lyr.attrs);
					PWG.Utils.extend(this.layers[key], lyr.attrs);
				}

				if(lyr.resizeWorld) {
					this.layers[key].resizeWorld();
				}

				// this.layers[key].scrollFactorX = lyr.scrollFactorX;
				// this.layers[key].scrollFactorY = lyr.scrollFactorY;

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
		var tilemaps = [];
		
		PWG.Utils.each(
			maps,
			function(map) {
				tilemaps.push(new TilemapController(map));
			},
			this
		);

		return tilemaps;

	};

	return module;
}();

