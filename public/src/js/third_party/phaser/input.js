Polyworks.PhaserInput = (function() {
	var module = {};
	
	function InputController(config, sprite, id) {
		trace('InputController/constructor, config = ', config, '\tsprite = ', sprite);
		this.config = config;
		this.sprite = sprite;
		this.id = id;
		
		sprite.inputEnabled = true;

		Polyworks.Utils.each(
			this.config.attrs,
			function(attr, key) {
				sprite.input[key] = attr;
			},
			this
		);

		// sprite.input.enableDrag(true, true);
		if(this.config.enableDrag) sprite.input.enableDrag(this.config.enableDrag);
		if(this.config.inputDown) sprite.events.onInputDown.add(this.inputDown, this);
		if(this.config.inputUp) sprite.events.onInputUp.add(this.inputUp, this);
		
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