PWG.PhaserLoader = function() {
	var _config;
	var _phaser;
	
	var module = {};
	
	module.loaded = {
		images: {},
		sprites: {},
		tilemaps: {}
	};
	
	module.init = function(config, phaser) {
		// trace('PhaserLoader/init, config = ', config);
		_config = config;
		_phaser = phaser;
		
		_initAssets(config.images, 'images');
		_initAssets(config.sprites, 'sprites');
		_initAssets(config.tilemaps, 'tilemaps');
		
	}
	
	module.load = function(assets) {
		// trace('PhaserLoader/load, assets = ', assets);
		
		// IMAGES
		if(assets.images) {
			// var images = _config.images;
			var images = assets.images;
			// trace('\timages = ', images);
			PWG.Utils.each(
				assets.images,
				function(image, key) {
					if(!this.loaded.images[key]) {
						// trace('\t------- loading: image = ' + key + ', url = ' + image);
						_phaser.load.image(key, image);
						this.loaded.images[key] = true;
					}
				},
				this
			);
		}
		
		// SPRITES
		if(assets.sprites) {
			// var sprites = _config.sprites;
			var sprites = assets.sprites;
			
			PWG.Utils.each(
				assets.sprites,
				function(sprite, key) {
					if(!this.loaded.sprites[key]) {
						// trace('\tloading: sprite = ' + key + ', url = ' + sprite.url);
						_phaser.load.spritesheet(key, sprite.url, sprite.width, sprite.height);
						this.loaded.sprites[key] = true;
					}
				},
				this
			);
		}

		// TILEMAPS
		// if(assets.tilemaps) {
		// 	// var tilemaps = _config.tilemaps;
		// 	var tilemaps = assets.tilemaps;
		// 	
		// 	PWG.Utils.each(
		// 		assets.tilemaps,
		// 		function(tilemap) {
		// 			if(!this.loaded.tilemaps[tilemap]) {
		// 				// trace('\tloading: tilemap = ' + tilemap + ', url = ' + tilemaps[tilemap]);
		// 				_phaser.load.tilemap(tilemap, tilemaps[tilemap], null, Phaser.Tilemap.TILED_JSON ); // Phaser.Tilemap.TILED_JSON = 1
		// 			}
		// 		},
		// 		this
		// 	);
		// }
	}
	
	function _initAssets(assets, type) {
		// trace('Loader/_initAssets, this = ', this);
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