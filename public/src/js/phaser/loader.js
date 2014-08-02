PWG.PhaserLoader = function() {
	var _config;
	var _phaser;
	
	var module = {};
	
	module.loaded = {
		images: {},
		sprites: {},
		tilemaps: {},
		audio: {}
	};

	module.init = function(config, phaser) {
		trace('PhaserLoader/init, config = ', config);
		_config = config;
		_phaser = phaser;
		
		_initAssets(config.images, 'images');
		_initAssets(config.sprites, 'sprites');
		_initAssets(config.tilemaps, 'tilemaps');
		_initAssets(config.audio, 'audio');
	}
	
	module.load = function(assets) {
		trace('PhaserLoader/load, assets = ', assets);
		
		// IMAGES
		if(assets.images) {
			// var images = _config.images;
			var images = PWG.Game.config.assets.images;
			trace('\timages = ', images);
			PWG.Utils.each(
				assets.images,
				function(key) {
					if(!this.loaded.images[key]) {
						trace('\t------- loading: image = ' + key + ', url = ' + images[key]);
						_phaser.load.image(key, images[key]);
						this.loaded.images[key] = true;
					}
				},
				this
			);
		}
		
		// SPRITES
		if(assets.sprites) {
			// var sprites = _config.sprites;
			var sprites = PWG.Game.config.assets.sprites;
			
			PWG.Utils.each(
				assets.sprites,
				function(key) {
					if(!this.loaded.sprites[key]) {
						trace('\tloading: sprite = ' + key + ', url = ' + sprites[key].url);
						var sprite = sprites[key];
						_phaser.load.spritesheet(key, sprite.url, sprite.width, sprite.height);
						this.loaded.sprites[key] = true;
					}
				},
				this
			);
		}

		// TILEMAPS
		if(assets.tilemaps) {
			var tilemaps = PWG.Game.config.assets.tilemaps;
			
			PWG.Utils.each(
				assets.tilemaps,
				function(key) {
					if(!this.loaded.tilemaps[key]) {
						trace('\tloading: tilemap = ' + key + ', url = ' + tilemaps[tilemap].url);
						var tilemap = tilemaps[key];
						_phaser.load.tilemap(key, tilemap.url, null, tilemap.type); // Phaser.Tilemap.TILED_JSON = 1
					}
				},
				this
			);
		}
	}
	
	function _initAssets(assets, type) {
		trace('Loader/_initAssets, this = ', this);
		PWG.Utils.each(
			assets,
			function(asset, key) {
				module.loaded[type][key] = false;
			},
			this
		);		
	}
	
	return module;
}();