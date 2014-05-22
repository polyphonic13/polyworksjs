var PhaserGame = (function() {
	var _inPlay = false;
	var module = {};

	module.init = function(aspectRatio) {
		module.loaded = {
			images: {},
			sprites: {}
		};
		
		module.stage = Polyworks.Stage;
		module.stage.init(aspectRatio, false, _onStageInitialized, module);
	};
	
	module.destroy = function() {
		trace('PhaserGame/destroy, _inPlay = ' + _inPlay);
		if(_inPlay) {
			Polyworks.StateManager.destroy();
			module.phaser.destroy();
			_inPlay = false;
		}
	};
	
	function _onStageInitialized() {
		trace('PhaserGame/onStageInitialized');
		GameConfig.init(_onConfigInitialized, module);
	}
	
	function _onConfigInitialized(config) {
		module.config = config;
		trace('PhaserGame/onConfigInitalized, config = ', config, '\tPhaserGame.config = ', module.config, module);
		_inPlay = true;
		_addEventListeners();
		
		module.phaser = new Phaser.Game(
			module.stage.gameW, 
			module.stage.gameH, 
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
		Polyworks.EventCenter.bind(Polyworks.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _removeEventListeners() {
		Polyworks.EventCenter.unbind(Polyworks.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _onChangeState(event) {
		trace('PhaserGame/_onChangeState, event = ', event);
		Polyworks.StateManager.changeState(event.value);
	}
	
	function _preload() {
		trace('PhaserGame/preload');
		Polyworks.PhaserLoader.init(module.config.assets, module.phaser);
		if(module.config.preload) {
			Polyworks.PhaserLoader.load(module.config.preload);
		}
	}
	
	function _create() {
		trace('PhaserGame/create');
		Polyworks.PhaserPhysics.init();
		Polyworks.StateManager.init(module.config.screens, module.phaser);
		Polyworks.StateManager.changeState(module.config.defaultScreen);
	}
	
	function _update() {
	}
	
	function _render() {
		// trace('PhaserGame/render');
	}
	
	return module;
}());
