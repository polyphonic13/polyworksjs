var PWG = PWG || {};
PWG.TGSAdapter = (function() {
	var module = {};
	
	var LEVEL_PLAYS_PER_AD = 1;
	var TRE_SENSA_WIDGET_WIDTH = 300;
	var PWG_WIDGET_UNITS = 5;
	var LEADERBOARD_ID = 1;
	
	var _levels = [];

	var _tgsExists = false;
	var _needAd = false;
	
	var _tgsConfig = {
		GAME_ID: 'kekeandthegreyexpanse',
		ADS: {
			INTERSTITIAL_INTERVAL: 300
		}
	};
	
	var _divIds = {
		parentDiv: 'adContainer',
		blurDiv: 'gameContainer',
		endScreenDiv: 'endScreenContainer'
	};
	
	var _displayConfig = {
		parentDiv: null,
		blurDiv: null,
		endScreenDiv: null,
		closeCallback = function() {
			_finishAdSession();
		}
	};
	
	var _config = {};
	
	module.isOpen: false;
	
	module.events = {
		ad: {
			AD_STARTED: 'adStarted',
			AD_COMPLETED: 'adCompleted'
		},
		game: {
			LOAD: 'load',
			BEGIN: 'begin',
			PAUSE: 'pause',
			RESUME: 'resume',
			END: 'end'
		},
		log: {
			GAME_EVENT: 'logGameEvent',
			LEVEL_EVENT: 'logLevelEvent',
			CUSTOM_EVENT: 'logCustomEvent',
			SHARE_EVENT: 'logShareEvent',
			SCREEN: 'logScreen',
			ACHIEVEMENT_EVENT: 'logAchievementEvent'
		},
		level: {
			START: 'start',
			COMPLETE: 'complete',
			FAIL: 'fail',
			REPLAY: 'replay'
		},
		achievement: {
			NEW_HIGH_SCORE: 'newHighScore',
			GAME_COMPLETED: 'gameCompleted'
		}
	};

	module.init = function(config) {
		_config = config;

		if(config.events) {
			_initEvents();
		}
		
		_displayConfig.endScreenDiv = document.getElementById('endScreenContainer');
		
		if(config.levelCount) {
			for(var i = 0; i < config.levelCount; i++) {
				_levels[i] = LEVEL_PLAYS_PER_AD;
			}
		}

		if(typeof(TGS) !== 'undefined') {
			_tgsExists = true;
		}
		// trace('TGSAdapter/init, _levels = ', _levels);
	};
	
	// http://developer.tresensa.com/docs/tgs/symbols/TGS.Analytics.html#.logGameEvent
	module.logEvent = function(type, args) {
		if(_tgsExists) {
			// trace('TGSAdapter/logEvent, type = ' + type + ', args = ', args);
			TGS.Analytics[type].apply(module, args);
		}
	};
	
	module.submitScore = function(params) {
		// trace('TGSAdaper/submitScore, _tgsExists = ' + _tgsExists);
		if(_tgsExists) {
			params.leaderboardID = LEADERBOARD_ID;
			// trace('submitting score: ', params);
			TGS.Leaderboard.SubmitScore(params);
		}
	};
	
	module.adCheck = function(idx) {
		// trace('TGSAdapter/adCheck, _levels[' + idx + '] = ' + _levels[idx] + ', LEVELS_PLAYS_PER_AD = ' + LEVEL_PLAYS_PER_AD);
		if(_needAd) {
			module.displayInterstitial();
			_needAd = false;
		} else {
			_needAd = true;
			_finishAdSession();
		}
	};
	
	module.displayInterstitial = function() {
		
		// trace('TGSAdapter/displayInterstitial');
		PolyworksGame.adPlaying = true;
		_trigger(module.events.ad.AD_STARTED);

		TGS.Advertisement.DisplayInterstitialAd(_displayConfig);		
	};
	
	module.addWidget = function() {
		// trace('TGSAdapter/addWidget');
		var winW = PWG.Stage.winW; 
		var winH = PWG.Stage.winH;
		
		var unit = PWG.Stage.unit; 
		var widgetX = (unit * 3);
		var widgetY = (unit * 0.5);
		var widgetScale = (unit * PWG_WIDGET_UNITS) / TRE_SENSA_WIDGET_WIDTH;
		// trace('\twidget x/y = ' + widgetX + '/' + widgetY + ', scale = ' + widgetScale + ', widget w should be = ' + (unit * PWG_WIDGET_UNITS));

		if(_tgsExists) {
			module.widget = PolyworksGame.Tresensa.createWidget({
				x: widgetX,
				y: widgetY,
				scale: widgetScale,
				shareUrl: 'https://keke.tresensa.com/',
				shareImage: 'http://www.polyworksgames.com/games/keke2/assets/images/keke_grey_expanse_title.png',
				shareTitle: 'keke and the grey expanse',
				shareMessage: 'i love playing keke and the grey expanse!',
				leaderboardID: LEADERBOARD_ID
			});
			module.isOpen = true;
		}
	};

	module.removeWidget = function() {
		// trace('TGSAdapter/removeWidget, module.widget = ', module.widget);
		if(module.widget) {
			module.widget.close();
		}
		module.isClosed = true;
	};
	
	module.hideGameOverWidget = function() {
		// trace('TGSAdapter/hideGameOverWidget');
		if(module.widget) {
			module.widget.close();
		}
		_displayConfig.endScreenDiv.style.display = 'none';
	};

	function _initEvents() {
		PWG.Utils.each(
			config.events,
			function(events, key) {
				module.events[key] = PWG.Utils.extend(module.events[key], events);
			},
			module
		);
	}
	
	function _initDisplayDivs() {
		PWG.Utils.each(
			_divIds,
			function(id, key) {
				var i = (_config.divIds[key] ? _config.divIds[key] : id);
				_displayConfig[key] = document.getElementById(i);
			},
			module
		);
	}
	
	function _finishAdSession() {
		// trace('TGSAdapter/_finishAdSession');
		PolyworksGame.adPlaying = false;
		_trigger(module.events.ad.AD_COMPLETED);
	}
	
	function _trigger(event) {
		if(_config.callback) {
			var context = _config.callback.fn.ctx || module;
			_config.callback.fn.call(context, event);
		} else {
			if(PWG.EventCenter) {
				PWG.EventCenter.trigger({ type: event });
			}
		}
	}
	return module;
}());