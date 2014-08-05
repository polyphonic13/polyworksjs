var Farkle = function() {
	var module = {};
	
	var NUM_DICE = 6;
	module.STRAIGHT = [1, 2, 3, 4, 5, 6];
	
	module.init = function() {
		this.playerFarkles = 0;
		this.computerFarkles = 0;
		this.playerRolls = [];
		this.computerRolls = [];

	};

	module.startRound = function() {
		this.currentScore = 0;
		this.hotDice = false;
		this.available = NUM_DICE;
		this.currentRoll = this.roll(this.available);
		
		if(this.straightTest(this.currentRoll)) {
			this.hotDice = true;
			trace('HOT DICE: straight!');
		} else {
			var counts = PWG.Utils.elementCount(this.currentRoll);
			trace('current roll = ' + this.currentRoll + '\n\tcounts = ', counts);
			if(this.threeOfAKindTest(counts)) {
				this.hotDice = true;
				trace('HOT DICE: 3 of a kind!');
			} else if(this.triplesTest(counts)) {
				// possible 2 triples on first roll
				if(this.hotDice) {
					this.hotDice = true;
					trace('HOT DICE: 2 triples');
				}
			} else if(this.onesAndFivesTest(counts)) {
				
			} else {
				this.farkle = true;
				trace('FARKLE!');
			}
		}
		// if()
	};
	
	module.roll = function(num) {
		var results = [];
		for(var i = 0; i < num; i++) {
			results.push(PWG.Utils.diceRoll());
		}
		return results.sort();
	};
	
	module.straightTest = function(arr) {
		return JSON.stringify(arr) === JSON.stringify(module.STRAIGHT)
	};
	
	module.threeOfAKindTest = function(counts) {
		var pass = true;
		// there can be only 3 counts
		if(PWG.Utils.objLength(counts) !== 3) {
			pass = false;
		} else {
			for(var key in counts) {
				// each count must equal 2
				if(counts[key] !== 2) {
					pass = false;
					break;
				}
			}
		}
		return pass;
	};
	
	module.triplesTest = function(counts) {
		var triples = false;
		for(var key in counts) {
			
		}
	};
	
	module.onesAndFivesTest = function(counts) {
		if(counts.hasOwnProperty(1) || counts.hasOwnProperty(5)) {
			return true;
		} else {
			return false;
		}
	};
	
	return module;
}();

Farkle.init();