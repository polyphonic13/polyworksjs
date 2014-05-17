var TestGame = (function() {
	var screens = Polyworks.ScreenManager;
	
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
		trace('TestGame/onStageInitialized');
		GameConfig.init(_onConfigInitialized, this);
	};
	
	function _onConfigInitialized(config) {
		TestGame.config = config;
		trace('TestGame/onConfigInitalized, config = ', config, '\tTestGame.config = ', TestGame.config, this);
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
		trace('TestGame/preload, config = ', TestGame.config, this);
		var images = TestGame.config.images;
		trace('\timages = ', images);
		Polyworks.Utils.each(images,
			function(image, key) {
				trace('\t\timage['+key+'] loaded = ' + TestGame.loaded.images[key]);
				if(!TestGame.loaded.images[key]) {
					trace('\t\timages['+key+']' + image);
					TestGame.phaser.load.image(key, image);
					TestGame.loaded.images[key] = true;
				}
			},
			TestGame
		);
		// var sprites = TestGame.config.sprites;
		// Polyworks.Utils.each(sprites,
		// 	function(spr) {
		// 		trace('\t\tsprite['+spr+'] loaded = ' + TestGame.loaded.sprites[spr]);
		// 		if(!TestGame.loaded.sprites[spr]) {
		// 			var sprite = sprites[spr];
		// 			trace('\t\t\tsprite = ', sprite);
		// 			TestGame.phaser.load.spritesheet(spr, sprite.url, sprite.width, sprite.height, sprite.frames);
		// 			TestGame.loaded.sprites[spr] = true;
		// 		}
		// 	},
		// 	TestGame
		// );

	};
	
	function _create() {
		trace('TestGame/create');
		Polyworks.ScreenManager.init(TestGame.config.screens);
		Polyworks.ScreenManager.activate(TestGame.config.defaultScreen);
	};
	
	function _update() {
	};
	
	function _render() {
		// trace('TestGame/render');
	};
	
	return module;
}());
