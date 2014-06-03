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
			var images = _config.images;
			// trace('\timages = ', images);
			PWG.Utils.each(
				assets.images,
				function(image) {
					if(!this.loaded.images[image]) {
						// trace('\t------- loading: image = ' + image + ', url = ' + images[image]);
						_phaser.load.image(image, images[image]);
						this.loaded.images[image] = true;
					}
				},
				this
			);
		}
		
		// SPRITES
		if(assets.sprites) {
			var sprites = _config.sprites;
			PWG.Utils.each(
				assets.sprites,
				function(sprite) {
					if(!this.loaded.sprites[sprite]) {
						// trace('\tloading: sprite[' + sprite + '] = ', sprites[sprite]);
						_phaser.load.spritesheet(sprite, sprites[sprite].url, sprites[sprite].width, sprites[sprite].height);
					}
				},
				this
			);
		}

		// TILEMAPS
		if(assets.tilemaps) {
			var tilemaps = _config.tilemaps;
			PWG.Utils.each(
				assets.tilemaps,
				function(tilemap) {
					if(!this.loaded.tilemaps[tilemap]) {
						// trace('\tloading: tilemap = ' + tilemap + ', url = ' + tilemaps[tilemap]);
						_phaser.load.tilemap(tilemap, tilemaps[tilemap], null, Phaser.Tilemap.TILED_JSON ); // Phaser.Tilemap.TILED_JSON = 1
					}
				},
				this
			);
		}
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