var PhaserGame = function() {
	var _inPlay = false;
	var _isQuit = false;
	var module = {};

	module.camera = null;
	
	module.init = function(aspectRatio) {
		module.loaded = 
		{
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
		if(!_isQuit) 
		{
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

		if(gameLogic.init) {
			gameLogic.init.call(this);
		}
		
		// add global methods
		PWG.Utils.extend(module, gameLogic.global.methods);

		// add global listeners
		PWG.EventCenter.batchBind(gameLogic.global.listeners, module);
		
		// init screen manager
		PWG.ScreenManager.init(gameLogic.screens);
		
		if(module.init) {
			module.init.call(this);
		}

		// create phaser game
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
		if(module.preload) {
			module.preload.call(this);
		}
	}
	
	function _create() {
		// trace('PhaserGame/_create');
		PWG.PhaserScale.init(module.config.stage);
		PWG.PhaserPhysics.init();

		PWG.ViewManager.init(module.config.views);

		if(module.config.input) 
		{
			if(module.config.input.keys) 
			{
				module.keyboard = PWG.PhaserInput.initKeyboard(module.config.input.keys);
			}
		}
		
		if(module.create) {
			module.create.call(this);
		}
	}
	
	function _update() {
		// trace('PhaserGame/_update');
		if(module.keyboard) 
		{
			PWG.PhaserInput.updateKeyboard(module.keyboard);
		}
		if(module.update) {
			module.update.call(this);
		}
	}
	
	function _render() {
		// trace('PhaserGame/_render');
		if(module.render) {
			module.render.call(this);
		}
	}
	
	function _quit() {
		// trace('PhaserGame/_quit');
		_isQuit = true;
		PWG.EventCenter.batchUnbind(gameLogic.global.listeners);
		PWG.ScreenManager.destroy();
		module.phaser.destroy();
	}
	
	return module;
}();
