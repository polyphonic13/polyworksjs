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

		module.stage = PWG.Stage;
		module.stage.init(aspectRatio, false, _onStageInitialized, module);
	};
	
	module.destroy = function() {
		// trace('PhaserGame/destroy, _inPlay = ' + _inPlay);
		if(_inPlay) {
			PWG.StateManager.destroy();
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

		PWG.Utils.extend(module, config.attrs);

		module.phaser = new Phaser.Game(
			module.stage.gameW, 
			module.stage.gameH, 
			Phaser.AUTO, 
			config.gameEl,
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
		PWG.PhaserLoader.init(module.config.assets, module.phaser);
		if(module.config.preload) {
			PWG.PhaserLoader.load(module.config.preload);
		}
	}
	
	function _create() {
		// trace('PhaserGame/_create');
		PWG.PhaserScale.init(module.config.stage);
		PWG.PhaserPhysics.init();

		if(module.config.input) {
			if(module.config.input.keys) {
				module.keyboard = PWG.PhaserInput.initKeyboard(module.config.input.keys);
			}
		}

		PWG.StateManager.init(module.config.states, module.phaser);
		if(module.config.defaultScreen) {
			PWG.StateManager.changeState(module.config.defaultScreen);
		}
	}
	
	function _update() {
		// trace('PhaserGame/_update');
		if(module.keyboard) {
			PWG.PhaserInput.updateKeyboard(module.keyboard);
		}
	}
	
	function _render() {
		// trace('PhaserGame/_render');
	}
	
	function _addListeners() {
		PWG.EventCenter.bind(PWG.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _removeListeners() {
		PWG.EventCenter.unbind(PWG.Events.CHANGE_STATE, _onChangeState, module);
	}
	
	function _onChangeState(event) {
		// trace('PhaserGame/_onChangeState, event = ', event);
		PWG.StateManager.changeState(event.value);
	}
	
	function _quit() {
		// trace('PhaserGame/_quit');
		_isQuit = true;
		PWG.StateManager.destroy();
		_removeListeners();
		module.phaser.destroy();
	}
	
	return module;
}());
