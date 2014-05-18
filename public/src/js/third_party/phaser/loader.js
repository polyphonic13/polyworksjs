Polyworks.PhaserLoader = (function() {
	var _config;
	var _phaser;
	
	var module = {};
	
	module.loaded = {
		images: {},
		sprites: {}
	};
	
	module.init = function(config, phaser) {
		trace('PhaserLoader/init, config = ', config);
		_config = config;
		_phaser = phaser;
		
		Polyworks.Utils.each(
			config.images,
			function(image, key) {
				this.loaded.images[key] = false;
			},
			this
		);
	}
	
	module.load = function(assets) {
		trace('PhaserLoader/load, assets = ', assets);
		
		if(assets.images) {
			var images = _config.images;
			trace('\timages = ', images);
			Polyworks.Utils.each(
				assets.images,
				function(image) {
					trace('\timage = ' + image + ', url = ' + images[image]);
					if(!this.loaded.images[image]) {
						_phaser.load.image(image, images[image]);
						this.loaded.images[image] = true;
					}
				},
				this
			);
		}
	}
	
	return module;
}());