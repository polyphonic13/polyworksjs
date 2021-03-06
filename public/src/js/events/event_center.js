/*
	_listeners: {
		type: [
		{
			callback: cb,
			context: ctx
		}
		]
	}
*/
PWG.EventCenter = function() {

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
	
	module.batchBind = function(listeners, context) {
		PWG.Utils.each(
			listeners,
			function(listener) {
				PWG.EventCenter.bind(listener.event, listener.handler, context);
			},
			context
		);
	};
	
	module.trigger = function(params) {
		var list = _listeners[params.type];
		// trace('----- EventCenter/trigger, type = ' + params.type + ', list = ', list);
		if(list) {
			PWG.Utils.each(list,
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
			PWG.Utils.each(listeners,
				function(listener, idx) {
					if(listener && listener.callback === callback) {
						listeners.splice(idx, 1);
					}
				},
				this
			);
		}
	};

	module.batchUnbind = function(listeners, context) {
		PWG.Utils.each(
			listeners,
			function(listener) {
				PWG.EventCenter.unbind(listener.event, listener.handler, context);
			},
			context
		);
	};
	
	module.destroy = function() {
		// iterate thru _listeners object
		// for each type, remove all array elements
		// then delete type from _listeners
		PWG.Utils.each(_listeners,
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
}();