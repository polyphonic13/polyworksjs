PWG.PhaserInput = (function() {
	var module = {};
	var _controllers = {};
	
	function InputController(config, controller) {
		// trace('InputController/constructor, config = ', config, '\tcontroller = ', controller);
		this.config = config;
		this.controller = controller;
		this.name = controller.view.name;

		var view = controller.view;

		view.inputEnabled = true;

		PWG.Utils.each(
			this.config.attrs,
			function(attr, key) {
				view.input[key] = attr;
			},
			this
		);

		if(this.config.enableDrag) view.input.enableDrag(this.config.enableDrag);
		if(this.config.inputDown) view.events.onInputDown.add(this.inputDown, this);
		if(this.config.inputUp) view.events.onInputUp.add(this.inputUp, this);
		if(this.config.onDragStop) view.events.onDragStop.add(this.onDragStop, this);

	}
	
	InputController.prototype.enableDrag = function(params) {
		var drag = params || this.config.enableDrag;
		this.controller.view.input.enableDrag();
	};
	
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
	
	InputController.prototype.onDragStop = function(event) {
		// trace('InputController['+this.name+']/onDragStop, event = ', event, '\tconfig = ', this.config);
		if(this.config.onDragStop) {
			this.config.onDragStop.call(this);
		}
	};
	
	InputController.prototype.drag = function(event) {
		
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
	
	module.InputController = InputController; 

	module.CameraDragger = CameraDragger;

	module.initKeyboard = function(controls) {
		// trace('--------- PhaserInput/initKeyboard, controls = ', controls);
		module.keys = {};
		
		PWG.Utils.each(
			controls,
			function(control) {
				var key;
				var input = {};
				// trace('\tadding control: ', control);
				key = PhaserGame.phaser.input.keyboard.addKey(control.code);
				if(control.inputDown) {
					// trace('\t\tadding input down: ', control.inputDown);
					// key.onDown.add(control.inputDown);
					input.inputDown = control.inputDown;
				}
				if(control.inputUp) {
					// trace('\t\tadding input up: ', control.inputUp);
					// key.onUp.add(control.inputUp);
					input.inputUp = control.inputUp;
				}
				module.keys[control.code] = {
					key: key,
					input: input
				};
			},
			this
		);
		// return keys;
	};
	
	module.updateKeyboard = function(controls) {
		// trace('PhaserInput/updateKeyboard');
		PWG.Utils.each(
			module.keys,
			function(control, id) {
				// trace('control['+id+']');
				if(control.key.isDown && control.input.inputDown) {
					// trace('control['+id+']/isDown');
					control.input.inputDown();
				}
				if(control.key.isUp && control.input.inputUp) {
					control.input.inputDown();
				}
			},
			this
		);
	};
	return module;
}());