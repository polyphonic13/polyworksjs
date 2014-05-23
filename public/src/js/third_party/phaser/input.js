Polyworks.PhaserInput = (function() {
	var module = {};
	var _controllers = {};
	
	function InputController(config, controller) {
		trace('InputController/constructor, config = ', config, '\tcontroller = ', controller);
		this.config = config;
		this.controller = controller;
		this.name = controller.name;

		var view = controller.view;

		view.inputEnabled = true;

		Polyworks.Utils.each(
			this.config.attrs,
			function(attr, key) {
				view.input[key] = attr;
			},
			this
		);

		if(this.config.enableDrag) view.input.enableDrag(this.config.enableDrag);
		if(this.config.inputDown) view.events.onInputDown.add(this.inputDown, this);
		if(this.config.inputUp) view.events.onInputUp.add(this.inputUp, this);

	}
	
	InputController.prototype.inputDown = function(event) {
		// trace('InputController['+this.name+']/inputDown, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputDown) {
			this.config.inputDown.call(this);
		}
	};
	
	InputController.prototype.inputUp = function(event) {
		// trace('InputController['+this.name+']/inputUp, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputUp) {
			this.config.inputUp.call(this);
		}
	};
	
	InputController.prototype.drag = function(event) {
		
	};
	
	InputController.prototype.test = function() {
		trace('test');
	};
	
	function CameraDragger(config) {
		this.name = config.name;
		this.config = config;
		this.camera = null;
	};
	
	CameraDragger.prototype.update = function() {
	    this.dragCamera(PhaserGame.phaser.input.mousePointer);
	    this.dragCamera(PhaserGame.phaser.input.pointer1);
	};
	
	CameraDragger.prototype.dragCamera = function(pointer) {
	    if (!pointer.timeDown) { return; }
	    if (pointer.isDown && !pointer.targetObject) {

	        if (this.camera) {
				// trace('pointer is down and there is a camera, going to move it');
	            PhaserGame.phaser.camera.x += this.camera.x - pointer.position.x;
	            PhaserGame.phaser.camera.y += this.camera.y - pointer.position.y;
	        }
	        this.camera = pointer.position.clone();
	    }
	    if (pointer.isUp) { this.camera = null; }
	};
	
	module.CameraDragger = CameraDragger;
	
	module.InputController = InputController; 
	
	return module;
}());