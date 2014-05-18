var PhaserGame = (function() {
	var screens = Polyworks.StateManager;
	
	var module = {};

	module.init = function(aspectRatio) {
		this.loaded = {
			images: {},
			sprites: {}
		};
		
		this.stage = Polyworks.Stage;
		this.stage.init(aspectRatio, false, this.onStageInitialized, this);
	};
	
	module.onStageInitialized = function() {
		trace('PhaserGame/onStageInitialized');
		GameConfig.init(_onConfigInitialized, this);
	};
	
	function _onConfigInitialized(config) {
		PhaserGame.config = config;
		trace('PhaserGame/onConfigInitalized, config = ', config, '\tPhaserGame.config = ', PhaserGame.config, this);
		this.phaser = new Phaser.Game(
			this.stage.gameW, 
			this.stage.gameH, 
			Phaser.AUTO, 
			'game_container',
			{ 
				preload: _preload, 
				create: _create, 
				update: _update, 
				render: _render 
			}
		);
	};
	
	function _preload() {
		trace('PhaserGame/preload, config = ', PhaserGame.config, this);
		var images = PhaserGame.config.images;
		trace('\timages = ', images);
		Polyworks.Utils.each(images,
			function(image, key) {
				trace('\t\timage['+key+'] loaded = ' + PhaserGame.loaded.images[key]);
				if(!PhaserGame.loaded.images[key]) {
					trace('\t\timages['+key+']' + image);
					PhaserGame.phaser.load.image(key, image);
					PhaserGame.loaded.images[key] = true;
				}
			},
			PhaserGame
		);

	};
	
	function _create() {
		trace('PhaserGame/create');
		Polyworks.StateManager.init(PhaserGame.config.screens, PhaserGame.phaser);
		Polyworks.StateManager.activate(PhaserGame.config.defaultScreen);
	};
	
	function _update() {
	};
	
	function _render() {
		// trace('PhaserGame/render');
	};
	
	return module;
}());
