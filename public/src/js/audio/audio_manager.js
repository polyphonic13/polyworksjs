var PWG = PWG || {};
PWG.AudioManager = function() {
	var module = {};
	
	var _sounds = {};
	
	function Sound(elId) {
		trace('AudioManager.Sound, elId = ' + elId);
		this.soundEl = document.getElementById(elId);
	}
	
	Sound.prototype.play = function() {
		trace('AudioManager.Sound/play, soundEl = ', this.soundEl);
		if(this.soundEl) {
			this.soundEl.play();
		}
	};
	
	Sound.prototype.pause = function() {
		if(this.soundEl) {
			this.soundEl.pause();
		}
	};
	
	Sound.prototype.load = function(src) {
		if(this.soundEl) {
			this.soundEl.src = src;
			this.soundEl.load();
		}
	};
	
	module.Sound = Sound; 
	
	module.createEl = function(config) {
		var audio = document.createElement('audio');
		audio.setAttribute('id', config.id);
		PWG.Utils.each(
			config.sources,
			function(source) {
				trace('adding source: ', source);
				var s = document.createElement('source');
				PWG.Utils.each(
					source,
					function(attr, key) {
						trace('\tadding attr['+key+']: ', attr);
						s.setAttribute(key, attr);
					},
					module
				);
				audio.appendChild(s);
			},
			module
		);
		if(config.styles) {
			PWG.Utils.each(
				config.styles,
				function(style, key) {
					audio.style[key] = style;
				},
				module
			);
		}
		var p = (config.parentId) ? document.getElementById(config.parentId) : document.getElementsByTagName('body')[0];
		p.appendChild(audio);
		
		config.el = config.id;
		module.addEl(config);
	};
	
	module.addEl = function(config) {
		var sound = new Sound(config.el);
		_sounds[config.id] = sound;
		trace('AudioManager/addEl, config = ', config);
		if(config.cb) {
			var ctx = config.ctx || window;
			config.cb.call(ctx);
		}
	};
	
	module.play = function(id) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].play();
		}
	};
	
	module.pause = function(id) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].pause();
		}
	};
	
	module.load = function(id, src) {
		if(_sounds.hasOwnProperty(id)) {
			_sounds[id].load(src);
		}
	};
	
	return module;
}();