Polyworks.Stage = (function() {
	var _aspectRatio = [16, 9];
	var _windowListeners = false;
	var _callback;
	var _context; 
	
	var module = {
		winW: 0,
		winH: 0,
		stageW: 0,
		stageH: 0,
		unit: 0,

		init: function(aspectRatio, resizable, callback, context) {
			if(typeof(aspectRatio) !== 'undefined') {
				_aspectRatio = aspectRatio;
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

		module.height = (document.documentElement.clientHeight > 800) ? 800 : document.documentElement.clientHeight;
		module.width = ((document.documentElement.clientHeight/_aspectRatio[1]) * _aspectRatio[0]);

		if(module.width > document.documentElement.clientWidth) {
			module.width = document.documentElement.clientWidth;
			module.height = (module.width/_aspectRatio[0]) * _aspectRatio[1];
		}

		module.unit = module.height/_aspectRatio[1];
		var left = (document.documentElement.clientWidth/2) - (module.width/2);
		var top = (document.documentElement.clientHeight/2) - (module.height/2);

		trace('\nwinW = ' + module.winW + ', winH = ' + module.winH + '\nmodule.width = ' + module.width + ', module.height = ' + module.height + '\nunit = ' + module.unit + '\nleft = ' + left + ', top = ' + top);

		var loadingWidth = module.winW - 80;
		var loadingHeight = module.winH - 80;

		var loadingDiv = document.getElementById('loading');
		var containerDiv = document.getElementById('gameContainer');

		_sizeAndPositionDiv(loadingDiv, loadingWidth, loadingHeight, 0, 0);
		_sizeAndPositionDiv(containerDiv, module.winW, module.winH, 0, 0);

	}

	function _sizeAndPositionDiv(div, width, height, left, top) {
		if(div) {
			div.style.width = width + 'px';
			div.style.height = height + 'px';
			div.style.left = left + 'px';
			div.style.top = top + 'px';
			div.style.display = 'block';
		}
	}

	function _onSizeChange(event) {
		var containerDiv = document.getElementById('gameContainer');
		var left = (document.documentElement.clientWidth/2) - (module.width/2);
		var top = (document.documentElement.clientHeight/2) - (module.height/2);
		containerDiv.style.left = left + 'px';
		containerDiv.style.top = top + 'px';
	}

	return module;
}());
