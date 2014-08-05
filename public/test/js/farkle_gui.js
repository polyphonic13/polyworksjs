var FarkleGUI = function() {

	var module = {};
	
	// graphics
	var images = {
		dice: [
			'assets/img/die_one.png',
			'assets/img/die_two.png',
			'assets/img/die_three.png',
			'assets/img/die_four.png',
			'assets/img/die_five.png',
			'assets/img/die_six.png'
		]
	};

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
		this.image.url = images.dice[value];
	};

	module.displayRoll = function(roll) {
		this.guiDice = new Farkle.GUIDice(); 
		PWG.Utils.each(
			roll,
			function(die, idx) {
				this.guiDice.add(new Farkle.GUIDie(idx, die));
			},
			this
		);
	};

	module.GUIDie = GUIDie;
	module.GUIDice = GUIDice;

	return module;
}();
