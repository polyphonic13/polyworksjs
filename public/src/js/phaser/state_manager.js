PWG.StateManager = function() {

	var module = {};
	
	function StateController(name, state) {
		trace('StateController['+name+']/constructor, state = ', state);
		this.name = name;
		PWG.Utils.extend(this, state)
		this.preloaded = false;
		
		PWG.Game.phaser.state.add(this.name, this, false);
	};
	
	StateController.prototype.start = function() {
		trace('StateController['+this.name+']/start');
		
	};

	StateController.prototype.preload = function() {
		trace('StateController['+this.name+']/preload, preloaded = ' + this.preloaded + '\n\tthis = ', this);
		if(!this.preloaded) {
			PWG.PhaserLoader.load(this.config.assets);
			this.preloaded = true;
		}
	};
	
	StateController.prototype.create = function() {
		trace('StateController['+this.name+']/create, this.config = ', this.config);
		var world = this.config.world;
		trace('setting world bounds to: x/y = ' + world.x + '/' + world.y + ', w/h = ' + world.width + '/' + world.height);
		PWG.Game.phaser.world.setBounds(world.x, world.y, world.width, world.height);

		if(this.config.tileMaps) {
			this.tileMaps = PWG.TileMapManager.build(this.config.tileMaps);
		}
		
		if(this.config.views) {
			this.views = PWG.ViewManager.build(this.config.views);
			trace('------------------ ', this.views);
		}

		trace('post method add, this = ', this);
		if(this.listeners) {
			PWG.EventCenter.batchBind(this.listeners, this);
		}

		if(this.methods.create) {
			this.methods.create.call(this);
		}

	};
	
	StateController.prototype.update = function() {
		if(this.methods.update) {
			this.methods.update.call(this);
		}
		if(this.inputs) {
			PWG.Utils.each(
				this.inputs,
				function(input) {
					if(input.update) {
						input.update();
					}
				},
				this
			);
		}

		if(this.tilesMaps) {
			PWG.PhaserTileMap.update(this.tileMaps);
		}
		PWG.PhaserInput.updateKeyboard();
	};
	
	StateController.prototype.getView = function(id) {
		trace('StateController['+this.name+']/getView, id = ' + id);
		if(!this.views.hasOwnProperty(id)) {
			return;
		}
		return this.views[id];
	};
	
	StateController.prototype.shutdown = function() {
		trace('StateController['+this.name+']/shutdown');
		if(this.methods.shutdown) {
			this.methods.shutdown.call(this);
		}

		PWG.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);

		if(this.listeners) {
			PWG.EventCenter.batchUnbind(this.listeners, this);
		}
	};

	module.StateController = StateController;
	
	module.init = function(config, listeners) {
		trace('StateManager/init, config = ', config);
		this.states = {};
		this.currentId = '';

		PWG.Utils.each(
			config,
			function(state, key) {
				// add config to state logic object
				state.config = PWG.Game.config.states[key];
				trace('\tadding state[' + key + '] = ', state);
				this.states[key] = new this.StateController(key, state);
			},
			this
		);
		trace('\tend of init, states = ', this.states);
		PWG.EventCenter.bind(PWG.Events.CHANGE_STATE, module.onChangeState, module);
	};
	
	module.onChangeState = function(event) {
		module.changeState(event.value);
	};
	
	module.changeState = function(id) {
		trace('StateManager/changeState, id = ' + id + ', currentId = ' + this.currentId + ', states = ', this.states);
		if(this.currentId !== id) {
			if(this.states.hasOwnProperty(id)) {
				this.currentId = id;
				PWG.Game.phaser.state.start(id, this.states[id].clearWorld, this.states[id].clearCache);
			}
		}
	};

	module.getCurrentStateGroup = function() {
		trace('StateManager/getCurrentStateGroup, currentId = ' + this.currentId + ', views = ', this.states[this.currentId].views);
		return this.states[this.currentId].views['state-group'].view;
	};
	
	module.getView = function(id) {
		trace('StateManager/getView, id = ' + id);
		return this.state[this.currentId].getView();
	};
	
	module.destroy = function() {
		PWG.EventCenter.unbind(PWG.Events.CHANGE_STATE, module.changeState, module);
		this.states[this.currentId].shutdown();
	};
	
	return module;
}();