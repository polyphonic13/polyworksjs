PWG.ScreenManager = function() {

	var module = {};
	
	function ScreenController(config) {
		// trace('ScreenController/constructor, config = ', config);
		this.config = config;
		this.name = config.name;
		this.views = PWG.DisplayFactory.createPhaserViews(config.views);
	};
	
	ScreenController.prototype.activate = function() {
		// trace('ScreenController['+this.name+']/activate');
		PWG.Utils.each(
			this.views,
			function(view) {
				view.show();
			},
			this
		);
		this.active = true;
	};
	
	ScreenController.prototype.update = function() {
		// trace('ScreenController['+this.name+']/update');
		PWG.Utils.each(
			this.views,
			function(view) {
				view.update();
			},
			this
		);
	};
	
	ScreenController.prototype.deactive = function() {
		// trace('ScreenController['+this.name+']/deactivate');
		PWG.Utils.each(
			this.views,
			function(view) {
				view.hide();
			},
			this
		);
		this.active = false;
	};
	
	ScreenController.prototype.destroy = function() {
		// trace('ScreenController['+this.name+']/destroy');
		PWG.Utils.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);
	};
	
	module.ScreenController = ScreenController;
	
	module.init = function(config) {
		// trace('ScreenManager/init, config = ', config);
		this.config = config;
		this.states = {};
		this.currentId = '';

		PWG.Utils.each(
			config,
			function(scr) {
				// trace('\tadding state[' + scr.name + ']');
				this.states[scr.name] = new this.ScreenController(scr);
			},
			this
		);
		// trace('\tstates = ', this.states);
	};
	
	module.activate = function(id) {
		// trace('ScreenManager/activate, id = ' + id + ', currentId = ' + this.currentId);
		if(this.currentId !== id) {
			if(this.states.hasOwnProperty(id)) {
				if(this.currentId !== '') {
					this.states[this.currentId].deactivate();
				}
				this.currentId = id;
				// trace('\tstates['+id+'] = ', this.states[id]);
				this.states[id].activate();
			}
		}
	};

	module.update = function() {
		this.states[this.currentId].update();
	};
	
	module.deactivate = function(id) {
		if(this.states.hasOwnProperty(id)) {
			this.states[id].deactivate();
			if(this.currentId === id) {
				this.currentId = '';
			}
		}
	};
	
	module.deactivateAll = function() {
		PWG.Utils.each(
			this.states,
			function(scr, id) {
				this.scr(id).deactivate();
			},
			this
		);
		this.currentId = '';
	};
	
	module.destroy = function() {
		
	};
	
	return module;
}();