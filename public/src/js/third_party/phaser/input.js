Polyworks.PhaserInput = (function() {
	var module = {};
	var _controllers = {};
	
	function InputController(config, controller, id) {
		trace('InputController/constructor, config = ', config, '\tcontroller = ', controller);
		this.config = config;
		this.controller = controller;
		this.id = id;

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
		trace('InputController['+this.id+']/inputDown, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputDown) {
			this.config.inputDown.call(this);
		}
	};
	
	InputController.prototype.inputUp = function(event) {
		trace('InputController['+this.id+']/inputUp, event = ', event, '\tconfig = ', this.config);
		if(this.config.inputUp) {
			this.config.inputUp.call(this);
		}
	};
	
	module.InputController = InputController; 
	
	return module;
}());