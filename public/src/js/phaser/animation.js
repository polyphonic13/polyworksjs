Polyworks.PhaserAnimation = (function() {
	
	var module = {};

	function AnimationController(config, controller, id) {
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		var animations = config.animations;
		this.currentAnimation = config.defaultAnimation || '';

		Polyworks.each(
			animations,
			function(animation, key) {
				controller.view.animations.add(key, animation.keyFrames, animation.frameRate);
			},
			this
		);
		if(defaultAnimation) {
			var animation = animations[defaultAnimation];
			this.play(defaultAnimation, animation.frameRate, animation.looped);
		} else {
			controller.view.frame = 0;
		}
	}
	
	AnimationController.prototype.play = function(name, killOnComplete) {
		if(name !== this.currentAnimation) {
			var kill = killOnComplete || false;
			var animation = this.animations[name];
			this.animations.play(name, animation.frameRate, animation.looped, kill);
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
	
	return module;
}());