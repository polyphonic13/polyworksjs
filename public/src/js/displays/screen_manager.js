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
Polyworks.ScreenManager = (function() {

	var module = {};
	
	function ScreenController(config) {
		this.config = config;
		this.views = Polyworks.DisplayFactory(config.views);
	};
	
	ScreenController.activate = function() {
		Polyworks.each(
			this.views,
			function(view) {
				view.show();
			},
			this
		);
		this.active = true;
	};
	
	ScreenController.deactive = function() {
		Polyworks.each(
			this.views,
			function(view) {
				view.hide();
			},
			this
		);
		this.active = false;
	};
	
	ScreenController.destroy = function() {
		Polyworks.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);
	};
	
	module.init = function(config) {
		this.config = config;
		this.screens = {};
		this.currentId = '';

		Polyworks.Utils.each(
			config.screens,
			function(scr) {
				this.screens[scr.type] = new this.ScreenController(scr);
			},
			this
		);
	};
	
	module.activate = function(id) {
		if(this.currentId !== id) {
			if(this.screens.hasOwnProperty(id)) {
				this.screens[this.currentId].deactivate();
				this.currentId = id;
				this.screens[id].activate();
			}
		}
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
	
	module.ScreenController = ScreenController;
	
	return module;
}());