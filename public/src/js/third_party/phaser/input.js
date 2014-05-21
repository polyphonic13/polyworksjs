Polyworks.PhaserInput = (function() {
	var module = {};
	var _controllers = {};
	
	function InputController(config, view, id) {
		trace('InputController/constructor, config = ', config, '\tview = ', view);
		this.config = config;
		this.view = view;
		this.id = id;
		
		view.inputEnabled = true;

		Polyworks.Utils.each(
			this.config.attrs,
			function(attr, key) {
				view.input[key] = attr;
			},
			this
		);

		// view.input.enableDrag(true, true);
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