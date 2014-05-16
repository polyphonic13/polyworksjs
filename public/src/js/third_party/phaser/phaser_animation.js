Polyworks.PhaserAnimation = (function() {
	
	var module = {};

	function Animator(sprite, animations, defaultAnimation) {
		this.sprite = sprite;
		this.animations = animations;
		this.currentAnimation = defaultAnimation || '';
		
		Polyworks.each(
			animations,
			function(animation, key) {
				sprite.animations.add(key, animation.keyFrames, animation.frameRate);
			},
			this
		);
		if(defaultAnimation) {
			var animation = animations[defaultAnimation];
			this.play(defaultAnimation, animation.frameRate, animation.looped)
		}
	}
	
	Animator.prototype.play = function(name, killOnComplete) {
		if(name !== this.currentAnimation) {
			var kill = killOnComplete || false;
			var animation = this.animations[name];
			this.animations.play(name, animation.frameRate, animation.looped, kill);
			this.currentAnimation = name;
		}
	};;
	
	Animator.prototype.stop = function() {
		this.sprite.animations.stop();
		this.currentAnimation = '';
	};
	
	module.Animator = Animator;
	
	return module;
}());