var AudioManager = function() {
	var module = {};
	
	var _sounds = {};
	
	function Sound(elId) {
		this.soundEl = document.getElementById(elId);
	}
	
	Sound.prototype.play = function() {
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
	
	module.addSound = function(config) {
		var sound = new Sound(config.el);
		_sounds[config.id] = sound;
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