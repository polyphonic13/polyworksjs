PWG.Stage = function() {
	var _aspectRatio = [16, 9];
	var _maxHeight = 800;
	var _offsetX = 0;
	var _offsetY = 0;
	
	var _windowListeners = false;
	var _center;
	var _callback;
	var _context; 
	
	var module = {
		initialized: false,
		winW: 0,
		winH: 0,
		gameW: 0,
		gameH: 0,
		gameX: 0,
		gameY: 0,
		unit: 0,

		init: function(aspectRatio, maxHeight, offsetX, offsetY, resizable, callback, context) {
		
			if(typeof(aspectRatio) !== 'undefined') {
				_aspectRatio = aspectRatio;
			}
			if(typeof(maxHeight) !== 'undefined') {
				_maxHeight = _maxHeight;
			}
			
			if(typeof(offsetX) !== 'undefined') {
				_offsetX = offsetX;
			}
			
			if(typeof(offsetY) !== 'undefined') {
				_offsetY = offsetY;
			}
			
			_callback = callback;
			_context = context || window;

			_calculateSizes();

			if(resizable) {
				window.addEventListener('resize', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
				window.addEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
					// _calculateSizes();
				});
			}

			if(_callback) {
				_callback.call(_context);
			}
			
			this.initialized = true;
		},

		sizeGame: function(width) {
			PWG.Game.phaser.scale.maxWidth = width;
			PWG.Game.phaser.scale.maxHeight = (width/_aspectRatio[0]) * _aspectRatio[1];
			// trace('Stage/sizeGame, max w/h = ' + PWG.Game.phaser.scale.maxWidth + '/' + PWG.Game.phaser.scale.maxHeight);
			PWG.Game.phaser.scale.setSize();
		},
		
		zoomByWidth: function(baseWidth, el) {
			var zoom = baseWidth/el.offsetWidth;
			
			el.style.zoom = zoom;
		},
		
		zoomByHeight: function(baseHeight, el) {
			var zoom = baseHeight/el.offsetHeight;
			
			el.style.zoom = zoom;
		},
		
		destroy: function() {
			if(_windowListeners) {
				window.removeEventListener('resize', function(event) {
					_onSizeChange(event);
				});
				window.removeEventListener('orientationchagne', function(event) {
					_onSizeChange(event);
				});
			}
		}
	};
	
	function _calculateSizes() {
		module.winW = document.documentElement.clientWidth;
		module.winH = document.documentElement.clientHeight;

		module.gameH = (module.winH > _maxHeight) ? _maxHeight : module.winH;
		module.gameW = ((module.winH/_aspectRatio[1]) * _aspectRatio[0]);
		
		if(module.gameW > module.winW) {
			module.gameW = module.winW;
			module.gameH = (module.gameW/_aspectRatio[0]) * _aspectRatio[1];
		}

		module.gameW -= _offsetX;
		module.gameH -= _offsetY;

		module.unit = module.gameH/_aspectRatio[1];
		module.gameX = (module.winW/2) - (module.gameW/2);
		module.gameY = (module.winH/2) - (module.gameH/2);

		module.gameX += _offsetX;
		module.gameY += _offsetY;
		
		// trace('\nwinW = ' + module.winW + ', winH = ' + module.winH + '\ngameW = ' + module.gameW + ', gameH = ' + module.gameH + '\nunit = ' + module.unit + '\ngameX = ' + module.gameX + ', gameY = ' + module.gameY);

		var loadingWidth = module.winW - 80;
		var loadingHeight = module.winH - 80;

		var loadingDiv = document.getElementById('loading');
		var containerDiv = document.getElementById('game_container');

		if(loadingDiv) _sizeAndPositionDiv(loadingDiv, loadingWidth, loadingHeight, 0, 0);
		if(containerDiv) _sizeAndPositionDiv(containerDiv, module.gameW, module.gameH, module.gameX, module.gameY);

	}


	function _sizeAndPositionDiv(div, width, height, left, top) {
		// trace('Stage/_sizeAndPositionDiv, div = ', div, '\twidth = ' + width + ', height = ' + height + '\n\tleft = ' + left + ', top = ' + top);
		div.style.width = width + 'px';
		div.style.height = height + 'px';
		div.style.left = left + 'px';
		div.style.top = top + 'px';
		div.style.display = 'block';
	}

	function _onSizeChange(event) {
		var containerDiv = document.getElementById('game_container');
		var left = (module.winW/2) - (module.gameW/2);
		var top = (module.winH/2) - (module.gameH/2);
		containerDiv.style.left = left + 'px';
		containerDiv.style.top = top + 'px';
	}

	return module;
}();
