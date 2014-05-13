Polyworks.ImageManager = (function() {
	var _this;
	
	function ImageManager(images, callback) {
		_this = this;
		this.numToLoad = images.length;
		this.numLoaded = 0;
		this.model = images;
		this.callback = callback;
		this.images = {};

		for(var i = 0; i < images.length; i++) {
			this.images[images[i].id] = new Image();
			this.images[images[i].id].onload = function() {
				_this.imageLoaded();
			}
			this.images[images[i].id].src = images[i].src;
		}
	}
	
	ImageManager.prototype.imageLoaded = function() {
		this.numLoaded++;
		// trace('numLoaded = ' + this.numLoaded + ', numToLoad = ' + this.numToLoad);
		if(this.numLoaded === this.numToLoad) {
			// trace('all images loaded');
			this.callback();
		}
	}
	
	ImageManager.prototype.getImage = function(name) {
		return _this.images[name];
	};
	
	return ImageManager;
})();