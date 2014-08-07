var FarkleGUI = function() {
	var DIE_WIDTH_HEIGHT = 10;
	
	var playerElements = '<div id="sub_title_~{name}~" class="sub_title">~{name}~</div><div  id="turn_score_~{name}~" class="turn_score text_md">turn: 0</div><div  id="total_score_~{name}~" class="total_score text_md">total: 0</div><div id="farkles_~{name}~" class="current_farkles text_md text_red">F: 0</div>';
	
	var module = {};
	
	function GUIDie(idx, value, id, parentEl, isActive) {
		this.idx = idx;
		this.id = id;
		this.value = value;
		this.selected = false;
		// trace('GUIDie/constructor, idx = ' + idx + ', value = ' + value + ', id = ' + id);
		this.el = document.createElement('div');
		this.el.className = "die die_" + value;
		this.el.setAttribute('id',  id);
		this.el.style.left = (((idx) * (module.unit * DIE_WIDTH_HEIGHT)) + (module.unit * idx)) + 'px';
		parentEl.appendChild(this.el); 

		if(isActive) {
			this.el.addEventListener('click', function(event) {
				module.selectDie(id);
			});
		}
	};

	module.GUIDie = GUIDie;

	module.rolledDice = {};
	module.playerEls = {};
	
	module.button1Callback = null;

	module.init = function(cb) {

		FarkleGUI.playArea = document.getElementById('play_area');
		// animate player in
		FarkleGUI.playArea.className = 'animation_left_to_right';
		
		FarkleGUI.infoArea = document.getElementById('info');
		
		FarkleGUI.unit = FarkleGUI.playArea.offsetWidth/100;
		FarkleGUI.button1 = document.getElementById('button1');
		FarkleGUI.button2 = document.getElementById('button2');
		FarkleGUI.bank = document.getElementById('bank');

		FarkleGUI.button1.addEventListener('click', module.onButton1Click);
		FarkleGUI.button2.addEventListener('click', module.onButton2Click);

		module.button1Callback = cb;
		FarkleGUI.setButton(FarkleGUI.button1, 'start');
	};
	
	module.startGame = function(players) {

		FarkleGUI.addPlayerEls(players);
	};
	
	module.addPlayerEls = function(players) {
		// trace('FarkleGUI/addPlayerEls, players = ', players);
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			players,
			function(player) {
				// trace('\tadding player: ' + player.name);
				var el = document.createElement('div');
				el.setAttribute('id', player.name);
				var html = PWG.Utils.parseMarkup(playerElements, player);
				el.innerHTML = html;
				el.className = 'player';
				el.style.opacity = 0.5;
				FarkleGUI.playerEls[player.name] = el;
				playersEl.appendChild(el);
			},
			this
		);
	};
	
	module.removePlayerEls = function() {
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			FarkleGUI.playerEls,
			function(el, key) {
				playersEl.removeChild(el);
				delete FarkleGUI.playerEls[key];
			},
			this
		);
	};
	
	module.startTurn = function(player) {
		// trace('FarkleGUI/startTurn');
		FarkleGUI.switchPlayerEl(player.name);

		FarkleGUI.removeDice(FarkleGUI.selectedDice);
		FarkleGUI.selectedDice = {};
		FarkleGUI.updateText('infoArea', '');
		FarkleGUI.updateText('turnScore', 0);
		FarkleGUI.updateText('totalScore',  player.score);
	};
	
	module.switchPlayerEl = function(name) {
		FarkleGUI.subTitle = document.getElementById('sub_title_' + name);
		FarkleGUI.totalScore = document.getElementById('total_score_'+name);
		FarkleGUI.turnScore = document.getElementById('turn_score_'+name);
		FarkleGUI.farklesText = document.getElementById('farkles_'+name);
		
		PWG.Utils.each(
			FarkleGUI.playerEls,
			function(el, key) {
				if(key === name) {
					// FarkleGUI.subTitle.innerHTML = name + '\'s turn';
					el.style.opacity = 1;
				} else {
						// FarkleGUI.subTitle.innerHTML = name;
					el.style.opacity = 0.5;
				}
			},
			this
		)
	};
	
	module.startRoll = function(cb) {
		// trace('FarkleGUI/startRoll, cb = ', cb);
		FarkleGUI.removeDice(FarkleGUI.rolledDice);
		FarkleGUI.toSelect = {};
		FarkleGUI.rolledDice = {};
		FarkleGUI.selecting = false;
		module.button1Callback = cb;
		FarkleGUI.setButton(FarkleGUI.button1, 'roll');
	};
	
	module.endTurn = function(player) {
		module.updateText('totalScore', player.score);
		FarkleGUI.updateText('farklesText', player.currentFarkles)
	};
	
	module.setButton = function(button, text) {
		// trace('FarkleGUI/setButton, text = ', text, '\n\tbutton = ', button);
		button.innerHTML = text;
		FarkleGUI.showButton(button);
	};
	
	module.onButton1Click = function(event) {
		// trace('onButton1Click, callback = ', module.button1Callback);
		module.button1Callback.call(this);
	};
	
	module.onButton2Click = function(event) {
		// trace('onButton2Click, callback = ', module.button1Callback);
		module.hideButton(module.button2);
		module.button2Callback.call(this);
	};
	
	module.hideButton = function(button) {
		button.style.visibility = 'hidden';
	};
	
	module.showButton = function(button) {
		button.style.visibility = 'visible';
	};
	
	module.setSubTitle = function(text) {
		FarkleGUI.subTitle.innerHTML = text;
	};
	
	module.displayRoll = function(dice) {
		// trace('FarkleGUI/displayRoll, dice = ', dice);
		FarkleGUI.setButton(FarkleGUI.button1, 'select dice');
		FarkleGUI.button1Callback = FarkleGUI.onSelected;
		FarkleGUI.selecting = false;

		PWG.Utils.each(
			dice,
			function(die, idx) {
				var id = 'rolledDie' + idx + '-' + String(new Date().getTime()) + '-' + String(Math.random() * 999);
				var guiDie = new GUIDie(idx, die, id, FarkleGUI.playArea, true);
				FarkleGUI.rolledDice[id] = guiDie;
			},
			this
		);
/*
		FarkleGUI.guiDice = new Farkle.GUIDice(); 
		PWG.Utils.each(
			roll,
			function(die, idx) {
				FarkleGUI.guiDice.add(new Farkle.GUIDie(idx, die));
			},
			this
		);
*/
	};

	module.selectDie = function(idx) {
		// trace('FarkleGUI/selectDie, idx = ' + idx);
		var die = module.rolledDice[idx];
		// trace('\tdie = ', die);
		if(!die.selected) {
			die.el.style.opacity = 0.75;
			die.selected = true;
			FarkleGUI.addSelectedDie(die);
		} else {
			die.el.style.opacity = 1;
			die.selected = false;
			FarkleGUI.removeSelectedDie(die);
		}
	};

	module.addSelectedDie = function(die) {
		FarkleGUI.toSelect[die.idx] = die;
	};
	
	module.removeSelectedDie = function(die) {
		delete FarkleGUI.toSelect[die.idx];
	};
	
	module.setSelectedCallback = function(cb) {
		FarkleGUI.selectedCb = cb;
	};
	
	module.onSelected = function() {
		// if(!FarkleGUI.selecting) {
			FarkleGUI.selecting = true;
			var values = [];
			// trace('FarkleGUI/onSelected, toSelect = ', module.toSelect);
			PWG.Utils.each(
				module.toSelect,
				function(die, key) {
					var guiDie = new GUIDie(PWG.Utils.objLength(module.selectedDice), die.value, 'selectedDie' + die.id, FarkleGUI.bank);
					// trace('\tdie = ', die);
					module.selectedDice[die.id] = guiDie;
					values.push(die.value);
				},
				FarkleGUI
			);
			// trace('\tvalues now = ' + values + ', length = ' + values.length);
			if(values.length > 0) {
				if(module.selectedCb) {
					module.selectedCb.call(this, values);
				}
			}
		// }
	};
	
	module.showHotDice = function() {
		FarkleGUI.updateText('infoArea', 'HOT DICE!');
	};
	
	module.farkled = function(cb, player) {
		FarkleGUI.updateText('turnScore', '');
		FarkleGUI.updateText('infoArea', 'FARKLE!');
		FarkleGUI.updateText('farklesText', player.currentFarkles)
		FarkleGUI.hideButton(FarkleGUI.button2);
		FarkleGUI.button1Callback = cb;
		FarkleGUI.setButton(FarkleGUI.button1, 'end turn');
	};
	
	module.removeDice = function(list) {
		// trace('FarkleGUI/removeDice, list = ', list);
		PWG.Utils.each(
			list,
			function(die) {
				// trace('\tdie = ', die);
				FarkleGUI.removeDie(die, list);
			},
			this
		);
		// trace('----- FarkleGUI/removeDice, list now = ', list);
	};
	
	module.removeDie = function(die, list) {
		// trace('FarkleGUI/removeDie, die = ', die, '\tlist = ', list);
		die.el.parentNode.removeChild(die.el);
		delete list[die.id];
	};
	
	module.updateText = function(el, text, style) {
		var prefixText = '';
		if(el === 'turnScore') {
			prefixText = 'turn: ';
		} else if(el === 'totalScore') {
			prefixText = 'total: ';
		} else if(el === 'farklesText') {
			prefixText = 'F: ';
		}
		this[el].innerHTML = prefixText + text;
		if(el !== 'farklesText') {
			if(text === 'FARKLE!') {
				var redIdx = this[el].className.indexOf(' text_red');
				if(redIdx === -1) {
					this[el].className += ' text_red';
				}
			} else {
				var redIdx = this[el].className.indexOf(' text_red');
				if(redIdx > -1) {
					var sansRed = this[el].className.substr(0, redIdx);
					this[el].className = sansRed;
				}
			}
		}
	};
	
	module.showEndTurnButton = function(cb) {
		FarkleGUI.setButton(FarkleGUI.button2, 'end turn');
		module.button2Callback = cb;
	};
	
	module.gameOver = function(cb, player) {
		FarkleGUI.updateText('infoArea', player.name + ' wins with: ' + player.score);
		FarkleGUI.hideButton(module.button2);
		FarkleGUI.button1Callback = cb;
		FarkleGUI.setButton(module.button1, 'play again');
	};
	
	module.cleanUp = function() {
		FarkleGUI.selecting = false;
		FarkleGUI.button1Callback = null;
		FarkleGUI.removeDice(FarkleGUI.selectedDice);
		FarkleGUI.removePlayerEls();
		FarkleGUI.selectedDice = {};

		// FarkleGUI.button1.removeEventListener('click', module.onButton1Click);
		// FarkleGUI.button2.removeEventListener('click', module.onButton2Click);

	};
	
	return module;
}();
