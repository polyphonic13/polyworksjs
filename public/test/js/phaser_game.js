var PhaserGame = (function() {
	var screens = Polyworks.StateManager;
	
	var module = {};

	module.init = function(aspectRatio) {
		this.loaded = {
			images: {},
			sprites: {}
		};
		
		this.stage = Polyworks.Stage;
		this.stage.init(aspectRatio, false, _onStageInitialized, this);
	};
	
	function _onStageInitialized() {
		trace('PhaserGame/onStageInitialized');
		GameConfig.init(_onConfigInitialized, this);
	}
	
	function _onConfigInitialized(config) {
		PhaserGame.config = config;
		trace('PhaserGame/onConfigInitalized, config = ', config, '\tPhaserGame.config = ', PhaserGame.config, this);
		
		_addEventListeners();
		
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
	}
	
	function _addEventListeners() {
		Polyworks.EventCenter.bind(Polyworks.Events.CHANGE_STATE, _onChangeState, this);
	}
	
	function _removeEventListeners() {
		Polyworks.EventCenter.unbind(Polyworks.Events.CHANGE_STATE, _onChangeState, this);
	}
	
	function _onChangeState(event) {
		trace('PhaserGame/_onChangeState, event = ', event);
		Polyworks.StateManager.changeState(event.value);
	}
	
	function _preload() {
		trace('PhaserGame/preload, config = ', PhaserGame.config, this);
		Polyworks.PhaserLoader.init(PhaserGame.config.assets, PhaserGame.phaser);
		// var images = PhaserGame.config.images;
		// trace('\timages = ', images);
		// Polyworks.Utils.each(images,
		// 	function(image, key) {
		// 		trace('\t\timage['+key+'] loaded = ' + PhaserGame.loaded.images[key]);
		// 		if(!PhaserGame.loaded.images[key]) {
		// 			trace('\t\timages['+key+']' + image);
		// 			PhaserGame.phaser.load.image(key, image);
		// 			PhaserGame.loaded.images[key] = true;
		// 		}
		// 	},
		// 	PhaserGame
		// );

	}
	
	function _create() {
		trace('PhaserGame/create');
		Polyworks.StateManager.init(PhaserGame.config.screens, PhaserGame.phaser);
		Polyworks.StateManager.changeState(PhaserGame.config.defaultScreen);
	}
	
	function _update() {
	}
	
	function _render() {
		// trace('PhaserGame/render');
	}
	
	return module;
}());
