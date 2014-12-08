var PWG = PWG || {};
PWG.JsLoader = function() {

	var LOAD_TIMEOUT = 5000;
	
	var _head = document.getElementsByTagName('head')[0];
	var module = {};
	
	function Controller(id) {
		this.id = id;
		this.successCallback = null;
		this.timeoutCallback = null;
		this.batchCompleteCallback = null;
		this.numToLoad = 0;
		this.numLoaded = 0;
		this.loadQueue = [];
		this.timer;
	};

	/**
		@param urls: array of js urls
		@param success: function to call as each file loads
		@param batchComplete: function to call upon all files loaded
		@param context: completed callback context
		@param timeout: function to call upon load timeout
		@param max: milliseconds before timeout
		Loads multiple files with with raw js. calls cb once number
		of files loaded equal to number files to load.
	*/
	Controller.prototype.batchLoad = function(urls, success, batchComplete, context, timeout, max) {
		// trace('JsLoader/batchLoad, urls = ', urls);
		this.loadQueue = urls; 
		
		if(success) { this.successCallback = success; }
		if(batchComplete) { this.batchCompleteCallback = batchComplete; }
		if(timeout) { this.timeoutCallback = timeout; }
		this.ctx = context || window;

		if(this.async) {
			PWG.Utils.each(
				urls,
				function(url, idx) {
					this.load(url, idx, this.fileLoaded, module, this.timeoutCallback, max);
				},
				module
			);
		} else {
			this.load(urls[0], 0, this.fileLoaded, module, this.timeoutCallback, max);
		}
	};

	Controller.prototype.load = function(url, key, success, context, timeout, max) {
		// trace('JsLoader/load, key = ' + key + ', url = ' + url + ', context = ' + context);
		this.maxLoadTime = max || LOAD_TIMEOUT; 

		var ctx = context || window;
		var script = document.createElement('script');

		script.setAttribute('type', 'text/javascript');
		if (script.readyState) { 
			script.onreadystatechange = function() {
				if(script.readyState == 'loaded' || script.readyState == 'complete') {
					if(success instanceof Function) {
						success.call(ctx, url, true, key);
					}
				}
			};
		} else {
			script.onload = function() {
				if(success instanceof Function) {
					success.call(ctx, url, true, key);
				}
			};
		}
		script.setAttribute('src', url);
		if(key) {
			script.setAttribute('id', key);
		}
		_head.appendChild(script);

		if(timeout) {
			var _this = this;
			this.timer = setTimeout(function() {
				_this.timeoutCallback(url, false, key);
			}, this.maxLoadTime);
		}
		
		return script;
	};

	Controller.prototype.fileLoaded = function(url, result, key) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		// trace('JsLoader/fileLoaded, key = ' + key + ', result = ' + result + ', numLoaded = ' + this.numLoaded + ', total urls = ' + this.loadQueue.length + ', url = ' + url);
		this.checkLoadedCount();
		if(this.successCallback) { 
			this.successCallback.call(this.ctx, url, result, key); 
		}
	};

	Controller.prototype.timeoutCallback = function(url, result, key) {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		_checkLoadedCount();
		if(this.timeoutCallback) {
			this.timeoutCallback.call(this.ctx, url, result, key);
		}
	};

	Controller.prototype.checkLoadedCount = function() {
		this.numLoaded++;

		// trace('JsLoader/_checkLoadedCount, numLoaded = ' + this.numLoaded + ', total = ' + this.loadQueue.length);
		if(this.numLoaded >= this.loadQueue.length) {
			if(this.batchCompleteCallback) { 
				this.batchCompleteCallback.call(this.ctx); 
			}

			this.batchCompleteCallback = null;
			this.successCallback = null;
			this.timeout = null;
			this.ctx = null;
		} else {
			if(!this.async) {
				this.load(this.loadQueue[this.numLoaded], this.numLoaded, this.fileLoaded, module, this.timeoutCallback, this.maxLoadTime);
			}
		}

	}
	
	Controller.prototype.destroy = function() {
		if(this.timer) {
			clearTimeout(this.timer);
		}
		this.successCallback = null;
		this.timeoutCallback = null;
		this.batchCompleteCallback = null;
		this.numToLoad = 0;
		this.numLoaded = 0;
		this.loadQueue = [];
	};
	
	module.Controller = Controller; 
	
	module.controllers = {};
	
	module.create = function(id) {
		var controller = new Controller(id);
		module.controllers[id] = controller; 
		return controller;
	};
	
	module.load = function(id, url, key, success, context, timeout, max) {
		if(module.controllers.hasOwnProperty(id)) {
			module.controllers[id].load(url, key, success, context, timeout, max);
		}
	};
	
	module.remove = function(id) {
		if(module.controllers.hasOwnProperty(id)) {
			module.controllers[id].destroy();
			delete module.controllers[id];
		}
	};
	
	return module;
}();