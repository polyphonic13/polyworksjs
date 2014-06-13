PWG.ViewManager = function() {
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
			PWG.PhaserPositioner.set(config.position, this.view);
		}

		if(config.input) {
			this.inputController = new PWG.PhaserInput.InputController(config.input, this);
		}

		if(config.animation) {
			this.animationController = new PWG.PhaserAnimation.AnimationController(config.animation, this);
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
		PWG.Utils.each(
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
		if(method === 'setText' && this.config.position) {
			PWG.PhaserPositioner.set(this.config.position, this.view);
		}	
	};
	
	ViewController.prototype.hide = function() {
		// trace('ViewController, hide, this = ', this);
		if(this.children) {
			PWG.Utils.each(
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
			PWG.Utils.each(
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
			PWG.Utils.each(
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
	
	module.currentGroup = '';
	module.collection = {};
	
	module.init = function(views) {
		this.collection = this.build(views);
		// trace('ViewManager/init, collection = ', this.collection);
	};
	
	module.build = function(views, collection) {
		// trace('ViewManager/factory, views = ', views);
		var collection = collection || {};

		PWG.Utils.each(views,
			function(view, key) {
				// trace('\tview.type = ' + view.type);
				var child = new PWG.ViewManager.ViewController(view, key);
				if(view.type === viewTypes.GROUP) {
					child.children = PWG.ViewManager.build(view.views);
					PWG.ViewManager.initGroup(child);
				}
				collection[view.name] = child
			},
			this
		);
		// trace('ViewManager, end build, collection = ', collection);
		return collection;
	};
	
	module.initGroup = function(controller) {
		// trace('ViewManager/initGroup, controller = ', controller);
		PWG.Utils.each(
			controller.children,
			function(child) {
				// trace('\tchild = ', child);
				controller.view.add(child.view);
				child.group = controller;
			},
			this
		);

	};

	module.showGroup = function(name) {
		trace('ViewManager/showGroup, name = ' + name + ', collection = ', this.collection);
		this.collection[name].show();
		this.currentGroup = name;
	};
	
	module.hideGroup = function(name) {
		this.collection[name].hide();
		this.currentGroup = '';
	};
	
	module.switchGroup = function(name) {
		if(name !== this.currentGroup) {
			if(this.currentGroup !== '') {
				this.hideGroup(this.currentGroup);
			}
			this.showGroup(name);
			this.currentGroup = name;
		}
	};
	
	module.hideAllGroups = function() {
		PWG.Utils.each(
			this.collection,
			function(child) {
				child.hide();
			},
			this
		);
	};
	
	module.addToGroup = function(children, group) {
		trace('ViewManager/addToGroup, group = ', group, '\tchildren = ', children);
		PWG.Utils.each(
			children,
			function(child, key) {
				group.add(child.view);
				// group.children[key] = child;
			},
			this
		);
	};
	
	module.removeFromGroup = function(children, controller) {
		PWG.Utils.each(
			children,
			function(child, key) {
				controller.view.remove(child.view, true);
				delete controller.children[key];
			},
			this
		);
	};
	
	module.removeGroupChildren = function(path) {
		var controller = module.getControllerFromPath(path);
		trace('view manager removeGroupChild, group = ', controller);
		module.removeFromGroup(controller.children, controller);
	};
	
	module.addView = function(view, parent, addToGroup) {
		trace('ViewManager/addView, view.type = ' + view.type + ', view = ', view, 'parent = ', parent);
		var collection = (parent) ? parent.children : this.collection;

		var child = new PWG.ViewManager.ViewController(view, view.name);
		if(view.type === viewTypes.GROUP) {
			child.children = PWG.ViewManager.build(view.views);
			PWG.ViewManager.initGroup(child);
		}
		collection[view.name] = child;

		// trace('POST ADD, collection = ', collection);
		if(addToGroup) {
			PWG.ViewManager.initGroup(parent);
			// parent.view.add(child.view);
			// the parent was passed and is a group type view controller
			// PWG.ViewManager.addToGroup(view, parent.view);
		}
	};
	
	module.removeView = function(name, collection) {
		// trace('PhaserVeiw/removeView, name = ' + name + ', collection = ', collection);
		if(collection.children.indexOf(name) > -1) {
			collection.children[name].view.destroy();
			delete collection.children[name];
		}
	};
	
	module.showView = function(path) {
		var controller = this.getControllerFromPath(path);
		// trace('show view, controller is: ', controller);
		controller.show()
	};
	
	module.hideView = function(path) {
		trace('hideView: ' + path);
		var controller = this.getControllerFromPath(path);
		trace('\thiding: ', controller);
		controller.hide()
	};
	
	module.callMethod = function(path, method, args) {
		// trace('ViewManager/callViewMethod\n\tpath: ' + path + '\n\tmethod: ' + method + '\n\targs: ' + args);
		var controller = this.getControllerFromPath(path);
		// trace('calling method ' + method + 'with args: ', args, ' on ', controller);
		controller.callMethod(method, args);
	};

	module.swapDepths = function(path, child1, child2) {
		var parent = this.getControllerFromPath(path);
		trace('parent = ' + parent);
	};
	
	module.setChildFrames = function(path, frame) {
		var parent = this.getControllerFromPath(path);
		PWG.Utils.each(
			parent.children,
			function(child) {
				child.view.frame = frame;
			},
			this
		);
	};
	
	module.setFrame = function(path, frame) {
		var controller = this.getControllerFromPath(path);
		controller.view.frame = frame;
	};
	
	module.getControllerFromPath = function(path) {
		// trace('ViewManager/getControllerFromPath, path = ' + path + ', collection = ', this.collection);
		var chain = path.split(':');
		var length = chain.length;
		var controller = this.collection[chain[0]];
		// trace('\tcontroller = ', controller);
		for(var i = 1; i < length; i++) {
			// trace('\tchain['+i+'] = ' + chain[i] + ', controller now = ', controller);
			controller = controller.children[chain[i]];
		}
		return controller;
	};
	
	module.update = function(controllers) {
		PWG.Utils.each(
			controllers,
			function(controller) {
				controller.update();
			},
			this
		);
	};

	return module;
}();