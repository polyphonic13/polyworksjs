Polyworks.PhaserTileMap = (function() {
	var module = {};
	
	var _map;
	var _layer;
	var _layers = {};
	var _marker; 
	var _currentTile; 
	
	function TileMapController(config) {
		// trace('TileMapTileMapController['+config.name+']/constructor, config = ', config);
		this.config = config;


		this.phaser = PhaserGame.phaser;
		_map = this.phaser.add.tilemap('greyTiles');

	    _map.addTilesetImage('test1', 'greyTiles');

	    _currentTile = _map.getTile(2, 3);


/*
	    _layer = _map.createLayer('TileLayer1');
		_layer.alpha = 0.75;
	    _layer.resizeWorld();
*/

		if(config.layers) {
			var layerName;
			Polyworks.Utils.each(
				config.layers,
				function(layer) {
					// trace('\tmaking layer['+layer.name+']: ', layer);
					_layers[layer.name] = _map.createLayer(layer.name);
					Polyworks.Initializer.setViewAttributes(layer.attrs, layer);
					if(layer.resizeWorld) {
						_layers[layer.name].resizeWorld();
					}
					layerName = layer.name;
				},
				this
			);
			this.currentLayer = config.defaultLayer || layerName;
		}

	    _marker = this.phaser.add.graphics();
	    _marker.lineStyle(2, 0x000000, 1);
	    _marker.drawRect(0, 0, 3, 3);

	    cursors = this.phaser.input.keyboard.createCursorKeys();
	
		this.view = _map;
		this.view.name = this.name = config.name;

		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);

		Polyworks.EventCenter.bind(Polyworks.Events.ZOOM_IN, this.onZoomIn, this);
		Polyworks.EventCenter.bind(Polyworks.Events.ZOOM_OUT, this.onZoomOut, this);

/*
		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);
		
		// this.view.inputEnabled = true;
		// this.view.onInputDown.add(this.onInputDown, this);
	    var tileSelector = this.phaser.add.group();

	    var tileSelectorBackground = this.phaser.make.graphics();
	    tileSelectorBackground.beginFill(0x000000, 0.5);
	    tileSelectorBackground.drawRect(0, 0, 800, 34);
	    tileSelectorBackground.endFill();

	    tileSelector.add(tileSelectorBackground);

	    var tileStrip = tileSelector.create(1, 1, 'grey_tiles');
	    tileStrip.inputEnabled = true;
	    tileStrip.events.onInputDown.add(this.pickTile, this);

	    tileSelector.fixedToCamera = true;
*/	
	};

	TileMapController.prototype.onZoomIn = function(event) {
		this.zoomLayers(false, event.allLayers);
	};
	
	TileMapController.prototype.onZoomOut = function(event) {
		this.zoomLayers(true, event.allLayers);
	};
	
	TileMapController.prototype.zoomLayers = function(out, allLayers) {
		if(allLayers) {
			Polyworks.Utils.each(
				_layers,
				function(layer) {
					this.zoomLayer(layer, out);
				},
				this
			);
		} else {
			this.zoomLayer(_layers[this.currentLayer], out);
		}
	};
	
	TileMapController.prototype.zoomLayer = function(layer, out) {
		var zoomCeil = this.view.zoomCeil;
		var zoomFloor = this.view.zoomFloor;
		var zoomFactor = this.view.zoomFactor;
		// trace('zoomLayer, out = ' + out, 'layer = ', layer, 'zoomFloor = ' + zoomFloor + ', zoomCeil = ' + zoomCeil);
		if(out) {
			if(layer.scale.x > zoomFloor) {
				// trace('\t\tzooming out');
				layer.scale.x -= zoomFactor;
				layer.scale.y -= zoomFactor;
			}
		} else {
		 	if(layer.scale.x < zoomCeil) {
				// trace('\t\tzooming in');
				layer.scale.x += zoomFactor;
				layer.scale.y += zoomFactor;
			}
		}
	};

	TileMapController.prototype.update = function() {
		// trace('TileMapTileMapController/update, this = ', this);
		  // _marker.x = _layer.getTileX(this.phaser.input.activePointer.worldX) * 32;
		  // _marker.y = _layer.getTileY(this.phaser.input.activePointer.worldY) * 32;
		  // _marker.x = _layer.getTileX(this.phaser.input.activePointer.worldX) * 31;
		  // _marker.y = _layer.getTileY(this.phaser.input.activePointer.worldY) * 31;
		
		var pointerX = _marker.x = this.phaser.input.activePointer.worldX;
		var pointerY = _marker.y = this.phaser.input.activePointer.worldY;
		
		  if (this.phaser.input.mousePointer.isDown)
		  {
			var layer = _layers[this.currentLayer];
			// trace('mouse pointer down');
		      if (this.phaser.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
		      {
		          _currentTile = _map.getTile(layer.getTileX(_marker.x), layer.getTileY(_marker.y));
				// trace('\tshift down, _currentTile = ', _currentTile);
		      }
		      else
		      {
		          if (_map.getTile(layer.getTileX(_marker.x), layer.getTileY(_marker.y)) != _currentTile)
		          {
						// trace('putting a tile in a new location');
		              _map.putTile(_currentTile, layer.getTileX(_marker.x), layer.getTileY(_marker.y));
		          }
		      }
		  }
	};
	// TileMapController.prototype.onInputDown = function(sprite, pointer) {
	// 	// trace('TileMapTileMapController/onInputDown, sprite = ', sprite, '\tpointer = ', pointer);
	// 	this.pickTitle(sprite, pointer);
	// };
	// 
	// TileMapController.prototype.pickTile = function(sprite, pointer) {
	//     currentTile = PhaserGame.this.phaser.math.snapToFloor(pointer.x, this.config.cellSize) / this.config.cellSize;
	// 	// trace('TileMapTileMapController/pickTile, currentTile = ', currentTile);
	// };

	Polyworks.Initializer.addStandardMethods(TileMapController);

	module.build = function(tilemaps) {
		// trace('PhaserTileMap/build');
		var collection = {};
		Polyworks.Utils.each(
			tilemaps,
			function(tilemap) {
				collection[tilemap.name] = new Polyworks.PhaserTileMap.TileMapController(tilemap);
			},
			this
		);
		return collection;
	};
	
	module.update = function(controllers) {
		Polyworks.Utils.each(
			controllers,
			function(controller) {
				controller.update();
			},
			this
		);
	};
	
	module.TileMapController = TileMapController; 
	
	return module;
}());