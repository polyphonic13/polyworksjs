Polyworks.DOMManager = (function() {
	var _bodyEl = document.getElementsByTagName('body')[0];
	var _headEl = document.getElementsByTagName('head')[0];
	
	var module = {
		addElements: function(elements, parentEl) {
			var pops = parentEl || _bodyEl;
			Polyworks.Utils.each(
				elements,
				function(element) {
					trace('DOMManager/addElements, type = ' + element.type + ', element = ', element);
					var el = document.createElement(element.type);

					if(element.attrs) { el = this.addAttributes(element.attrs, el); }
					if(element.css) { el = this.addStyle(element.css, el); }
					if(element.className) { el.className = element.className; }
					if(element.html) { el.innerHTML = element.html; }

					pops.appendChild(el);
				},
			this
			);
		},

		addElementToBody: function(el) {
			_bodyEl.appendChild(el);
		},

		addElementToHead: function(el) {
			_headEl.appendChild(el);
		},

		addAttributes: function(attributes, el) {
			Polyworks.Utils.each(
				attributes,
				function(attribute, key) {
					el.setAttribute(key, attribute);
				},
				this
			);
			return el;
		},

		addStyle: function(styles, el) {
			Polyworks.Utils.each(
				styles,
				function(style, key) {
					el.style[key] = style;
				},
				this
			);
			return el;
		},

		loadScript: function(url, callback, context) {
			var ctx = context || window;
	        var script = document.createElement('script');
	        script.setAttribute('type', 'text/javascript');

	        if(script.readyState) {
	            script.onreadystatechange = function() {
	                if(script.readyState == 'loaded' || script.readyState == 'complete') {
						callback.call(ctx, url, script);
	                }
	            };
	        } else {
	            script.onload = function() {
					callback.call(ctx, url, script);
	            };
	        }
	        script.setAttribute('src', url);
			_head.appendChild(script);
		}
	};

	function ImageLoader(images, callback) {
		_this = this;
		this.numToLoad = images.length;
		this.numLoaded = 0;
		this.model = images;
		this.callback = callback;
		this.images = {};

		Polyworks.Utils.each(
			images,
			function(image) {
				this.images[image.name] = new Image();
				this.images[image.name].onload = function(loader) {
					loader.imageLoaded();
				}(this);
				this.images[image.name].src = image.src;
			},
			this
		);
	}

	ImageLoader.prototype = {
		imageLoaded: function() {
			this.numLoaded++;
			// trace('numLoaded = ' + this.numLoaded + ', numToLoad = ' + this.numToLoad);
			if(this.numLoaded === this.numToLoad) {
				// trace('all images loaded');
				this.callback();
			}
		},
		getImage: function(name) {
			return this.images[name];
		}
	};
	
	module.ImageLoader = ImageLoader; 
	
	return module;
}());