var PhaserGame = (function() {
	var _inPlay = false;
	var _isQuit = false;
	var module = {};

	module.camera = null;
	
	module.init = function(aspectRatio) {
		module.loaded = {
			images: {},
			sprites: {}
		};

		module.stage = Polyworks.Stage;
		module.stage.init(aspectRatio, false, _onStageInitialized, module);
	};
	
	module.destroy = function() {
		// trace('PhaserGame/destroy, _inPlay = ' + _inPlay);
		if(_inPlay) {
			Polyworks.StateManager.destroy();
			module.phaser.destroy();
			_inPlay = false;
		}
	};
	
	module.quit = function() {
		if(!_isQuit) {
			_quit();
		}
	};
	
	function _onStageInitialized() {
		// trace('PhaserGame/onStageInitialized');
		GameConfig.init(_onConfigInitialized, module);
	}
	
	function _onConfigInitialized(config) {
		module.config = config;
		// trace('PhaserGame/onConfigInitalized, config = ', config);
		_inPlay = true;
		_addListeners();
		
		Polyworks.Utils.extend(module, config.attrs);
		
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
	
	function _preload() {
		// trace('PhaserGame/_preload');
		Polyworks.PhaserLoader.init(module.config.assets, module.phaser);
		if(module.config.preload) {
			Polyworks.PhaserLoader.load(module.config.preload);
		}
	}
	
	function _create() {
		// trace('PhaserGame/_create');
		Polyworks.PhaserScale.init(module.config.stage);
		Polyworks.PhaserPhysics.init();
		
		if(module.config.input) {
			if(module.config.input.keys) {
				module.keyboard = Polyworks.PhaserInput.initKeyboard(module.config.input.keys);
			}
		}
		
		Polyworks.StateManager.init(module.config.screens, module.phaser);
		if(module.config.defaultScreen) {
			Polyworks.StateManager.changeState(module.config.defaultScreen);
		}
	}
	
	function _update() {
		// trace('PhaserGame/_update');
		if(module.keyboard) {
			Polyworks.PhaserInput.updateKeyboard(module.keyboard);
		}
	}
	
	function _render() {
		// trace('PhaserGame/_render');
	}
	
	function _addListeners() {
		Polyworks.EventCenter.bind(Polyworks.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _removeListeners() {
		Polyworks.EventCenter.unbind(Polyworks.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _onChangeState(event) {
		// trace('PhaserGame/_onChangeState, event = ', event);
		Polyworks.StateManager.changeState(event.value);
	}
	
	function _quit() {
		// trace('PhaserGame/_quit');
		_isQuit = true;
		Polyworks.StateManager.destroy();
		_removeListeners();
		module.phaser.destroy();
		
	}
	
	return module;
}());
