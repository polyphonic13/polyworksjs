Polyworks.PhaserPhysics = (function() {
	var module = {};

	module.controllers = [];
	
	function PhysicsController(config, controller) {
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		var physics = config.physics;

	 	Polyworks.Utils.each(
			config.physics,
			function(attr, key) {
				controller.view.body[key] = attr;
			},
			this
		);

		// if(!physics.deferredGravity && !physics.immovable) {
		// 	if(!physics.gravity) {
		// 		controller.view.body.gravity = PhaserGame.get('gravity');
		// 	}
		// }
		module.controllers.push(this);
	}
	
	PhysicsController.prototype.checkCollision = function(target) {
		module.physics.collide(this.controller.view, target);
	};
	
	PhysicsController.prototype.checkOverlap = function(target, callback, context) {
		var ctx = context || this.controller.view;
		module.physics.overlap(
			this.controller.view, 
			target, 
			function(view, target) {
				callback.call(ctx, view, target);
			},
			null,
			this.controller.view
		);
	};
	
	PhysicsController.prototype.deactivateGravity = function() {
		var view = this.controller.view;
		view.exists = false;
		view.allowGravity = false;
		view.body.gravity = 0;
	};
	
	PhysicsController.prototype.activateGravity = function() {
		var view = this.controller.view;
		if(this.config.deferredGravity) {
			var gravity = (this.config.physics.gravity) ? this.config.physics.gravity : PhaserGame.get('gravity');
			view.body.gravity = gravity;
		}
		view.allowGravity = true;
		view.exists = true;
	};
	
	module.PhysicsController = PhysicsController; 
	
	module.init = function() {
		module.physics = PhaserGame.phaser.physics; 
	};
	
	module.checkAllCollisions = function(targets) {
		Polyworks.Utils.each(
			module.controllers,
			function(controller) {
				module.checkCollisions(controller, targets);
			},
			this
		);
	};
	
	module.checkCollisions = function(controller, targets) {
		module.checkPhysics('checkCollision', controller, targets, null, null);
	};
	
	module.checkAllOverlaps = function(targets, callback, context) {
		Polyworks.Utils.each(
			module.controllers,
			function(controller) {
				module.checkOverlaps(controller, targets, callback, context);
			},
			this
		);
	};
	
	module.checkOverlaps = function(controller, targets) {
		module.checkPhysics('checkOverlap', controller, callback, context);
	};
	
	module.checkPhysics = function(method, controller, callback, context) {
		context = context || controller;
		if(targets instanceof Array) {
			Polyworks.Utils.each(
				targets,
				function(target) {
					controller[method].call(context, target, callback, context);
				},
				this
			);
		} else {
			controller[method].call(context, target, callback, context);
		}
	};
	
	return module;
}());