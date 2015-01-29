var PWG = PWG || {};
PWG.Animator = function() {
	var ANIMATION_DELAY = 1;
	var module = {};
	var _instances = {};
	var _currentId = 0;
	
	function Controller(id, el, props, duration, callback, context, params) {
		// trace('Animation['+id+'] duration = ' + duration);
		this.id = id;
		this.el = el;
		this.props = props;
		PWG.Utils.each(
			props,
			function(prop, idx) {
				prop.begin = parseInt(prop.begin);
				prop.end = parseInt(prop.end);
				prop.difference = (prop.end > prop.begin) ? (prop.end - prop.begin) : -(prop.begin - prop.end);
				// prop.difference /= (duration/10);
				// prop.difference /= (duration);
				// trace(this.id + ': prop['+prop.key+'] begin = ' + prop.begin + ', end = ' + prop.end + ', difference = ' + prop.difference + ', duration = ' + duration);
				prop.newValue = prop.begin;
			},
			this
		);
		this.duration = duration;
		this.callback = callback; 
		this.context = context || window;
		this.params = params || {};
		this.completed = false;
	};
	
	Controller.prototype.start = function() {
		// this.el.style[this.prop] = this.begin;
		this.startTime = Date.now();
		requestAnimationFrame(this.update.bind(this));
	};

	Controller.prototype.update = function() {
		var currentTime = Date.now();
		var animatedTime = currentTime - this.startTime;
		if(animatedTime > this.duration) {
			animatedTime = this.duration;
		}
		var animatedPercentage = animatedTime / this.duration;
		// trace('Animator/update, animatedTime = ' + animatedTime + ', duration = ' + this.duration + ', % = ' + animatedPercentage);

		var styleString = '';
		PWG.Utils.each(
			this.props,
			function(prop, idx) {
				prop.newValue = parseInt(prop.begin) + (animatedPercentage * prop.difference);
				// prop.currentVal += prop.difference;
				// trace(this.id + ':' + prop.key + ' begin/end ' + prop.begin + '/' + prop.end + ', prop.newValue = ' + prop.newValue + ', diff = ' + prop.difference);
				if(prop.key === 'rotate') {
					styleString += '-webkit-transform:rotate(' + prop.newValue + 'deg); ';
					styleString += '-ms-transform:rotate(' + prop.newValue + 'deg); ';
					styleString += 'transform:rotate(' + prop.newValue + 'deg); ';
				} else {
					styleString += prop.key + ':' + prop.newValue + prop.unit + '; ';
					
				}
			},
			this
		);
		if(this.params && this.params.styleString) {
			styleString += this.params.styleString;
		}
		// trace('styleString = ' + styleString);
		this.el.setAttribute('style', styleString);
		// trace(this.id + ': animatedTime = ' + animatedTime + ' duration = ' + this.duration);
		if(animatedTime >= this.duration) {
			this.completed = true;
		}
		
		if(!this.completed) {
			requestAnimationFrame(this.update.bind(this));
		} else {
			this.onCompleted();
		}
	};
	
	Controller.prototype.stop = function() {
		this.completed = true;
	};
	
	Controller.prototype.onCompleted = function() {
		PWG.Utils.each(
			this.props,
			function(prop) {
				// trace(this.id + ': ' + prop.key + ' newvalue = ' + prop.newValue);
			},
			this
		);
		if(this.callback) {
			this.callback.call(this.context, this.id, this.el, this.params);
		}
		PWG.Animator.kill(this.id);
	};
	
	module.Controller = Controller;
	
	module.create = function(el, props, time, autoStart, callback, context, params, id) {
		var key = 'animation_' + (id || _currentId);
		var controller = new Controller(key, el, props, time, callback, context, params);
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
	
	module.kill = function(id) {
		if(!_instances.hasOwnProperty(id)) {
			return;
		}
		if(!_instances[id].completed) {
			_instances[id].stop();
		}
		_instances[id] = null;
		delete _instances[id];
		// trace('Animator.kill, id = ' + id + ', _instances now = ', _instances);
	};
	
	return module;
}();