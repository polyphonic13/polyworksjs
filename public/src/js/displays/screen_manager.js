Polyworks.ScreenManager = (function() {

	var module = {};
	
	function ScreenController(config) {
		trace('ScreenController/constructor, config = ', config);
		this.config = config;
		this.id = config.id;
		this.views = Polyworks.DisplayFactory.createViews(config.views);
	};
	
	ScreenController.prototype.activate = function() {
		trace('ScreenController['+this.id+']/activate');
		Polyworks.Utils.each(
			this.views,
			function(view) {
				view.show();
			},
			this
		);
		this.active = true;
	};
	
	ScreenController.prototype.update = function() {
		trace('ScreenController['+this.id+']/update');
		Polyworks.Utils.each(
			this.views,
			function(view) {
				view.update();
			},
			this
		);
	};
	
	ScreenController.prototype.deactive = function() {
		trace('ScreenController['+this.id+']/deactivate');
		Polyworks.Utils.each(
			this.views,
			function(view) {
				view.hide();
			},
			this
		);
		this.active = false;
	};
	
	ScreenController.prototype.destroy = function() {
		trace('ScreenController['+this.id+']/destroy');
		Polyworks.Utils.each(
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
		trace('ScreenManager/init, config = ', config);
		this.config = config;
		this.screens = {};
		this.currentId = '';

		Polyworks.Utils.each(
			config,
			function(scr) {
				trace('\tadding screen[' + scr.id + ']');
				this.screens[scr.id] = new this.ScreenController(scr);
			},
			this
		);
		trace('\tscreens = ', this.screens);
	};
	
	module.activate = function(id) {
		trace('ScreenManager/activate, id = ' + id + ', currentId = ' + this.currentId);
		if(this.currentId !== id) {
			if(this.screens.hasOwnProperty(id)) {
				if(this.currentId !== '') {
					this.screens[this.currentId].deactivate();
				}
				this.currentId = id;
				trace('\tscreens['+id+'] = ', this.screens[id]);
				this.screens[id].activate();
			}
		}
	};

	module.update = function() {
		this.screens[this.currentId].update();
	};
	
	module.deactivate = function(id) {
		if(this.screens.hasOwnProperty(id)) {
			this.screens[id].deactivate();
			if(this.currentId === id) {
				this.currentId = '';
			}
		}
	};
	
	module.deactivateAll = function() {
		Polyworks.Utils.each(
			this.screens,
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
}());