Polyworks.PhaserView = (function() {
	var viewTypes = {
		SPRITE: 'sprite',
		TEXT: 'text',
		BUTTON: 'button',
		GROUP: 'group'
	};
	
	var module = {};
	
	function ViewController(config) {
		trace('ViewController['+config.id+']/constructor');
		this.id = config.id;
		this.config = config;

		switch(config.type) {
			case viewTypes.SPRITE:
			// trace('\tgoing to create sprite with: ', config);
			this.view = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);
			break;

			case viewTypes.TEXT:
			this.view = PhaserGame.phaser.add.text(config.x, config.y, config.text, config.style);
			break;

			case viewTypes.BUTTON:
			this.view = PhaserGame.phaser.add.button(config.x, config.y, config.img, config.callback, config.context, config.frames[0], config.frames[0], config.frames[1], config.frames[0]);
			break;

			case viewTypes.GROUP: 
			this.view = PhaserGame.phaser.add.group();
			break; 

			default: 
			trace('warning, unknown view type: ' + config.type);
			break;
		}

		this.set(config.attrs);

		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this, this.id);
		}

		if(config.position) {
			Polyworks.PhaserPositioner.set(config.position, this.view);
		}
	};
	
	ViewController.prototype.set = function(params) {
		// trace('ViewController/set, view = ', this.view);
		Polyworks.Utils.each(
			params,
			function(param, key) {
				trace('\tparam['+key+'] = ' + param);
				this.view[key] = param;
			},
			this
		);
	};
	
	ViewController.prototype.callMethod = function(method, args) {
		trace('ViewController['+this.id+']/callMethod, method = ' + method + '\n\targs = ' + args);
		if(this.view[method]) {
			trace('\tview has method, ', this.view);
			this.view[method](args);
		}
	};
	
	ViewController.prototype.hide = function() {
		this.view.visible = false;
	};
	
	ViewController.prototype.show = function() {
		this.view.visible = true;
	};
	
	// groups only
	ViewController.prototype.removeChild = function(id) {
		if(this.config.type === viewTypes.GROUP) {
			if(this.children[id]) {
				// remove phaser view from group
				this.view.remove(this.children[id].view);
				// remove controller from group controller's children
				delete this.children[id];
			}
		}
	};

	// groups only
	ViewController.prototype.removeAll = function() {
		if(this.type === viewTypes.GROUP) {
			Polyworks.Utils.each(
				this.children,
				function(child) {
					this.view.remove(id);
					delete this.children[id];
				},
				this
			);
		}
	};
	
	ViewController.prototype.destroy = function() {
		if(this.view.destroy) {
			this.view.destroy();
		}
	};
	
	module.ViewController = ViewController;
	
	module.build = function(views) {
		trace('PhaserView/factory, views = ', views);
		var collection = {};

		Polyworks.Utils.each(views,
			function(view) {
				trace('\tview.type = ' + view.type);
				collection[view.id] = new Polyworks.PhaserView.ViewController(view);
				if(view.type === viewTypes.GROUP) {
					collection[view.id].children = Polyworks.PhaserView.build(view.views);
					Polyworks.PhaserView.initGroup(collection[view.id]);
				}
			},
			this
		);
		trace('PhaserView, end build, collection = ', collection);
		return collection;
	};
	
	module.initGroup = function(controller) {
		trace('PhaserView/initGroup, controller = ', controller);
		Polyworks.Utils.each(
			controller.children,
			function(child) {
				trace('\tchild = ', child);
				controller.view.add(child.view);
				child.group = controller;
			},
			this
		);

	};
	
	return module;
}());