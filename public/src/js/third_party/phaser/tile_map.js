Polyworks.PhaserTileMap = (function() {
	var module = {};
	
	function Controller(config) {
		trace('TileMapController['+config.id+']/constructor, views = ', config.views);
		this.id = config.id;
		this.config = config;
		
		this.currentTile = null;
		this.phaser = PhaserGame.phaser;
		this.map = this.phaser.add.tilemap('grass01');

	    this.map.addTilesetImage('test1', 'grassTiles');

	    currentTile = this.map.getTile(2, 3);

	    this.layer = this.map.createLayer('Ground');

	    this.layer.resizeWorld();

	    this.marker = this.phaser.add.graphics();
	    this.marker.lineStyle(2, 0x000000, 1);
	    this.marker.drawRect(0, 0, 32, 32);

	    cursors = this.phaser.input.keyboard.createCursorKeys();

/*
if(config.layers) {
	this.layers = {};
	Polyworks.Utils.each(
		config.layers,
		function(layer) {
			trace('\tmaking layer['+layer.id+']: ', layer);
			this.layers[layer.id] = this.view.create(layer.id, layer.xCells, layer.yCells, this.config.cellSize, this.config.cellSize);
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