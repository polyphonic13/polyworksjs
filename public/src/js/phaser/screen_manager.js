PWG.ScreenManager = function() {
	var module = {};
	
	function ScreenController(id, config) {
		this.id = id;
		this.config = config;
	};
	
	ScreenController.prototype.create = function() {
		if(this.config.listeners) {
			PWG.EventCenter.batchBind(this.config.listeners, this);
		}
		if(this.config.create) {
			this.config.create.apply(this, arguments);
		}
	};
	
	ScreenController.prototype.update = function() {
		if(this.config.update) {
			this.config.update.apply(this, arguments);
		}
	};
	
	ScreenController.prototype.shutdown = function() {
		if(this.config.shutdown) {
			this.config.shutdown.apply(this, arguments);
		}
		if(this.config.listeners) {
			PWG.EventCenter.batchUnbind(this.config.listeners, this);
		}
	};
	
	module.ScreenController = ScreenController;
	
	module.currentId = '';
	module.screens = {};
	
	module.init = function(screens) {
		trace('ScreenManager/init');
		PWG.Utils.each(
			screens,
			function(value, key) {
				trace('\tcreating screen['+key+']')
				this.screens[key] = new ScreenController(key, value);
			},
			this
		);
	};
	
	module.startScreen = function(id) {
		this.shutdown();
		this.currentId = id;
		this.create();
	};
	
	module.create = function() {
		if(this.currentId !== '') {
			this.screens[this.currentId].create();
		}
	};
	
	module.update = function() {
		if(this.currentId !== '') {
			this.screens[this.currentId].update();
		}
	};
	
	module.shutdown = function() {
		if(this.currentId !== '') {
			this.screens[this.currentId].shutdown();
		}
	};
	
	return module;
}();