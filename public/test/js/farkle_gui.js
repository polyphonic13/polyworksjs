var FarkleGUI = function() {
	var DIE_WIDTH_HEIGHT = 10;
	
	var playerElements = '<div id="sub_title_~{name}~" class="sub_title">~{name}~</div><div  id="turn_score_~{name}~" class="turn_score text_md">turn: 0</div><div  id="total_score_~{name}~" class="total_score text_md">total: 0</div>';
	
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
		this.el.style.left = (((idx) * (FarkleGUI.unit * DIE_WIDTH_HEIGHT)) + (FarkleGUI.unit * idx)) + 'px';
		parentEl.appendChild(this.el); 

		if(isActive) {
			this.el.addEventListener('click', function(event) {
				FarkleGUI.selectDie(id);
			});
		}
	};

	module.GUIDie = GUIDie;

	module.rolledDice = {};
	module.playerEls = {};
	
	module.button1Callback = null;
	
	module.init = function(players) {

		this.playArea = document.getElementById('play_area');
		this.unit = this.playArea.offsetWidth/100;
		this.addPlayerEls(players);

		this.button1 = document.getElementById('button1');
		this.button1.addEventListener('click', function(event) {
			trace('button1 click handler');
			FarkleGUI.onButton1Click(event);
		});
		
		this.button2 = document.getElementById('button2');
		this.button2.addEventListener('click', function(event) {
			trace('button2 click handler');
			FarkleGUI.onButton2Click(event);
		});

		this.bank = document.getElementById('bank');
		
	};
	
	module.addPlayerEls = function(players) {
		trace('FarkleGUI/addPlayerEls, players = ', players);
		var playersEl = document.getElementById('players');
		PWG.Utils.each(
			players,
			function(player) {
				trace('\tadding player: ' + player.name);
				var el = document.createElement('div');
				el.setAttribute('id', player.name);
				var html = PWG.Utils.parseMarkup(playerElements, player);
				el.innerHTML = html;
				el.className = 'player';
				el.style.opacity = 0.5;
				this.playerEls[player.name] = el;
				playersEl.appendChild(el);
			},
			this
		);
	};
	
	module.startTurn = function(player) {
		trace('FarkleGUI/startTurn');
		this.switchPlayerEl(player.name);

		this.removeDice(this.selectedDice);
		this.selectedDice = {};
		this.updateText('turnScore', 0);
		this.updateText('totalScore',  player.score);
	};
	
	module.switchPlayerEl = function(name) {
		this.subTitle = document.getElementById('sub_title_' + name);
		this.totalScore = document.getElementById('total_score_'+name);
		this.turnScore = document.getElementById('turn_score_'+name);

		PWG.Utils.each(
			this.playerEls,
			function(el, key) {
				if(key === name) {
					// this.subTitle.innerHTML = name + '\'s turn';
					el.style.opacity = 1;
				} else {
						// this.subTitle.innerHTML = name;
					el.style.opacity = 0.5;
				}
			},
			this
		)
	};
	
	module.startRoll = function(cb) {
		trace('FarkleGUI/startRoll, cb = ', cb);
		this.removeDice(this.rolledDice);
		this.toSelect = {};
		this.rolledDice = {};
		this.setButton(this.button1, 'roll');
		FarkleGUI.button1Callback = cb;
	};
	
	module.setButton = function(button, text) {
		trace('FarkleGUI/setButton, text = ', text, '\n\tbutton = ', button);
		button.innerHTML = text;
		this.showButton(button);
	};
	
	module.onButton1Click = function(event) {
		// trace('onButton1Click, callback = ', FarkleGUI.button1Callback);
		FarkleGUI.button1Callback.call(this);
	};
	
	module.onButton2Click = function(event) {
		// trace('onButton2Click, callback = ', FarkleGUI.button1Callback);
		module.hideButton(module.button2);
		FarkleGUI.button2Callback.call(this);
	};
	
	module.hideButton = function(button) {
		button.style.visibility = 'hidden';
	};
	
	module.showButton = function(button) {
		button.style.visibility = 'visible';
	};
	
	module.setSubTitle = function(text) {
		this.subTitle.innerHTML = text;
	};
	
	module.displayRoll = function(dice) {
		trace('FarkleGUI/displayRoll, dice = ', dice);
		this.setButton(this.button1, 'select dice');
		FarkleGUI.button1Callback = FarkleGUI.onSelected;
		FarkleGUI.selecting = false;

		PWG.Utils.each(
			dice,
			function(die, idx) {
				var id = 'rolledDie' + idx + '-' + String(new Date().getTime()) + '-' + String(Math.random() * 999);
				var guiDie = new GUIDie(idx, die, id, this.playArea, true);
				this.rolledDice[id] = guiDie;
			},
			this
		);
/*
		this.guiDice = new Farkle.GUIDice(); 
		PWG.Utils.each(
			roll,
			function(die, idx) {
				this.guiDice.add(new Farkle.GUIDie(idx, die));
			},
			this
		);
*/
	};

	module.selectDie = function(idx) {
		trace('FarkleGUI/selectDie, idx = ' + idx);
		var die = module.rolledDice[idx];
		trace('\tdie = ', die);
		if(!die.selected) {
			die.el.style.opacity = 0.75;
			die.selected = true;
			this.addSelectedDie(die);
		} else {
			die.el.style.opacity = 1;
			die.selected = false;
			this.removeSelectedDie(die);
		}
	};

	module.addSelectedDie = function(die) {
		this.toSelect[die.idx] = die;
	};
	
	module.removeSelectedDie = function(die) {
		delete this.toSelect[die.idx];
	};
	
	module.setSelectedCallback = function(cb) {
		this.selectedCb = cb;
	};
	
	module.onSelected = function() {
		if(!FarkleGUI.selecting) {
			FarkleGUI.selecting = true;
			var values = [];
			trace('FarkleGUI/onSelected, toSelect = ', FarkleGUI.toSelect);
			PWG.Utils.each(
				FarkleGUI.toSelect,
				function(die, key) {
					var guiDie = new GUIDie(PWG.Utils.objLength(module.selectedDice), die.value, 'selectedDie' + die.id, this.bank);
					trace('\tdie = ', die);
					module.selectedDice[die.id] = guiDie;
					values.push(die.value);
				},
				FarkleGUI
			);
			trace('\tvalues now = ' + values + ', length = ' + values.length);
			if(values.length > 0) {
				if(FarkleGUI.selectedCb) {
					FarkleGUI.selectedCb.call(this, values);
				}
			}
		}
	};
	
	module.farkled = function(cb) {
		this.updateText('turnScore', 'FARKLE!');
		this.hideButton(this.button2);
		this.button1Callback = cb;
		this.setButton(this.button1, 'end turn');
	};
	
	module.removeDice = function(list) {
		// trace('FarkleGUI/removeDice, list = ', list);
		PWG.Utils.each(
			list,
			function(die) {
				// trace('\tdie = ', die);
				this.removeDie(die, list);
			},
			this
		);
		trace('----- FarkleGUI/removeDice, list now = ', list);
	};
	
	module.removeDie = function(die, list) {
		// trace('FarkleGUI/removeDie, die = ', die, '\tlist = ', list);
		die.el.parentNode.removeChild(die.el);
		delete list[die.id];
	};
	
	module.updateText = function(el, text, style) {
		var prefixText;
		if(el === 'turnScore') {
			prefixText = 'turn: ';
		} else if(el === 'totalScore') {
			prefixText = 'total: ';
		}
		this[el].innerHTML = prefixText + text;
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
	};
	
	module.showEndTurnButton = function(cb) {
		this.setButton(this.button2, 'end turn');
		FarkleGUI.button2Callback = cb;
	};
	
	return module;
}();
