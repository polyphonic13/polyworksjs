PWG.Game = function() {
	var _inPlay = false;
	var _isQuit = false;
	var _gameConfig;
	var _gameLogic;
	
	var module = {};

	module.camera = null;
	
	module.init = function(gameConfig, gameLogic) {
		trace('PWG.Game/init, gameConfig = ', gameConfig, '\tgameLogic = ', gameLogic);
		_gameConfig = gameConfig;
		_gameLogic = gameLogic;
		module.stage = PWG.Stage;
		module.stage.init(gameConfig.aspectRatio, gameConfig.maxHeight, gameConfig.offsetX, gameConfig.offsetY, gameConfig.resizable, _onStageInitialized, module);
	};
	
	module.destroy = function() {
		// trace('PWG.Game/destroy, _inPlay = ' + _inPlay);
		if(_inPlay) {
			PWG.StateManager.destroy();
			module.phaser.destroy();
			_inPlay = false;
		}
	};
	
	module.addLoadingAnimation = function() {
		var loadingAnimation = document.createElement('div');
		loadingAnimation.setAttribute('id', 'loading_animation');
		loadingAnimation.className = 'loading_animation';
		loadingAnimation.style.width = PWG.Stage.winW + 'px';
		loadingAnimation.style.height = PWG.Stage.winH + 'px';
		document.getElementsByTagName('body')[0].appendChild(loadingAnimation);
	}
	
	module.removeLoadingAnimation = function() {
		var loadingAnimation = document.getElementById('loading_animation');
		loadingAnimation.parentNode.removeChild(loadingAnimation);
	}
	
	module.quit = function() {
		if(!_isQuit) 
		{
			_quit();
		}
	};
	
	function _onStageInitialized() {
		trace('PWG.Game/onStageInitialized');
		if(_gameConfig.loadingAnimation) {
			module.addLoadingAnimation();
		}
		_gameConfig.init(_onConfigInitialized, module);
	}
	
	function _onConfigInitialized(cfg) {
		module.config = cfg;
		trace('PWG.Game/onConfigInitalized, config = ', cfg, '\tmodule = ', module);
		_inPlay = true;

		// add global methods
		PWG.Utils.extend(module, _gameLogic.global.methods);

		// add global listeners
		PWG.EventCenter.batchBind(_gameLogic.global.listeners, module);
		
		// create phaser game
		module.phaser = new Phaser.Game(
			module.config.canvasW,
			module.config.canvasH,
			Phaser.AUTO, 
			module.config.gameEl,
			{ 
				preload: _preload, 
				create: _create, 
				update: _update, 
				render: _render 
			}
		);
	}
	
	function _preload() {
		trace('PWG.Game/_preload, module = ', module);
		PWG.PhaserLoader.init(module.config.assets, module.phaser);
		if(module.preload) {
			module.preload.call(this);
		}
	}
	
	function _create() {
		trace('PWG.Game/_create');
		if(_gameConfig.loadingAnimation) {
			module.removeLoadingAnimation();
		}
		PWG.PhaserScale.init(module.config.stage);
		PWG.PhaserPhysics.init();

		PWG.ViewManager.init(module.config.global.views);

		PWG.StateManager.init(_gameLogic.states);
		
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
		// trace('PWG.Game/_update');
		if(module.keyboard) 
		{
			PWG.PhaserInput.updateKeyboard(module.keyboard);
		}
		if(module.update) {
			module.update.call(this);
		}
	}
	
	function _render() {
		// trace('PWG.Game/_render');
		if(module.render) {
			module.render.call(this);
		}
	}
	
	function _quit() {
		// trace('PWG.Game/_quit');
		_isQuit = true;
		PWG.EventCenter.batchUnbind(_gameLogic.global.listeners);
		PWG.ScreenManager.destroy();
		module.phaser.destroy();
	}
	
	return module;
}();
