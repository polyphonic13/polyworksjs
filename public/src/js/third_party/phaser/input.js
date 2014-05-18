Polyworks.PhaserInput = (function() {
	var module = {};
	
	function InputController(config, sprite) {
		trace('InputController/constructor, config = ', config, '\tsprite = ', sprite);
		this.config = config;
		this.sprite = sprite;
		
		sprite.events.onInputDown = this.inputDown;
		sprite.events.onInputUp = this.inputUp;
		
		sprite.input.start;
	}
	
	InputController.prototype.inputDown = function(event) {
		if(this.config.inputDown) {
			this.config.inputDown.call(this);
		}
	};
	
	InputController.prototype.inputUp = function(event) {
		if(this.config.inputUp) {
			this.config.inputUp.call(this);
		}
	};
	
	module.InputController = InputController; 
	
	return module;
}());