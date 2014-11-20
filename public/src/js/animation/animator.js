var PWG = PWG || {};
PWG.Animator = function() {
	var ANIMATION_DELAY = 1;
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	function Controller(id, el, props, time, callback, context, params) {
		this.id = id;
		this.el = el;
		this.props = props;
		PWG.Utils.each(
			props,
			function(prop, idx) {
				prop.increment = (prop.end > prop.begin) ? (prop.end - prop.begin) : -(prop.begin - prop.end);
				prop.increment /= (time/10);
				// trace('prop['+prop.key+'].increment = ' + prop.increment);
				prop.currentVal = prop.begin;
			},
			this
		);
		this.time = time;
		this.callback = callback; 
		this.context = context || window;
		this.params = params || {};
	};
	
	Controller.prototype.start = function() {
		this.el.style[this.prop] = this.begin;
		this.timer = PWG.Timer.create(this.id);
		var counter = 0;
		var endCount = this.time / 10;
		var _this = this;
		this.timer.loop(
			ANIMATION_DELAY,
			function(t, params) {
				var styleString = '';
				PWG.Utils.each(
					_this.props,
					function(prop, idx) {
						prop.currentVal += prop.increment;
						// trace('prop['+idx+'].currentVal = ' + prop.currentVal + ', end = ' + prop.end);
						if(prop.key === 'rotate') {
							styleString += '-webkit-transform:rotate(' + prop.currentVal + 'deg); ';
							styleString += '-ms-transform:rotate(' + prop.currentVal + 'deg); ';
							styleString += 'transform:rotate(' + prop.currentVal + 'deg); ';
						} else {
							styleString += prop.key + ':' + prop.currentVal + prop.unit + '; ';
						}
					},
					this
				);
				if(params.styleString) {
					styleString += params.styleString;
				}
				_this.el.setAttribute('style', styleString);
				// trace('counter = ' + counter + ' endCount = ' + endCount);
				counter++;
				if(counter >= endCount) {
					PWG.Timer.remove(t.id);
					_this.complete();
				}
			},
			this.params,
			this
		);
	};
	
	Controller.prototype.stop = function() {
		if(this.timer) {
			this.timer.stop();
		}
	};
	
	Controller.prototype.complete = function() {
		if(this.callback) {
			this.callback.call(this.context, this.id, this.el, this.params);
		}
	};
	
	module.Controller = Controller;
	
	module.create = function(el, props, time, autoStart, callback, context, params, id) {
		var key = 'animation_' + (id || _currentId);
		var controller = new Controller(id, el, props, time, callback, context, params);
		if(autoStart) {
			controller.start();
		}
		_instances[key] = controller; 
		_currentId++;
		return controller;
	};

	module.get = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		return _instances[id];
	};
	
	module.stopAll = function() {
		PWG.Utils.each(
			_instances,
			function(controller) {
				controller.stop();
			},
			module
		);
	};
	
	return module;
}();