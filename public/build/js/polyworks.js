/*! polyworksjs v0.1.0 2014-05-16T09:15:42 */
var Polyworks = {};

// LOGGING
function trace(message) {
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = { log:function(){} };
	} else {
		Polyworks.Utils.each(arguments,
			function(a) {
				console.log(a);
			},
			this
		);
	}
}


Polyworks.Stage = (function() {
	var _aspectRatio = [16, 9];
	var _windowListeners = false;
	var _callback;
	var _context; 
	
	var module = {
		winW: 0,
		winH: 0,
		stageW: 0,
		stageH: 0,
		unit: 0,

		init: function(aspectRatio, resizable, callback, context) {
			if(typeof(aspectRatio) !== 'undefined') {
				_aspectRatio = aspectRatio;
			}
			_callback = callback;
			_context = context || window;

			_calculateSizes();

			if(resizable) {
				window.addEventListener('resize', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
				window.addEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
			}

		},

		destroy: function() {
			if(_windowListeners) {
				window.removeEventListener('resize', function(event) {
					_onSizeChange(event);
				});
				window.removeEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
				});
			}
		}
	};
	
	function _calculateSizes() {
		module.winW = document.documentElement.clientWidth; 
		module.winH = document.documentElement.clientHeight;

		module.height = (document.documentElement.clientHeight > 800) ? 800 : document.documentElement.clientHeight;
		module.width = ((document.documentElement.clientHeight/_aspectRatio[1]) * _aspectRatio[0]);

		if(module.width > document.documentElement.clientWidth) {
			module.width = document.documentElement.clientWidth;
			module.height = (module.width/_aspectRatio[0]) * _aspectRatio[1];
		}

		module.unit = module.height/_aspectRatio[1];
		var left = (document.documentElement.clientWidth/2) - (module.width/2);
		var top = (document.documentElement.clientHeight/2) - (module.height/2);

		trace('\nwinW = ' + module.winW + ', winH = ' + module.winH + '\nmodule.width = ' + module.width + ', module.height = ' + module.height + '\nunit = ' + module.unit + '\nleft = ' + left + ', top = ' + top);

		var loadingWidth = module.winW - 80;
		var loadingHeight = module.winH - 80;

		var loadingDiv = document.getElementById('loading');
		var containerDiv = document.getElementById('gameContainer');

		_sizeAndPositionDiv(loadingDiv, loadingWidth, loadingHeight, 0, 0);
		_sizeAndPositionDiv(containerDiv, module.winW, module.winH, 0, 0);

	}

	function _sizeAndPositionDiv(div, width, height, left, top) {
		if(div) {
			div.style.width = width + 'px';
			div.style.height = height + 'px';
			div.style.left = left + 'px';
			div.style.top = top + 'px';
			div.style.display = 'block';
		}
	}

	function _onSizeChange(event) {
		var containerDiv = document.getElementById('gameContainer');
		var left = (document.documentElement.clientWidth/2) - (module.width/2);
		var top = (document.documentElement.clientHeight/2) - (module.height/2);
		containerDiv.style.left = left + 'px';
		containerDiv.style.top = top + 'px';
	}

	return module;
}());


Polyworks.Utils = (function() {
	var module = {};

	module.each = function(list, callback, context) {
		if(Array.isArray(list)) {
			var length = list.length;
			for(var i = 0; i < length; i++) {
				callback.call(context, list[i], i, list);
			}
		} else {
			for(var key in list) {
				callback.call(context, list[key], key, list);
			}
		}
	};
	
	module.clone = function(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = Polyworks.Utils.clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = Polyworks.Utils.clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");	
	};

	module.extend = function(a, b) {
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		} 
		return a;
	};

	module.extract = function(obj, prop) {
		var a = obj[prop];
		if(obj !== window) { delete obj[prop]; }
		return a;
	};

	module.has = function(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};
	
	module.objLength = function(obj) {
		var length = 0;
		for(var key in obj) {
			// if(obj.hasOwnProperty(key)) { length++; }
			if(Utils.has(obj, key)) { length++; }
		}
		return length;
	};

	module.mixin = function(c, p) {
	    for(var k in p) if(p[k]) c[k] = p[k];
	};

	module.bind = function(o, f) {
	    return function() { return f.apply(o, arguments); };
	};

	module.inherits = function(c, p) {
	    this.mixin(c, p);
	    function f() { this.constructor = c; };
	    f.prototype = c._super = p.prototype;
	    c.prototype = new f();
	};

	module.isInView = function(pos) {
		if(pos.x > 0 && pos.x < stageConfig.width && pos.y > 0 && pos.y < stageConfig.height) {
			return true;
		} else {
			return false;
		}
	};
	
	module.parseMarkup = function(str, reference, encodeMarkup) {
		var parsedString = str;
		// trace('Utils/parseMarkup, str = ' + str + ', reference = ', reference);

		if(str.indexOf('~{') > -1) {
			var pattern = /~\{[A-Z]*\}~/gi;
			var patternMatch = str.match(pattern);
			if(patternMatch) {
				for (var matchNum in patternMatch) {
					var match = String(patternMatch[matchNum]);

					var matchLength = match.length;
					var matchKey = match.substring(2, matchLength - 2);
					var output = reference[matchKey];
					if(encodeMarkup) {
						output = encodeURIComponent(output);
					}
					// trace('output = ' + output);
					if(output === undefined || output === null) {
						output = match;
					} else {
						output = output.toString();
					}
					parsedString = parsedString.replace(match, output);
				}
				//trace(parsedString);
			} else {
				parsedString = null;
			}
		}

		return parsedString;
	};
	
	module.loadScript = function(url, evt) {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');

        if(scriptTag.readyState) {
            scriptTag.onreadystatechange = function() {
                if(scriptTag.readyState == 'loaded' || scriptTag.readyState == 'complete') {
                    // callback.call(evt);
					Polyworks.EventCenter.trigger(evt);
                }
            };
        } else {
            scriptTag.onload = function() {
                // callback.call(evt);
				Polyworks.EventCenter.trigger(evt);
            };
        }
        scriptTag.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
	};

	return module;
}());


Polyworks.EventCenter = (function() {

	var module = {};
	var _listeners = {}; 
	
	module.bind = function(type, callback, context) {
		var ctx = context || this;
		// trace('EventCenter/bind, type = ' + type);
		// trace(callback);
		if(!_listeners[type]) {
			_listeners[type] = [];
		}
		_listeners[type].push({ callback: callback, context: ctx });
		// trace('_listeners['+type+'] now = ');
		// trace(_listeners[type]);
	};
	
	module.trigger = function(params) {
		var list = _listeners[params.type];
		// trace('----- EventCenter/trigger, type = ' + params.type + ', list = ', list);
		if(list) {
			Polyworks.Utils.each(list,
				function(listener) {
					// trace('\t\tl = ', l);
					if(listener && listener.callback) { // in case callback is destroyed during course of trigger
						listener.callback.call(listener.context, params);
					}
				},
				this
			);
		}
	};
	
	module.unbind = function(type, callback) {
		var listeners = _listeners[type];
		if(listeners) {
			Polyworks.Utils.each(listeners,
				function(listener, idx) {
					if(listener && listener.callback === callback) {
						listeners.splice(idx, 1);
					}
				},
				this
			);
		}
	};

	module.destroy = function() {
		// iterate thru _listeners object
		// for each type, remove all array elements
		// then delete type from _listeners
		Polyworks.Utils.each(_listeners,
			function(listener, key) {
				listener = [];
				delete _listeners[key];
			},
			this
		);
		// set entire _listeners array to []
		_listeners = [];
	};
	
	return module;
}());

Polyworks.Events = {
	CHANGE_SCREEN: 'changeScreen'
};

Polyworks.PhaserAnimation = (function() {
	
	var module = {};

	function Animator(sprite, animations, defaultAnimation) {
		this.sprite = sprite;
		this.animations = animations;
		this.currentAnimation = defaultAnimation || '';
		
		Polyworks.each(
			animations,
			function(animation, key) {
				sprite.animations.add(key, animation.keyFrames, animation.frameRate);
			},
			this
		);
		if(defaultAnimation) {
			var animation = animations[defaultAnimation];
			this.play(defaultAnimation, animation.frameRate, animation.looped)
		}
	}
	
	Animator.prototype.play = function(name, killOnComplete) {
		if(name !== this.currentAnimation) {
			var kill = killOnComplete || false;
			var animation = this.animations[name];
			this.animations.play(name, animation.frameRate, animation.looped, kill);
			this.currentAnimation = name;
		}
	};;
	
	Animator.prototype.stop = function() {
		this.sprite.animations.stop();
		this.currentAnimation = '';
	};
	
	module.Animator = Animator;
	
	return module;
}());

Polyworks.PhaserPhysics = (function() {
	var module = {};
	
	return module;
}());

Polyworks.PhaserSprite = (function() {

	function PhaserSprite(config) {
		trace('PhaserSprite/constructor, config = ', config);
	}
	
	return PhaserSprite
}());

Polyworks.PhaserText = (function() {
	
}());

Polyworks.DisplayFactory = (function() {
	var module = {};
	
	module.createViews = function(views) {
		trace('DisplayFactory/createViews, views = ', views);
		var collection = [];
		
		Polyworks.Utils.each(views,
			function(view) {
				trace('\tview.type = ' + view.type);
				collection.push(new Polyworks[view.type](view));
			},
			this
		);
		
		return collection;
	};
	
	return module;
}());

Polyworks.ScreenManager = (function() {

	var module = {};
	
	function ScreenController(config) {
		trace('ScreenController/constructor, config = ', config);
		this.config = config;
		this.id = config.id;
		this.views = Polyworks.DisplayFactory.createViews(config.views);
	};
	
	ScreenController.prototype.activate = function() {
		trace('ScreenController['+this.id+']/activate');
		Polyworks.each(
			this.views,
			function(view) {
				view.show();
			},
			this
		);
		this.active = true;
	};
	
	ScreenController.prototype.update = function() {
		trace('ScreenController['+this.id+']/update');
		Polyworks.each(
			this.views,
			function(view) {
				view.update();
			},
			this
		);
	};
	
	ScreenController.prototype.deactive = function() {
		trace('ScreenController['+this.id+']/deactivate');
		Polyworks.each(
			this.views,
			function(view) {
				view.hide();
			},
			this
		);
		this.active = false;
	};
	
	ScreenController.prototype.destroy = function() {
		trace('ScreenController['+this.id+']/destroy');
		Polyworks.each(
			this.views,
			function(view, key) {
				view.destroy();
				delete this.views[key];
			},
			this
		);
	};
	
	module.ScreenController = ScreenController;
	
	module.init = function(config) {
		trace('ScreenManager/init, config = ', config);
		this.config = config;
		this.screens = {};
		this.currentId = '';

		Polyworks.Utils.each(
			config,
			function(scr) {
				trace('\tadding screen[' + scr.id + ']');
				this.screens[scr.id] = new this.ScreenController(scr);
			},
			this
		);
		trace('\tscreens = ', this.screens);
	};
	
	module.activate = function(id) {
		trace('ScreenManager/activate, id = ' + id + ', currentId = ' + this.currentId);
		if(this.currentId !== id) {
			if(this.screens.hasOwnProperty(id)) {
				if(this.currentId !== '') {
					this.screens[this.currentId].deactivate();
				}
				this.currentId = id;
				trace('\tscreens['+id+'] = ', this.screens[id]);
				this.screens[id].activate();
			}
		}
	};

	module.update = function() {
		this.screens[this.currentId].update();
	};
	
	module.deactivate = function(id) {
		if(this.screens.hasOwnProperty(id)) {
			this.screens[id].deactivate();
			if(this.currentId === id) {
				this.currentId = '';
			}
		}
	};
	
	module.deactivateAll = function() {
		Polyworks.Utils.each(
			this.screens,
			function(scr, id) {
				this.scr(id).deactivate();
			},
			this
		);
		this.currentId = '';
	};
	
	module.destroy = function() {
		
	};
	
	return module;
}());

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
				this.images[image.id] = new Image();
				this.images[image.id].onload = function(loader) {
					loader.imageLoaded();
				}(this);
				this.images[image.id].src = image.src;
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

Polyworks.SocialPanel = (function() {

	var _model = {};

	var module = {
		init: function(params) {
			// // trace('SocialPanel/init, params = ', params);
			_model = Polyworks.Utils.extend(_model, params);
			_initViews();
			_addListeners();
		},

		show: function(params) {
			// trace('SocialPanel/show, params = ', params);
			var elements = params.value;
			_model.parentEl.style.display = 'block';
			Polyworks.Utils.each(elements,
				function(element) {
					if(_model.buttons.hasOwnProperty(element)) {
						_model.buttons[element].style.visibility = 'visible';
					}
				},
				this
			);
		},

		showAll: function() {
			_model.parentEl.style.display = 'block';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'visible';
			}
		},

		hideAll: function() {
			_model.parentEl.style.display = 'none';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'hidden';
			}
		},

		buttonClick: function(network) {
			// trace('SocialPanel/buttonClick, network = ' + network + '\n\tcurrentActionType = ' + _model.currentActionType);
			var networkActions = _model.socialActions[network];
			if(networkActions) {
				// trace('\tnetworkActions = ', networkActions);
				var socialAction = networkActions[_model.currentActionType];
				if(socialAction) {
					// trace('\tsocialAction = ', socialAction);
					var url;
					if(socialAction['params']) {
						url = socialAction['url'] + Polyworks.Utils.parseMarkup(socialAction['params'], _model, true);
					} else {
						url = socialAction['url'];
					}
					// trace('\turl = ' + url);
					if(url.indexOf('mailto') > -1) {
						if(Polyworks.DeviceUtils.isIphone() || Polyworks.DeviceUtils.isAndroid()) {
							window.location.href = url;
						} else {
							window.open(url, '_blank');
						}
					} else {
						window.open(url, '_blank');
					}
				}
			}
		},

		changeData: function(params) {
			_model[params.type] = params.value;
		},

		destroy: function() {
			_removeListeners();
			_destroyViews();
		}
	};

	function _initViews() {
		_initParentEl(); 
		_addButtons();
	}

	function _initParentEl() {
		_model.parentEl = document.getElementById(_model.parentId) || document.getElementsByTagName('body')[0];
		_model.grandParentEl = _model.parentEl.parentNode;
	}

	function _addButtons() {
		_model.buttons = {};

		var buttonStyle = _model.buttonStyle;

		var buttonClass = _model.buttonClass || 'socialButton';
		var button;
		var style; 
		var length = _model.networks.length; 

		Polyworks.Utils.each(_model.networks,
			function(network, idx) {
				style = _calculateButtonStyle(buttonStyle, idx, length);
				button = {
					pops: _model.parentEl,
					id: network,
					el: 'img',
					attrs: {
						src: _model.imagePath + network + '.png',
						onclick: 'Polyworks.SocialPanel.buttonClick("'+network+'");'
					},
					className: buttonClass,
					style: style
				};
				_model.buttons[network] = Polyworks.Utils.addElement(button);
			},
			this
		);
	}

	function _calculateButtonStyle(attrs, idx, length) {
		var winW = Polyworks.Stage.winW;
		var winH = Polyworks.Stage.winH;
		var horizontal = attrs.position.horizontal;
		var vertical = attrs.position.vertical;
		var spacer = attrs.spacer; 
		var offset = attrs.offset || 0;
		
		var style = {
			width: attrs.size.width + 'px',
			height: attrs.size.height + 'px'
		};

		if(horizontal === 'center') {
			var horizontalTotal;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					horizontalTotal += attrs.spacer;
				}
				horizontalTotal += attrs.size.width;
			}

			style.left = ((winW/2) - (horizontalTotal/2) + (idx * attrs.size.width)) + 'px';
		} else if(horizontal < 0) {
			style.right = -(horizontal) + 'px';
		} else {
			style.left = horizontal + 'px';
		}

		if(vertical === 'center') {
			var verticalTotal = 0;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					verticalTotal += attrs.spacer;
				}
				verticalTotal += attrs.size.height;
			}
			// trace('\tVERTICAL TOTal = ' + verticalTotal);
			var btnOffset = (idx * attrs.size.height) +  (idx * attrs.spacer) + offset;
			style.top = ((winH/2) - (verticalTotal/2) + (btnOffset)) + 'px';
		} else if(vertical < 0) {
			style.bottom = -(vertical) + 'px';
		} else {
			style.top = vertical + 'px';
		}
		// trace('RETURNING: ', style);
		return style;
	}
	
	function _destroyViews() {
		var buttons = _model.buttons;
		var button;
		for(var key in buttons) {
			button = buttons[key];
			button.parentNode.removeChild(button);
		}
		if(_model.parentEl) {
			_model.parentEl.parentNode.removeChild(_model.parentEl);
		}
	}

	function _addListeners() {
		Polyworks.Utils.each(_model.listeners,
			function(listener) {
				Polyworks.EventCenter.bind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _removeListeners() {
		Polyworks.Utils.each(_model.listeners,
			function(listener) {
				Polyworks.EventCenter.unbind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _eventHandler(event) {
		// trace('SocialPanel/_eventHandler event = ', event);
		var listener;
		Polyworks.Utils.each(_model.listeners,
			function(l) {
				if(l.type === event.type) {
					listener = l;
				}
			},
			this
		);
		var match = listener.match;
		if(match) {
			// trace('\tthere is a match');
			if(match.value === event.value) {
				// trace('\t\tvalue matches the event value');
				_executeActions(match.actions);
			} else if(listener.nonmatch) {
				// trace('\t\tnonmatch');
				_executeActions(listener.nonmatch.actions);
			}
		} else {
			_executeActions(listener.actions);
		}
	}
	
	function _executeActions(actions) {
		// trace('SocialPanel/_executeActions');
		Polyworks.Utils.each(actions,
			function(action) {
				// trace('\tcalling: ' + action.method + ', passing: ', action.data);
				Polyworks.SocialPanel[action.method](action.data);
			},
			this
		);
	}

	return module;
}());