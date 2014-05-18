Polyworks.PhaserSprite = (function() {

	function PhaserSprite(config) {
		trace('PhaserSprite/constructor, config = ', config);
		this.id = config.id;
		this.config = config;
		this.sprite = PhaserGame.phaser.add.sprite(config.x, config.y, config.img);
		this.sprite.width = config.width;
		this.sprite.height = config.height;
		
		if(config.input) {
			this.inputController = new Polyworks.PhaserInput.InputController(config.input, this.sprite, this.id);
		}
	}

	PhaserSprite.prototype.show = function() {
		trace('PhaserSprite['+this.id+']/show')
	};
	
	PhaserSprite.prototype.hide = function() {
		
	};
	
	return PhaserSprite
}());