Polyworks.SocialPanel = (function() {

	var _model = {};

	var module = {
		init: function(params) {
			// // trace('SocialPanel/init, params = ', params);
			_model = Polyworks.Utils.extend(_model, params);
			_initViews();
			_addListeners();
		},

		show: function(params) {
			// trace('SocialPanel/show, params = ', params);
			var elements = params.value;
			_model.parentEl.style.display = 'block';
			Polyworks.Utils.each(elements,
				function(element) {
					if(_model.buttons.hasOwnProperty(element)) {
						_model.buttons[element].style.visibility = 'visible';
					}
				},
				this
			);
		},

		showAll: function() {
			_model.parentEl.style.display = 'block';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'visible';
			}
		},

		hideAll: function() {
			_model.parentEl.style.display = 'none';
			for(var key in _model.buttons) {
				_model.buttons[key].style.visibility = 'hidden';
			}
		},

		buttonClick: function(network) {
			// trace('SocialPanel/buttonClick, network = ' + network + '\n\tcurrentActionType = ' + _model.currentActionType);
			var networkActions = _model.socialActions[network];
			if(networkActions) {
				// trace('\tnetworkActions = ', networkActions);
				var socialAction = networkActions[_model.currentActionType];
				if(socialAction) {
					// trace('\tsocialAction = ', socialAction);
					var url;
					if(socialAction['params']) {
						url = socialAction['url'] + Polyworks.Utils.parseMarkup(socialAction['params'], _model, true);
					} else {
						url = socialAction['url'];
					}
					// trace('\turl = ' + url);
					if(url.indexOf('mailto') > -1) {
						if(Polyworks.DeviceUtils.isIphone() || Polyworks.DeviceUtils.isAndroid()) {
							window.location.href = url;
						} else {
							window.open(url, '_blank');
						}
					} else {
						window.open(url, '_blank');
					}
				}
			}
		},

		changeData: function(params) {
			_model[params.type] = params.value;
		},

		destroy: function() {
			_removeListeners();
			_destroyViews();
		}
	};

	function _initViews() {
		_initParentEl(); 
		_addButtons();
	}

	function _initParentEl() {
		_model.parentEl = document.getElementById(_model.parentId) || document.getElementsByTagName('body')[0];
		_model.grandParentEl = _model.parentEl.parentNode;
	}

	function _addButtons() {
		_model.buttons = {};

		var buttonStyle = _model.buttonStyle;

		var buttonClass = _model.buttonClass || 'socialButton';
		var button;
		var style; 
		var length = _model.networks.length; 

		Polyworks.Utils.each(_model.networks,
			function(network, idx) {
				style = _calculateButtonStyle(buttonStyle, idx, length);
				button = {
					pops: _model.parentEl,
					id: network,
					el: 'img',
					attrs: {
						src: _model.imagePath + network + '.png',
						onclick: 'Polyworks.SocialPanel.buttonClick("'+network+'");'
					},
					className: buttonClass,
					style: style
				};
				_model.buttons[network] = Polyworks.Utils.addElement(button);
			},
			this
		);
	}

	function _calculateButtonStyle(attrs, idx, length) {
		var winW = Polyworks.Stage.winW;
		var winH = Polyworks.Stage.winH;
		var horizontal = attrs.position.horizontal;
		var vertical = attrs.position.vertical;
		var spacer = attrs.spacer; 
		var offset = attrs.offset || 0;
		
		var style = {
			width: attrs.size.width + 'px',
			height: attrs.size.height + 'px'
		};

		if(horizontal === 'center') {
			var horizontalTotal;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					horizontalTotal += attrs.spacer;
				}
				horizontalTotal += attrs.size.width;
			}

			style.left = ((winW/2) - (horizontalTotal/2) + (idx * attrs.size.width)) + 'px';
		} else if(horizontal < 0) {
			style.right = -(horizontal) + 'px';
		} else {
			style.left = horizontal + 'px';
		}

		if(vertical === 'center') {
			var verticalTotal = 0;
			for(var i = 0; i < length; i++) {
				if(i > 0) {
					verticalTotal += attrs.spacer;
				}
				verticalTotal += attrs.size.height;
			}
			// trace('\tVERTICAL TOTal = ' + verticalTotal);
			var btnOffset = (idx * attrs.size.height) +  (idx * attrs.spacer) + offset;
			style.top = ((winH/2) - (verticalTotal/2) + (btnOffset)) + 'px';
		} else if(vertical < 0) {
			style.bottom = -(vertical) + 'px';
		} else {
			style.top = vertical + 'px';
		}
		// trace('RETURNING: ', style);
		return style;
	}
	
	function _destroyViews() {
		var buttons = _model.buttons;
		var button;
		for(var key in buttons) {
			button = buttons[key];
			button.parentNode.removeChild(button);
		}
		if(_model.parentEl) {
			_model.parentEl.parentNode.removeChild(_model.parentEl);
		}
	}

	function _addListeners() {
		Polyworks.Utils.each(_model.listeners,
			function(listener) {
				Polyworks.EventCenter.bind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _removeListeners() {
		Polyworks.Utils.each(_model.listeners,
			function(listener) {
				Polyworks.EventCenter.unbind(listener.type, _eventHandler, this);
			},
			this
		);
	}

	function _eventHandler(event) {
		// trace('SocialPanel/_eventHandler event = ', event);
		var listener;
		Polyworks.Utils.each(_model.listeners,
			function(l) {
				if(l.type === event.type) {
					listener = l;
				}
			},
			this
		);
		var match = listener.match;
		if(match) {
			// trace('\tthere is a match');
			if(match.value === event.value) {
				// trace('\t\tvalue matches the event value');
				_executeActions(match.actions);
			} else if(listener.nonmatch) {
				// trace('\t\tnonmatch');
				_executeActions(listener.nonmatch.actions);
			}
		} else {
			_executeActions(listener.actions);
		}
	}
	
	function _executeActions(actions) {
		// trace('SocialPanel/_executeActions');
		Polyworks.Utils.each(actions,
			function(action) {
				// trace('\tcalling: ' + action.method + ', passing: ', action.data);
				Polyworks.SocialPanel[action.method](action.data);
			},
			this
		);
	}

	return module;
}());