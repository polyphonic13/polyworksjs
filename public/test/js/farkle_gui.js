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

	function GUIDie(idx, value, parentEl, isActive) {
		this.idx = idx;
		this.value = value;
		this.selected = false;
		
		this.el = document.createElement('div');
		this.el.className = "die die_" + value;
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
	module.toSelect = {};
	module.buttonCallback = null;
	
	module.init = function(config) {
		this.playArea = document.getElementById('play_area');
		this.unit = this.playArea.offsetWidth/100;
		
		this.subTitle = document.getElementById('sub_title');
		this.setSubTitle(config.subTitleText);

		this.rollButton = document.getElementById('roll_button');
		this.setButton(config.buttonConfig);
		
		this.bank = document.getElementById('bank');
		
	};
	
	module.setButton = function(config) {
		trace('FarkleGUI/setButton, config = ', config);
		this.rollButton.innerHTML = config.text;
		if(config.callback) {
			this.buttonCallback = config.callback.call(this);
			
			this.rollButton.addEventListener('click', function(event) {
				FarkleGUI.onButtonClick(event);
			});
		}
		this.showButton();
	};
	
	module.onButtonClick = function(event) {
		trace('onButtonClick, callback = ', FarkleGUI.buttonCallback);
		FarkleGUI.buttonCallback.call(this);
	};
	
	module.hideButton = function() {
		this.rollButton.style.visibility = 'hidden';
	};
	
	module.showButton = function() {
		this.rollButton.style.visibility = 'visible';
	};
	
	module.setSubTitle = function(text) {
		this.subTitle.innerHTML = text;
	};
	
	module.displayRoll = function(dice) {
		trace('FarkleGUI/displayRoll, dice = ', dice);
		this.setButton({
			text: 'select dice',
			callback: function() {
				FarkleGUI.onSelected
			}
		});
		PWG.Utils.each(
			dice,
			function(die, idx) {
				var guiDie = new GUIDie(idx, die, this.playArea, true);
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
		trace('FarkleGUI/selectDiv, idx = ' + idx);
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
		
	};
	
	return module;
}();
