Polyworks.PhaserTileMap = (function() {
	var module = {};
	
	var _map;
	var _layer;
	var _marker; 
	var _currentTile; 
	
	function Controller(config) {
		trace('TileMapController['+config.id+']/constructor, config = ', config);
		this.id = config.id;
		this.config = config;


		this.phaser = PhaserGame.phaser;
		_map = this.phaser.add.tilemap('grass01');

	    _map.addTilesetImage('test1', 'grassTiles');

	    _currentTile = _map.getTile(2, 3);

	    _layer = _map.createLayer('TileLayer1');

	    _layer.resizeWorld();

	    _marker = this.phaser.add.graphics();
	    _marker.lineStyle(2, 0x000000, 1);
	    _marker.drawRect(0, 0, 32, 32);

	    cursors = this.phaser.input.keyboard.createCursorKeys();
	
		this.view = _map;
		Polyworks.Initializer.setViewAttributes(config.attrs, this.view);

/*
if(config.layers) {
	_layers = {};
	Polyworks.Utils.each(
		config.layers,
		function(layer) {
			trace('\tmaking layer['+layer.id+']: ', layer);
			_layers[layer.id] = this.view.create(layer.id, layer.xCells, layer.yCells, this.config.cellSize, this.config.cellSize);
		},
		this
	);
}
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
	}

	Controller.prototype.update = function() {
		// trace('TileMapController/update, this = ', this);
		  _marker.x = _layer.getTileX(this.phaser.input.activePointer.worldX) * 32;
		  _marker.y = _layer.getTileY(this.phaser.input.activePointer.worldY) * 32;

		  if (this.phaser.input.mousePointer.isDown)
		  {
			// trace('mouse pointer down');
		      if (this.phaser.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
		      {
		          _currentTile = _map.getTile(_layer.getTileX(_marker.x), _layer.getTileY(_marker.y));
				// trace('\tshift down, _currentTile = ', _currentTile);
		      }
		      else
		      {
		          if (_map.getTile(_layer.getTileX(_marker.x), _layer.getTileY(_marker.y)) != _currentTile)
		          {
						// trace('putting a tile in a new location');
		              _map.putTile(_currentTile, _layer.getTileX(_marker.x), _layer.getTileY(_marker.y));
		          }
		      }
		  }

	    if (cursors.left.isDown)
	    {
	        game.camera.x -= 4;
	    }
	    else if (cursors.right.isDown)
	    {
	        game.camera.x += 4;
	    }

	    if (cursors.up.isDown)
	    {
	        game.camera.y -= 4;
	    }
	    else if (cursors.down.isDown)
	    {
	        game.camera.y += 4;
	    }
	};
	// Controller.prototype.onInputDown = function(sprite, pointer) {
	// 	trace('TileMapController/onInputDown, sprite = ', sprite, '\tpointer = ', pointer);
	// 	this.pickTitle(sprite, pointer);
	// };
	// 
	// Controller.prototype.pickTile = function(sprite, pointer) {
	//     currentTile = PhaserGame.this.phaser.math.snapToFloor(pointer.x, this.config.cellSize) / this.config.cellSize;
	// 	trace('TileMapController/pickTile, currentTile = ', currentTile);
	// };

	Polyworks.Initializer.addStandardMethods(Controller);
	
	module.Controller = Controller; 
	
	return module;
}());