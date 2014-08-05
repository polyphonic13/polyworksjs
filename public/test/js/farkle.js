var Farkle = function() {
	var module = {};
	
	var NUM_DICE = 6;
	var MIN_TURN_SCORE = 300;
	var FIVE_SCORE = 50;
	var ONE_SCORE = 100;
	var TRIPLE_MULTIPLIER = 100;
	var STRAIGHT_SCORE = 1500;
	var FULL_HOUSE_SCORE = 750;
	var TRIPLE_FARKLE = 500;
	var WINNING_SCORE = 10000;

	module.straight = [1, 2, 3, 4, 5, 6];
	
	module.startGame = function() {
		trace('Farkle/init');
		this.playerScore = 0;
		this.computerScore = 0;
		this.playerFarkles = 0;
		this.computerFarkles = 0;
		this.playerRolls = [];
		this.computerRolls = [];

	};

	module.startTurn = function() {
		this.turnScore = 0;
		this.hotDice = false;
		this.available = NUM_DICE;
		this.startRoll();
	};
	
	module.startRoll = function() {
		var currentRoll = this.roll(this.available);
		trace('current roll = ' + currentRoll);
		if(this.farkleTest(currentRoll)) { 
			trace('FARKLED! womp womp');
			this.endTurn(true);
		} else {
			trace('----- turn score = ' + this.turnScore);
			if(this.hotDice) {
				this.hotDice = false;
				var rollAgain = confirm('roll again?');
				if(rollAgain) {
					this.available = NUM_DICE;
					this.startRoll();
				} else {
					this.endTurn(false);
				}
			} else {
				// remove scoring dice
				
				if(this.turnScore > MIN_TURN_SCORE) {
					
				}
			}
		}
	};
	
	module.endTurn = function(farkled) {
		if(farkled) {
			this.activeFarkles++;
			if(this.activeFarkles >= 3) {
				this.playerScore -= TRIPLE_FARKLE;
				this.activeFarkles = 0;
			}
		} else {
			this.activeFarkles = 0;
			this.playerScore += this.turnScore;
		}
	};
	
	module.roll = function(num) {
		var results = [];
		for(var i = 0; i < num; i++) {
			results.push(PWG.Utils.diceRoll());
		}
		return results.sort();
	};
	
	module.farkleTest = function(rollResults) {
		var farkled = true;
		var onesAndFives = false; 
		var triples = [];
		var doubles = [];
		var scoringDice = 0;

		if(this.straightTest(rollResults)) {
			this.hotDice = true;
			farkled = false;
			this.turnScore += STRAIGHT_SCORE;
			trace('HOT DICE: straight!');
		} else {
			var counts = PWG.Utils.elementCount(rollResults);
			trace('\tcounts = ', counts);
			for(var key in counts) {
				if(counts[key] >= 3) {
					triples.push(key);
					var multipler = (key === 1) ? TRIPLE_MULTIPLIER * 100 : TRIPLE_MULTIPLIER;

					this.turnScore += (key * multipler) * (counts[key]/3);
					farkled = false;
				} else if(counts[key] === 2) {
					doubles.push(key);
				}
			}
			if(doubles.length === 3) {
				this.hotDice = true;
				farkled = false;
				trace('HOT DICE: full house!');
				this.turnScore += FULL_HOUSE_SCORE;
			} else if(triples.length > 0){
				farkled = false;
				if(triples.length === 2) {
					this.hotDice = true;
					trace('HOT DICE: 2 triples');
				} else {
					trace('triples present');
				}
			}
			if(!this.hotDice) {
				if(counts.hasOwnProperty(1) || counts.hasOwnProperty(5)) {
					if(counts[1] && !triples.hasOwnProperty(1)) {
						this.turnScore += (counts[1] * ONE_SCORE);
					}
					if(counts[5] && !triples.hasOwnProperty(5)) {
						this.turnScore += (counts[5] * FIVE_SCORE);
					}
					onesAndFives = true;
					farkled = false;
					trace('1s and/or 5s present');
				}
			}
		}
		return farkled;
	};
	
	module.straightTest = function(arr) {
		return JSON.stringify(arr) === JSON.stringify(module.straight);
	};
	
	return module;
}();

Farkle.startGame();