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
		if(PWG.DeviceUtils.isMobile()) {
			this.touchStartListener = function(listener) {
				return function(event) {
					listener.onTouchStart.call(listener, event);
				};
			}(this);

			this.touchMoveListener = function(listener) {
				return function(event) {
					listener.onTouchMove.call(listener, event);
				};
			}(this);

			this.touchEndListener = function(listener) {
				return function(event) {
					listener.onTouchEnd.call(listener, event);
				};
			}(this);

			this.touchCancelListener = function(listener) {
				return function(event) {
					listener.onTouchCancel.call(listener, event);
				};
			}(this);

			this.el.addEventListener("touchstart", this.touchStartListener, false);
			this.el.addEventListener("touchmove", this.touchMoveListener, false);
			this.el.addEventListener("touchend", this.touchEndListener, false);
			this.el.addEventListener("touchleave", this.touchEndListener, false);
			this.el.addEventListener("touchcancel", this.touchCancelListener, false);

		} else {
			this.mouseDownListener = function(listener) {
				return function(event) {
					listener.onMouseDown.call(listener, event);
				};
			}(this);

			this.mouseMoveListener = function(listener) {
				return function(event) {
					listener.onMouseMove.call(listener, event);
				};
			}(this);

			this.mouseUpListener = function(listener) {
				return function(event) {
					listener.onMouseUp.call(listener, event);
				};
			}(this);

			this.el.addEventListener("mousedown", this.mouseDownListener, false);
			this.el.addEventListener("mousemove", this.mouseMoveListener, false);
			this.el.addEventListener("mouseup", this.mouseUpListener, false);
		}
	};

	TouchController.prototype.removeListeners = function() {
		if(PWG.DeviceUtils.isMobile()) {
			this.el.removeEventListener("touchstart", this.touchStartListener, false);
			this.el.removeEventListener("touchmove", this.touchMoveListener, false);
			this.el.removeEventListener("touchend", this.touchEndListener, false);
			this.el.removeEventListener("touchleave", this.touchEndListener, false);
			this.el.removeEventListener("touchcancel", this.touchCancelListener, false);
		} else {
			this.el.removeEventListener("mousedown", this.mouseDownListener, false);
			this.el.removeEventListener("mousemove", this.mouseMoveListener, false);
			this.el.removeEventListener("mouseup", this.mouseUpListener, false);
		}
	};
	
	TouchController.prototype.onTouchStart = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;
		var l = touches.length;
		var i;
		for(i = 0; i < l; i++) {
			this.currentTouches.push(_copyTouch(touches[i]));
			// trace('this.currentTouches = ', this.currentTouches);
			this.onStart(touches[i]);
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
				this.onMove(touches[i]);
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
				this.onEnd(touches[i]);
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
				this.onCancel(touches[i]);
				this.currentTouches.splice(i, 1);
			}
		}
	};
	
	TouchController.prototype.onMouseDown = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseDown, evt = ', evt);
		this.mouseDown = true;
		this.onStart(evt);
	};
	
	TouchController.prototype.onMouseMove = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseMove, evt = ', evt);
		if(this.mouseDown) {
			this.onMove(evt);
		}
	};
	
	TouchController.prototype.onMouseUp = function(evt) {
		evt.preventDefault();
		// trace('TouchController/onMouseUp, evt = ', evt);
		this.mouseDown = false;
		this.onEnd(evt);
	};
	
	TouchController.prototype.onStart = function(evt) {
		if(this.listeners.hasOwnProperty('start')) {
			var start = this.listeners['start'];
			start.fn.call(start.ctx, evt, this.el, this, start.params);
		}
	};
	
	TouchController.prototype.onMove = function(evt) {
		if(this.listeners.hasOwnProperty('move')) {
			var move = this.listeners['move'];
			// trace('\tthere is a move');
			move.fn.call(move.ctx, evt, this.el, this, move.params);
		}
	};
	
	TouchController.prototype.onEnd = function(evt) {
		if(this.listeners.hasOwnProperty('end')) {
			var end = this.listeners['end'];
			// trace('there is an end: ', end);
			end.fn.call(end.ctx, evt, this.el, this, end.params);
		}
	};
	
	TouchController.prototype.onCancel = function(evt) {
		if(this.listeners.hasOwnProperty('cancel')) {
			var cancel = this.listeners['cancel'];
			cancel.fn.call(cancel.ctx, evt, this.el, this, cancel.params);
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