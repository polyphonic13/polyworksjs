var FarkleGUI = function() {

	var module = {};
	
	function GUIDice() {
		this.dice = [];
	};

	GUIDice.prototype.add = function(die) {
		this.dice.push(die);
	};

	GUIDice.prototype.display = function() {

	};

	function GUIDie(idx, value, id, parentEl, isActive) {
		this.idx = idx;
		this.id = id;
		this.value = value;
		this.selected = false;
		
		this.el = document.createElement('div');
		this.el.className = "die die_" + value;
		this.el.setAttribute('id',  id);
		this.el.style.left = (((idx + 1) * (FarkleGUI.unit * 5)) + (FarkleGUI.unit * idx)) + 'px';
		parentEl.appendChild(this.el); 
		
		if(isActive) {
			this.el.addEventListener('click', function(event) {
				FarkleGUI.selectDie(idx);
			});
		}
		
		FarkleGUI.currentDice[idx] = this;
	};

	module.GUIDie = GUIDie;
	module.GUIDice = GUIDice;

	module.currentDice = {};
	module.rolledDice = {};
	module.toSelect = {};
	module.button1Callback = null;
	
	module.init = function(config) {

		this.playArea = document.getElementById('play_area');
		this.unit = this.playArea.offsetWidth/100;
		
		this.subTitle = document.getElementById('sub_title');

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

		this.totalScore = document.getElementById('total_score');
		this.turnScore = document.getElementById('turn_score');

		this.bank = document.getElementById('bank');
		
	};
	
	module.startTurn = function(config) {
		this.setSubTitle(config.subTitleText);
		this.updateTurnScore(0);
		this.updateTotalScore(config.totalScore);
	};
	
	module.startRoll = function(cb) {
		trace('FarkleGUI/startRoll, cb = ', cb);
		this.removeRolledDice();
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
				var id = 'rolledDie' + idx + String(new Date().getTime());
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

	module.removeRolledDice = function() {
		// trace('FarkleGUI/removeRolledDice, dice = ', this.rolledDice);
		PWG.Utils.each(
			this.rolledDice,
			function(die) {
				// trace('\tdie = ', die);
				this.removeRolledDie(die);
			},
			this
		);
	};
	
	module.removeRolledDie = function(die) {
		// trace('FarkleGUI/removeRolledDie, die = ', die);
		die.el.parentNode.removeChild(die.el);
		delete this.rolledDice[die.id];
	};
	
	module.selectDie = function(idx) {
		trace('FarkleGUI/selectDie, idx = ' + idx);
		var die = module.currentDice[idx];
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
					var guiDie = new GUIDie(key, die, 'selectedDie' + die.key, this.bank);
					trace('\tdie = ', die);
					values.push(die.value);
					// this.removeRolledDie(die);
				},
				FarkleGUI
			);
			trace('\tvalues now = ', values);
			if(FarkleGUI.selectedCb) {
				FarkleGUI.selectedCb.call(this, values);
			}
		}
	};
	
	module.updateTurnScore = function(score) {
		this.turnScore.innerHTML = 'turn: ' + score;
	};
	
	module.updateTotalScore = function(score) {
		this.totalScore.innerHTML = 'total: ' + score;
	};
	
	return module;
}();
