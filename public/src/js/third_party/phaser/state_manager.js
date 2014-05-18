/*
attrs: [
{
	name: 'menuGroup',
	cl: 'GroupCollection',
	attrs: [
	{
		name: 'gameTitle',
		cl: 'Sprite',
		attrs: {
			img: 'gameTitle',
			phaser: {
				// width: winW
				width: stageUnit * 6,
				height: stageUnit * 6
			},
			start: {
				// x: 0,
				x: (winW/2 - (stageUnit * 3)),
				y: 0
			}
		}
	}
	]
},
{
	name: 'menuControls',
	cl: 'ControlButtons',
	type: 'menu',
	attrs: {
		start: {
			x: 0,
			y: 0
		}
	}
}
]
*/
Polyworks.StateManager = (function() {

	var module = {};
	
	function StateController(config, phaser) {
		trace('StateController/constructor, config = ', config);
		this.config = config;
		this.phaser = phaser;
		this.id = config.id;
		
		this.phaser.state.add(this.id, this, false);
	};
	
	StateController.prototype.start = function() {
		trace('StateController['+this.id+']/start');
	};

	StateController.prototype.preload = function() {
		trace('StageController['+this.id+']/preload, preloaded = ' + this.preloaded);
		if(!this.preloaded) {
			Polyworks.PhaserLoader.load(this.config.assets);
			this.preloaded = true;
		}
	};
	
	StateController.prototype.create = function() {
		trace('StageController['+this.id+']/create');
		this.views = Polyworks.DisplayFactory.createViews(this.config.views);
	}
	
/*	
	StateController.prototype.update = function() {
		trace('StateController['+this.id+']/update');
		Polyworks.Utils.each(
			this.views,
			function(view) {
				view.update();
			},
			this
		);
	};
	
	StateController.prototype.deactive = function() {
		trace('StateController['+this.id+']/deactivate');
		Polyworks.Utils.each(
			this.views,
			function(view) {
				view.hide();
			},
			this
		);
		this.active = false;
	};
	
	StateController.prototype.destroy = function() {
		trace('StateController['+this.id+']/destroy');
		Polyworks.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);
	};
*/	
	module.StateController = StateController;
	
	module.init = function(config, phaser) {
		trace('StateManager/init, config = ', config);
		this.config = config;
		this.phaser = phaser;
		this.states = {};
		this.currentId = '';

		Polyworks.Utils.each(
			config,
			function(state) {
				trace('\tadding stateeen[' + state.id + ']');
				// this.states[state.id] = new this.StateController(state);
				this.states[state.id] = new this.StateController(state, phaser);
			},
			this
		);
		trace('\tstates = ', this.states);
	};
	
	module.changeState = function(id) {
		trace('StateManager/changeState, id = ' + id + ', currentId = ' + this.currentId);
		if(this.currentId !== id) {
			if(this.states.hasOwnProperty(id)) {
				this.currentId = id;
				trace('\tstates['+id+'] = ', this.states[id]);
				// this.states[id].activate();
				this.phaser.state.start(id, this.states[id].clearWorld, this.states[id].clearCache);
			}
		}
	};

	module.destroy = function() {
		
	};
	
	return module;
}());