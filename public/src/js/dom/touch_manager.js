var PWG = PWG || {};
PWG.TouchManager = function() {
	var module = {};

	function TouchController(el, listeners) {
		this.el = el;
		this.listeners = listeners;
		this.currentTouches = [];
		
		this.addListeners();
	}

	TouchController.prototype.addListeners = function() {
		this.el.addEventListener("touchstart", this.onTouchStart, false);
		this.el.addEventListener("touchmove", this.onTouchMove, false);
		this.el.addEventListener("touchend", this.onTouchEnd, false);
		this.el.addEventListener("touchleave", this.onTouchEnd, false);
		this.el.addEventListener("touchcancel", this.onTouchCancel, false);
	};

	TouchController.prototype.removeListeners = function() {
		this.el.removeEventListener("touchstart", this.onTouchStart, false);
		this.el.removeEventListener("touchmove", this.onTouchMove, false);
		this.el.removeEventListener("touchend", this.onTouchEnd, false);
		this.el.removeEventListener("touchleave", this.onTouchEnd, false);
		this.el.removeEventListener("touchcancel", this.onTouchCancel, false);
	};
	
	TouchController.prototype.onTouchStart = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;

		PWG.Utils.each(
			touches,
			function(touch, t) {
				this.currentTouches.push(_copyTouch(touch));
				if(this.listeners.hasOwnProperty('start')) {
					this.listeners['start'].call(this, touch);
				}
			},
			this
		);
	};
	
	TouchController.prototype.onTouchMove = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;

		PWG.Utils.each(
			touches,
			function(touch, t) {
				var idx = _getTouchById(touch.id, this);
				if(idx > -1) {
					if(this.listeners.hasOwnProperty('move')) {
						this.listeners['move'].call(this, touch);
					}
					this.currentTouches.splice(idx, 1, _copyTouch(touch));
				}
			},
			this
		);
	};

	TouchController.prototype.onTouchEnd = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;

		PWG.Utils.each(
			touches,
			function(touch, t) {
				var idx = _getTouchById(touch.id, this);
				if(idx > -1) {
					if(this.listeners.hasOwnProperty('move')) {
						this.listeners['move'].call(this, touch);
					}
					this.currentTouches.splice(idx, 1);
				}
			},
			this
		);
	};
	
	TouchController.prototype.onTouchCancel = function(evt) {
		evt.preventDefault();

		var touches = evt.changedTouches;

		PWG.Utils.each(
			touches,
			function(touch, t) {
				var idx = _getTouchById(touch.id, this);
				if(idx > -1) {
					if(this.listeners.hasOwnProperty('end')) {
						this.listeners['end'].call(this);
					}
					this.currentTouches.splice(t, 1);
				}
			},
			this
		);
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
		return touchContoller;
	};
	
	module.remove = function(id) {
		if(module.touchControllers.hasOwnProperty(id)) {
			module.touchControllers[id].destroy();
			delete module.touchControllers[id];
		}
	};
	
	function _copyTouch(touch) {
		return { id: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
	}
	
	function _getTouchById(id, touchEl) {
		var l = touchEl.currentTouches.length;
		var i;
		var idx = -1;
		for(i = 0; i < l; i++) {
			if(touchEl.currentTouches[i].id === id) {
				idx = i;
				break;
			}
		}
		return idx;
	}
	
	return module;
}();
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events