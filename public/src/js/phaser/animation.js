PWG.PhaserAnimation = function() {
	
	var module = {};

	function AnimationController(config, controller, id) {
		trace('AnimationController, id = ' + id + '\n\tconfig = ', config, '\tcontroller = ', controller)
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		this.animations = config.animations;

		PWG.Utils.each(
			this.animations,
			function(animation, key) {
				trace('\tnow adding animation: ' + key, animation);
				controller.view.animations.add(key, animation.keyFrames, animation.frameRate);
			},
			this
		);

		trace('\tanimations now = ', controller.view.animations);

		if(config.defaultAnimation) {
			var animation = this.animations[config.defaultAnimation];
			this.play(config.defaultAnimation);
		} else {
			controller.view.frame = 0;
		}
		this.currentAnimation = config.defaultAnimation || '';
	}

	AnimationController.prototype.play = function(name, killOnComplete) {
		trace('AnimationController/play, name = ' + name);
		if(name !== this.currentAnimation) {
			var kill = killOnComplete || false;
			var animation = this.animations[name];
			trace('\tgoing to call play on it');
			this.controller.view.animations.play(name, animation.frameRate, animation.looped, kill);
			this.currentAnimation = name;
		}
	};

	AnimationController.prototype.gotoFrame = function(frame) {
		this.controller.view.frame = frame;
	};

	AnimationController.prototype.stop = function() {
		this.controller.view.animations.stop();
		this.currentAnimation = '';
	};

	module.AnimationController = AnimationController;

	module.controllers = {};

	module.addAnimations = function(config, view) {
		var controller = new AnimationController(config, view); 
		module.controllers[controller.name] = controller;
	};

	module.play = function(view, animation, killOnComplete) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].play(animation, killOnComplete);
		}
	};

	module.gotoFrame = function(view, frame) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].gotoFrame(frame);
		}
	};

	module.stop = function(view) {
		if(module.controllers.hasOwnProperty(view)) {
			module.controllers[view].stop();
		}
	};

	return module;
}();