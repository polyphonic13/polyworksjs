Polyworks.PhaserView = (function() {
	var viewTypes = {
		SPRITE: 'sprite',
		TEXT: 'text',
		BUTTON: 'button',
		GROUP: 'group'
	};
	
	var module = {};
	
	function ViewController(config, name) {
		// trace('ViewController['+config.name+']/constructor, type = ' + config.type + ', name = ' + name);
		this.name = name;
		this.config = config;

		switch(config.type) {
			case viewTypes.SPRITE:
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
			// trace('warning, unknown view type: ' + config.type);
			break;
		}

		this.set(config.attrs);

		if(config.position) {
			Polyworks.PhaserPositioner.set(config.position, this.view);
		}

		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this);
		}

		if(config.animation) {
			this.animationController = new Polyworks.PhaserAnimation.AnimationController(config.animation, this);
		}

		if(config.physical && this.view.body) {
			this.physicsController = new Polworks.PhaserPhysics.PhysicsController(config.physical, this);
		}

		this.view.name = this.name = config.name;
	};
	
	ViewController.prototype.update = function() {
		if(this.view.update) {
			this.view.update();
		}
	};
	
	ViewController.prototype.set = function(params) {
		// trace('ViewController/set, view = ', this.view);
		Polyworks.Utils.each(
			params,
			function(param, key) {
				// trace('\tparam['+key+'] = ' + param);
				this.view[key] = param;
			},
			this
		);
	};
	
	ViewController.prototype.callMethod = function(method, args) {
		// trace('ViewController['+this.name+']/callMethod, method = ' + method + '\n\targs = ' + args);
		if(this.view[method]) {
			// trace('\tview has method, ', this.view);
			this.view[method](args);
		}
	};
	
	ViewController.prototype.hide = function() {
		// trace('ViewController, hide, this = ', this);
		if(this.children) {
			Polyworks.Utils.each(
				this.children,
				function(child) {
					// trace('\thiding child: ', child);
					child.hide();
				},
			this
			);
		}
		this.view.visible = false;
	};
	
	ViewController.prototype.show = function() {
		if(this.children) {
			Polyworks.Utils.each(
				this.children,
				function(child) {
					// trace('\tshowing child: ', child);
					child.show();
				},
			this
			);
		}		this.view.visible = true;
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
	
	module.build = function(views, collection) {
		// trace('PhaserView/factory, views = ', views);
		var collection = collection || {};

		Polyworks.Utils.each(views,
			function(view, key) {
				// trace('\tview.type = ' + view.type);
				collection[view.name] = new Polyworks.PhaserView.ViewController(view, key);
				if(view.type === viewTypes.GROUP) {
					collection[view.name].children = Polyworks.PhaserView.build(view.views);
					Polyworks.PhaserView.initGroup(collection[view.name]);
				}
			},
			this
		);
		// trace('PhaserView, end build, collection = ', collection);
		return collection;
	};
	
	module.initGroup = function(controller) {
		// trace('PhaserView/initGroup, controller = ', controller);
		Polyworks.Utils.each(
			controller.children,
			function(child) {
				// trace('\tchild = ', child);
				controller.view.add(child.view);
				child.group = controller;
			},
			this
		);

	};

	module.addToGroup = function(children, group) {
		Polyworks.Utils.each(
			children,
			function(child, key) {
				group.view.add(child.view);
				group.children[key] = child;
			},
			this
		);
	};
	
	module.removeFromGroup = function(children, group) {
		Polyworks.Utils.each(
			children,
			function(child, key) {
				group.view.remove(child.view, true);
				delete group.children[key];
			},
			this
		);
	};
	
	module.addView = function(view, collection) {
		// trace('PhaserView/addView, view.type = ' + view.type + ', view = ', view, 'collection = ', collection);
		collection[view.name] = new Polyworks.PhaserView.ViewController(view, view.name);
		if(view.type === viewTypes.GROUP) {
			// trace('\tit is a group, going to call build on it');
			collection[view.name].children = Polyworks.PhaserView.build(view.views);
			Polyworks.PhaserView.initGroup(collection[view.name]);
		}
	};
	
	module.removeView = function(name, collection) {
		trace('PhaserVeiw/removeView, name = ' + name + ', collection = ', collection);
		Polyworks.Utils.each(
			collection,
			function(child, key) {
				if(child.view.name === name) {
					trace('\tremoving ', child);
					child.view.destroy();
					if(child.group) {
						child.group.view.destroy();
					}
					delete collection[key];
				}
			},
			this
		);
	};
	
	module.update = function(controllers) {
		Polyworks.Utils.each(
			controllers,
			function(controller) {
				controller.update();
			},
			this
		);
	};

	return module;
}());