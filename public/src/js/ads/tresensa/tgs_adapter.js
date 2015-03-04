var PWG = PWG || {};
PWG.TGSAdapter = (function() {
	var LEVEL_PLAYS_PER_AD = 1;
	var TRE_SENSA_WIDGET_WIDTH = 300;
	var PWG_WIDGET_UNITS = 5;
	var LEADERBOARD_ID = 1;
	
	var _levels = [];

	var _tgsExists = false;
	var _needAd = false;
	
	var _tgsConfig = {
		GAME_ID: 'kekeandthegreyexpanse'//,
		// ADS: {
		// 	INTERSTITIAL_INTERVAL: 150
		// }
	};
	
	var _displayConfig = {
		parentDiv: document.getElementById('adContainer'),
		blurDiv: document.getElementById('gameContainter'),
		closeCallback = function() {
			_finishAdSession();
		}
	};
	
	var _endScreenContainer;

	var module = {};
	
	module.isOpen: false,
	module.logEvents: {
		GAME_EVENT: 'logGameEvent',
		LEVEL_EVENT: 'logLevelEvent',
		CUSTOM_EVENT: 'logCustomEvent',
		SHARE_EVENT: 'logShareEvent',
		SCREEN: 'logScreen',
		ACHIEVEMENT_EVENT: 'logAchievementEvent'
	};
	module.gameEvents: {
		LOAD: 'load',
		BEGIN: 'begin',
		PAUSE: 'pause',
		RESUME: 'resume',
		END: 'end'
	};
	module.levelEvents: {
		START: 'start',
		COMPLETE: 'complete',
		FAIL: 'fail',
		REPLAY: 'replay'
	};
	module.achievementEvents: {
		NEW_HIGH_SCORE: 'newHighScore',
		GAME_COMPLETED: 'gameCompleted'
	};
	
	module.init = function(levelCount) {
		_endScreenContainer = document.getElementById('endScreenContainer');
		
		for(var i = 0; i < levelCount; i++) {
			_levels[i] = LEVEL_PLAYS_PER_AD;
		}

		if(typeof(TGS) !== 'undefined') {
			_tgsExists = true;
			// TGS.Init(_tgsConfig);
		}
		trace('TGSAdapter/init, _levels = ', _levels);
	};
	
	// http://developer.tresensa.com/docs/tgs/symbols/TGS.Analytics.html#.logGameEvent
	module.logEvent = function(type, args) {
		if(_tgsExists) {
			trace('TGSAdapter/logEvent, type = ' + type + ', args = ', args);
			TGS.Analytics[type].apply(this, args);
		}
	};
	
	module.submitScore = function(params) {
		trace('TGSAdaper/submitScore, _tgsExists = ' + _tgsExists);
		if(_tgsExists) {
			params.leaderboardID = LEADERBOARD_ID;
			trace('submitting score: ', params);
			TGS.Leaderboard.SubmitScore(params);
		}
	};
	
	module.adCheck = function(idx) {
		trace('TGSAdapter/adCheck, _levels[' + idx + '] = ' + _levels[idx] + ', LEVELS_PLAYS_PER_AD = ' + LEVEL_PLAYS_PER_AD);
		// if(_tgsExists) {
		if(_needAd) {
			// if(_levels[idx] === 0) {
				// _levels[idx] = LEVEL_PLAYS_PER_AD;
				this.displayInterstitial();
			// } else {
			// 	_levels[idx]--;
			// 	_finishAdSession();
			// }
			_needAd = false;
		} else {
			_needAd = true;
			_finishAdSession();
		}
	};
	
	module.displayInterstitial = function() {
		
		trace('TGSAdapter/displayInterstitial');
		PolyworksGame.adPlaying = true;
		PWG.EventCenter.trigger({ type: PWG.Events.AD_STARTED });
		TGS.Advertisement.DisplayInterstitialAd(_displayConfig);		
	};
	
	module.addWidget = function() {
		trace('TGSAdapter/addWidget');
		var winW = PWG.Stage.winW; 
		var winH = PWG.Stage.winH;
		
		var unit = PWG.Stage.unit; 
		var widgetX = (unit * 3);
		var widgetY = (unit * 0.5);
		var widgetScale = (unit * PWG_WIDGET_UNITS) / TRE_SENSA_WIDGET_WIDTH;
		trace('\twidget x/y = ' + widgetX + '/' + widgetY + ', scale = ' + widgetScale + ', widget w should be = ' + (unit * PWG_WIDGET_UNITS));

		if(_tgsExists) {
			this.widget = PolyworksGame.Tresensa.createWidget({
				x: widgetX,
				y: widgetY,
				scale: widgetScale,
				shareUrl: 'https://keke.tresensa.com/',
				shareImage: 'http://www.polyworksgames.com/games/keke2/assets/images/keke_grey_expanse_title.png',
				shareTitle: 'keke and the grey expanse',
				shareMessage: 'i love playing keke and the grey expanse!',
				leaderboardID: LEADERBOARD_ID
			});
			this.isOpen = true;
		}
	};

	module.removeWidget = function() {
		trace('TGSAdapter/removeWidget, this.widget = ', this.widget);
		if(this.widget) {
			this.widget.close();
		}
		this.isClosed = true;
	};
	
	module.hideGameOverWidget = function() {
		trace('TGSAdapter/hideGameOverWidget');
		if(this.widget) {
			this.widget.close();
		}
		_endScreenContainer.style.display = 'none';
	};
	
	function _finishAdSession() {
		trace('TGSAdapter/_finishAdSession');
		PolyworksGame.adPlaying = false;
		PWG.EventCenter.trigger({ type: PWG.Events.AD_COMPLETED });
	}
	
	return module;
}());