var PWG = PWG || {};
PWG.TouchManager = function() {
	var module = {};

	function TouchController(el, listeners) {
		this.el = el;
		this.currentTouches = [];

		this.listeners = {};
		PWG.Utils.each(
			listeners,
			function(listener, key) {
				this.listeners[key] = {};
				this.listeners[key].fn = listener.fn;
				this.listeners[key].ctx = listener.ctx || this;
				this.listeners[key].params = listener.params || {};
			},
			this
		);
		// trace('TouchController listeners = ', this.listeners);
		this.addListeners();
	}

	TouchController.prototype.addListeners = function() {
		this.startListener = function(listener) {
			return function(event) {
				listener.onTouchStart.call(listener, event);
			};
		}(this);

		this.moveListener = function(listener) {
			return function(event) {
				listener.onTouchMove.call(listener, event);
			};
		}(this);
		
		this.endListener = function(listener) {
			return function(event) {
				listener.onTouchEnd.call(listener, event);
			};
		}(this);
		
		this.cancelListener = function(listener) {
			return function(event) {
				listener.onTouchCancel.call(listener, event);
			};
		}(this);
		
		this.el.addEventListener("touchstart", this.startListener, false);
		this.el.addEventListener("touchmove", this.moveListener, false);
		this.el.addEventListener("touchend", this.endListener, false);
		this.el.addEventListener("touchleave", this.endListener, false);
		this.el.addEventListener("touchcancel", this.cancelListener, false);
	};

	TouchController.prototype.removeListeners = function() {
		this.el.removeEventListener("touchstart", this.startListener, false);
		this.el.removeEventListener("touchmove", this.moveListener, false);
		this.el.removeEventListener("touchend", this.endListener, false);
		this.el.removeEventListener("touchleave", this.endListener, false);
		this.el.removeEventListener("touchcancel", this.cancelListener, false);
	};
	
	TouchController.prototype.onTouchStart = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i;
		for(i = 0; i < l; i++) {
			this.currentTouches.push(_copyTouch(touches[i]));
			// trace('this.currentTouches = ', this.currentTouches);
			if(this.listeners.hasOwnProperty('start')) {
				var start = this.listeners['start'];
				start.fn.call(start.ctx, touch, this.el, this, start.params);
			}
		}
	};
	
	TouchController.prototype.onTouchMove = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 

		// trace('TouchController/onTouchMove, touches.length = ' + touches.length + ', move = ', (this.listeners['move']));
		// trace('touches = ', touches);
		for(i = 0; i < l; i++) {
			// trace('touches['+i+'].identifier = ' + (touches[i].identifier));
			var idx = _getTouchById(touches[i].identifier, this);
			// trace('\tidx = ' + idx);
			if(idx > -1) {
				// trace('has move = ' + (this.listeners.hasOwnProperty('move')));
				if(this.listeners.hasOwnProperty('move')) {
					var move = this.listeners['move'];
					// trace('\tthere is a move');
					move.fn.call(move.ctx, touches[i], this.el, this, move.params);
				}
				this.currentTouches.splice(idx, 1, _copyTouch(touches[i]));
			}
		}
	};

	TouchController.prototype.onTouchEnd = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 

		for(i = 0; i < l; i++) {
			var idx = _getTouchById(touches[i].identifier, this);
			if(idx > -1) {
				if(this.listeners.hasOwnProperty('end')) {
					var end = this.listeners['end'];
					// trace('there is an end: ', end);
					end.fn.call(end.ctx, touches[i], this.el, this, end.params);
				}
				this.currentTouches.splice(idx, 1);
			}
		}
	};
	
	TouchController.prototype.onTouchCancel = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i; 
		for(i = 0; i < l; i++) {
			var idx = _getTouchById(touches[i].identifier, this);
			if(idx > -1) {
				if(this.listeners.hasOwnProperty('cancel')) {
					var cancel = this.listeners['cancel'];
					cancel.fn.call(cancel.ctx, touches[i], this.el, this, cancel.params);
				}
				this.currentTouches.splice(i, 1);
			}
		}
	};
	
	TouchController.prototype.removeCurrentTouches = function() {
		PWG.Utils.each(
			this.currentTouches,
			function(touch, t) {
				this.currentTouches.pop();
			},
			this
		);
	};
	
	TouchController.prototype.destroy = function() {
		this.removeListeners();
		this.removeCurrentTouches();
	};
	
	module.TouchController = TouchController;
	module.touchControllers = {};
	
	module.add = function(el, listeners, id) {
		var key = id || el.id;
		var touchController = new TouchController(el, listeners);
		module.touchControllers[key] = touchController;
		return touchController;
	};
	
	module.remove = function(id) {
		if(module.touchControllers.hasOwnProperty(id)) {
			module.touchControllers[id].destroy();
			delete module.touchControllers[id];
		}
	};
	
	function _copyTouch(touch) {
		return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
	}
	
	function _getTouchById(identifier, touchEl) {
		var l = touchEl.currentTouches.length;
		var i;
		var idx = -1;
		for(i = 0; i < l; i++) {
			// trace('\tcurrentTouches['+i+'].id = ' + touchEl.currentTouches[i].id + ', id = ' + id);
			if(touchEl.currentTouches[i].identifier === identifier) {
				idx = i;
				break;
			}
		}
		return idx;
	}
	
	return module;
}();
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events