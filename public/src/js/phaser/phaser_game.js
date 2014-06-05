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

		// add global attributes
		if(config.attrs) {
			PWG.Utils.extend(module, config.attrs);
		}
		// add global methods
		if(gameLogic.global.methods) {
			PWG.Utils.extend(module, gameLogic.global.methods);
		}
		// add global listeners
		if(gameLogic.global.listeners) {
			PWG.EventCenter.batchBind(gameLogic.global.listeners, module);
		}
	
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
		if(module.config.assets) {
			PWG.PhaserLoader.load(module.config.assets);
		}
	}
	
	function _create() {
		// trace('PhaserGame/_create');
		PWG.PhaserScale.init(module.config.stage);
		PWG.PhaserPhysics.init();

		// _initGroups();

		// add global views
		PWG.PhaserView.init(module.config.views);
		// if(module.config.views) 
		// {
		// 	module.views = PWG.PhaserView.build(module.config.views);
		// 	PhaserGame.globalGroup.add(module.views['global-views'].view);
		// 	trace('-------- PhaserGame views = ', module.views, '\tmodule.views.global-views.view = ', module.views['global-views'].view, '\tglobal group children = ', PhaserGame.globalGroup.children, '\tglobalGroup = ', PhaserGame.globalGroup);
		// 	trace('-------- PhaserGame views = ', module.views);
		// }

		if(module.config.input) 
		{
			if(module.config.input.keys) 
			{
				module.keyboard = PWG.PhaserInput.initKeyboard(module.config.input.keys);
			}
		}

		// PWG.StateManager.init(module.config.states, module.phaser);

		// if(module.config.defaultScreen) 
		// {
		// 	PWG.StateManager.changeState(module.config.defaultScreen);
		// }
		
		if(module.config.defaultGroup) {
			PWG.PhaserView.showGroup(module.config.defaultGroup);
			// module.views[module.config.defaultGroup].visible = true;
		}
	}
	
	function _initGroups() {
		trace('PhaserGame/_initGroups');
		PhaserGame.gameGroup = module.phaser.add.group();
		PhaserGame.statesGroup = module.phaser.add.group();
		PhaserGame.globalGroup = module.phaser.add.group();

		PhaserGame.gameGroup.add(PhaserGame.statesGroup);
		PhaserGame.gameGroup.add(PhaserGame.globalGroup);
		trace('\tend of _initGroups, gameGroup children = ', PhaserGame.gameGroup.children);
	}
	
	function _update() {
		// trace('PhaserGame/_update');
		if(module.keyboard) 
		{
			PWG.PhaserInput.updateKeyboard(module.keyboard);
		}
	}
	
	function _render() {
		// trace('PhaserGame/_render');
	}
	
	function _quit() {
		// trace('PhaserGame/_quit');
		_isQuit = true;
		PWG.EventCenter.batchUnbind(gameLogic.global.listeners);
		PWG.StateManager.destroy();
		module.phaser.destroy();
	}
	
	return module;
}();
