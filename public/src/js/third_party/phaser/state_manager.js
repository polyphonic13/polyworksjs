Polyworks.StateManager = (function() {

	var module = {};
	
	function Controller(config) {
		// trace('StateController/constructor, config = ', config);
		this.config = config;
		this.name = config.name;

		Polyworks.Utils.each(
			config.attrs,
			function(attr, key) {
				this[key] = attr;
			},
			this
		);
	
		if(config.listeners) {
			Polyworks.Utils.each(
				config.listeners,
				function(listener) {
					Polyworks.EventCenter.bind(listener.event, listener.handler, this);
				},
			this
			);
		}
		PhaserGame.phaser.state.add(this.name, this, false);
	};
	
	Controller.prototype.start = function() {
		// trace('StateController['+this.name+']/start');
	};

	Controller.prototype.preload = function() {
		// trace('StateController['+this.name+']/preload, preloaded = ' + this.preloaded);
		if(!this.preloaded) {
			Polyworks.PhaserLoader.load(this.config.assets);
			this.preloaded = true;
		}
	};
	
	Controller.prototype.create = function() {
		// trace('StateController['+this.name+']/create');
		var world = this.config.world;
		PhaserGame.phaser.world.setBounds(world.x, world.y, world.width, world.height);

		if(this.config.tilemaps) {
			this.tileMaps = Polyworks.PhaserTileMap.build(this.config.tilemaps);
		}

		if(this.config.views) {
			this.views = Polyworks.PhaserView.build(this.config.views);
		}

		if(this.config.create) {
			this.config.create.call(this);
		}
	};
	
	Controller.prototype.update = function() {
		if(this.config.update) {
			this.config.update.call(this);
		}
		// if(this.views) {
		// 	Polyworks.PhaserView.update(this.views);
		// }
		// if(this.tilesMaps) {
			Polyworks.PhaserTileMap.update(this.tileMaps);
		// }
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

		Polyworks.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);

		if(this.config.listeners) {
			Polyworks.Utils.each(
				this.config.listeners,
				function(listener) {
					Polyworks.EventCenter.bind(listener.event, listener.handler, this);
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

		Polyworks.Utils.each(
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