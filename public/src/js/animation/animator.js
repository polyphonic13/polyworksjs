var PWG = PWG || {};
PWG.Animator = function() {
	var ANIMATION_DELAY = 1;
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	// function Controller(id, el, prop, unit, begin, end, time, callback, context, params) {
	function Controller(id, el, props, time, callback, context, params) {
		this.id = id;
		this.el = el;
		// this.prop = prop;
		// this.unit = unit;
		// this.begin = begin;
		// this.end = end;
		this.props = props;
		PWG.Utils.each(
			props,
			function(prop, idx) {
				prop.increment = (prop.end - prop.begin) / (time/10);
				prop.currentVal = prop.begin;
			},
			this
		);
		this.time = time;
		this.callback = callback; 
		this.context = context || window;
		this.params = params || {};
		// this.increment = (end - begin) / (time/10); // divide by 10 to accomodate for slowness of 1ms setTimeout
		// this.currentVal = begin;
	};
	
	Controller.prototype.start = function() {
		this.el.style[this.prop] = this.begin;
		this.timer = PWG.Timer.create(this.id);
		var counter = 0;
		var endCount = this.time / 10;
		var _this = this;
		this.timer.loop(
			// this.time,
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
						// _this.el.style[prop.key] = prop.currentVal + prop.unit;
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
				// if(counter = 10) {
					PWG.Timer.remove(t.id);
					_this.complete();
				}
				// _this.currentVal += _this.increment;
				// _this.el.style[_this.prop] = _this.currentVal + _this.unit;
				// if(_this.currentVal >= _this.end) {
				// 	t.stop();
				// 	PWG.Timer.remove(t.id);
				// 	_this.complete();
				// }
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
			this.callback.call(this.context, this.id, this.el);
		}
	};
	
	module.Controller = Controller;
	
	// module.create = function(el, prop, unit, start, end, time, autoStart, callback, context, params, id) {
	module.create = function(el, props, time, autoStart, callback, context, params, id) {
		var key = 'animation_' + (id || _currentId);
		// var controller = new Controller(id, el, prop, unit, start, end, time, callback, context, params);
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
	
	return module;
}();