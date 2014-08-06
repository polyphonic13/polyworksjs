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

	function GUIDie(idx, value) {
		this.idx = idx;
		this.value = value;

		var dieEl = document.createElement('div');
		dieEl.className = "die die_" + value;
		dieEl.style.left = (((idx + 1) * (FarkleGUI.unit * 5)) + (FarkleGUI.unit * idx)) + 'px';
		FarkleGUI.playArea.appendChild(dieEl); 
	};

	module.init = function(config) {
		this.playArea = document.getElementById('play_area');
		this.unit = this.playArea.offsetWidth/100;
		
		this.subTitle = document.getElementById('sub_title');
		this.setSubTitle(config.subTitleText);

		this.rollButton = document.getElementById('roll_button');
		this.setButton(config.buttonConfig);
	};
	
	module.setButton = function(config) {
		this.rollButton.innerHTML = config.text;
		if(config.callback) {
			this.rollButton.addEventListener('click', function(event) {
				config.callback.call(this)
			});
		}
		this.showButton();
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
		
		PWG.Utils.each(
			dice,
			function(die, idx) {
				var guiDie = new GUIDie(idx, die);
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

	module.GUIDie = GUIDie;
	module.GUIDice = GUIDice;

	return module;
}();
