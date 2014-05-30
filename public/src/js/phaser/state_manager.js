PWG.StateManager = (function() {

	var module = {};
	
	function Controller(config) {
		// trace('StateController/constructor, config = ', config);
		this.config = config;
		this.name = config.name;

		PWG.Utils.each(
			config.attrs,
			function(attr, key) {
				this[key] = attr;
			},
			this
		);
		// trace('state['+this.name+'] listeners = ', config.listeners);
		PhaserGame.phaser.state.add(this.name, this, false);
	};
	
	Controller.prototype.start = function() {
		// trace('StateController['+this.name+']/start');
	};

	Controller.prototype.preload = function() {
		// trace('StateController['+this.name+']/preload, preloaded = ' + this.preloaded);
		if(!this.preloaded) {
			PWG.PhaserLoader.load(this.config.assets);
			this.preloaded = true;
		}
	};
	
	Controller.prototype.create = function() {
		trace('StateController['+this.name+']/create, this.config = ', this.config);
		var world = this.config.world;
		// trace('setting world bounds to: x/y = ' + world.x + '/' + world.y + ', w/h = ' + world.width + '/' + world.height);
		PhaserGame.phaser.world.setBounds(world.x, world.y, world.width, world.height);

		if(this.config.tilemaps) {
			this.tileMaps = PWG.PhaserTileMap.build(this.config.tilemaps);
		}

		if(this.config.views) {
			this.views = PWG.PhaserView.build(this.config.views);
		}

		if(this.config.inputs) {
			this.inputs = {};
			PWG.Utils.each(
				this.config.inputs,
				function(input) {
					this.inputs[input.name] = new PWG.PhaserInput[input.type](input);
				},
				this
			);
		}

		if(this.config.methods) {
			// trace('there are methods');
			this.methods = {};
			PWG.Utils.each(
				this.config.methods,
				function(method, key) {
					// trace('adding ' + key + ' to prototype as method: ', method);
					this.methods[key] = method;
				},
				this
			);
		}

		// trace('post method add, this = ', this);
		if(this.config.listeners) {
			// trace('there are listeners');
			PWG.Utils.each(
				this.config.listeners,
				function(listener) {
					// trace('\tadding listener:', listener);
					PWG.EventCenter.bind(listener.event, listener.handler, this);
				},
			this
			);
		}

		if(this.config.create) {
			this.config.create.call(this);
		}

	};
	
	Controller.prototype.update = function() {
		if(this.config.update) {
			this.config.update.call(this);
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
		// if(this.views) {
		// 	PWG.PhaserView.update(this.views);
		// }
		// if(this.tilesMaps) {
			PWG.PhaserTileMap.update(this.tileMaps);
		// }
		PWG.PhaserInput.updateKeyboard();
	};
	
	Controller.prototype.getView = function(id) {
		// trace('StateController['+this.name+']/getView, id = ' + id);
		if(!this.views.hasOwnProperty(id)) {
			return;
		}
		return this.views[id];
	};
	
	Controller.prototype.shutdown = function() {
		// trace('StateController['+this.name+']/shutdown');
		if(this.config.shutdown) {
			this.config.shutdown.call(this);
		}

		PWG.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);

		if(this.config.listeners) {
			PWG.Utils.each(
				this.config.listeners,
				function(listener) {
					PWG.EventCenter.bind(listener.event, listener.handler, this);
				},
			this
			);
		}
	};

	module.Controller = Controller;
	
	module.init = function(config) {
		// trace('StateManager/init, config = ', config);
		this.config = config;
		this.states = {};
		this.currentId = '';

		PWG.Utils.each(
			config,
			function(state) {
				// trace('\tadding state[' + state.name + ']');
				// this.states[state.name] = new this.Controller(state);
				this.states[state.name] = new this.Controller(state);
			},
			this
		);
		// trace('\tstates = ', this.states);
	};
	
	module.changeState = function(id) {
		// trace('StateManager/changeState, id = ' + id + ', currentId = ' + this.currentId);
		if(this.currentId !== id) {
			if(this.states.hasOwnProperty(id)) {
				this.currentId = id;
				// trace('\tstates['+id+'] = ', this.states[id]);
				// this.states[id].activate();
				PhaserGame.phaser.state.start(id, this.states[id].clearWorld, this.states[id].clearCache);
			}
		}
	};

	module.getView = function(id) {
		// trace('StateManager/getView, id = ' + id);
		return this.state[this.currentId].getView();
	};
	
	module.destroy = function() {
		this.states[this.currentId].shutdown();
	};
	
	return module;
}());