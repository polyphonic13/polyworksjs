var Farkle = function() {
	var module = {};
	
	module.NUM_DICE = 6;
	module.MIN_TURN_SCORE = 300;
	module.STRAIGHT_SCORE = 1500;
	module.FULL_HOUSE_SCORE = 750;
	module.ONE_TRIPLE_MULTIPLIER = 1000;
	module.TRIPLE_MULTIPLIER = 100;
	module.FIVE_SCORE = 50;
	module.ONE_SCORE = 100;
	module.TRIPLE_FARKLE = 500;
	module.WINNING_SCORE = 10000;

	// data / calculations
	function TurnDice(startingDice) {
		this.availableDice = startingDice;
		this.activeRoll = [];
		this.throwScores = [];
		this.totalScore = 0;
	}
	
	TurnDice.prototype.setActiveRoll = function(roll) {
		this.activeRoll = roll;
		this.triples = {};
		this.hotDice = false;
		this.farkled = true;
		this.scoringDice = 0;
		
		if(Farkle.straightTest(this.activeRoll)) {
			// STRAIGHT
			this.hotDice = true;
			this.farkled = false;
		} else {
			var counts = PWG.Utils.elementCount(this.activeRoll);
			var doubles = [];
			trace('\tcounts = ', counts);
			for(var key in counts) {
				if(counts[key] >= 3) {
					this.triples[key] = counts[key];
					this.farkled = false;
				} else if(counts[key] === 2) {
					doubles.push(key);
				}
			}
			if(doubles.length === 3) {
				// FULL HOUSE
				this.hotDice = true;
				this.farkled = false;
			} else {
				if(PWG.Utils.objLength(this.triples) > 0) {
					this.farkled = false;
					if(PWG.Utils.objLength(this.triples) === 2) {
						this.hotDice = true;
					}
					PWG.Utils.each(
						this.triples,
						function(triple) {
							trace('triple = ' + triple);
							this.scoringDice += triple;
						},
						this
					);
				}
				if(counts[1] || counts[5]) {
					this.farkled = false;
					if(counts[1] && !this.triples.hasOwnProperty(1)) {
						this.scoringDice += counts[1];
					}
					if(counts[5] && !this.triples.hasOwnProperty(5)) {
						this.scoringDice += counts[5];
					}
				}
			}
		}
		if(this.scoringDice === 6) {
			this.hotDice = true;
		}
		trace('\tfarkled = ' + this.farkled + ', hotdice = ' + this.hotDice + ', scoringDice = ' + this.scoringDice);
	};
	
	TurnDice.prototype.bankScoringDice = function(selection) {
		var scoringDice = [];
		var score = 0;

		PWG.Utils.each(
			selection, 
			function(die) {
				var idx = this.activeRoll.indexOf(die);
				if(idx > -1) {
					var scoring = this.activeRoll.splice(idx, 1);
					scoringDice.push(scoring[0]);
					this.availableDice--;
				}
			},
			this
		);
		trace('TurnDice/bankScoringDice\n\tscoringDice now = ', scoringDice, '\tactive now = ', this.activeRoll, '\tavailable = ' + this.availableDice);

		// CALCULATE SCORE
		if(Farkle.straightTest(scoringDice.sort())) {
			score = Farkle.STRAIGHT_SCORE;
		} else {
			var counts = PWG.Utils.elementCount(scoringDice);
			var doubles = [];
			var triples = {};

			for(var key in counts) {
				if(counts[key] >= 3) {
					triples[key] = counts[key];
					delete counts[key];
				} else if(counts[key] === 2) {
					doubles.push(key);
				}
			}

			if(doubles.length === 3) {
				score = Farkle.FULL_HOUSE_SCORE;
			} else {
				if(PWG.Utils.objLength(triples) > 0) {
					// trace('there are triples');
					PWG.Utils.each(
						triples,
						function(count, dieFace) {
							trace('\tadding triples for '+dieFace+': ' + count);
							var multiplier = (parseInt(dieFace) === 1) ? Farkle.ONE_TRIPLE_MULTIPLIER : Farkle.TRIPLE_MULTIPLIER;
							trace('\tmultiplier = ' + multiplier);
							score += (dieFace * multiplier) * (count - 2);
						},
						this
					);
				}
				if(counts[1] && counts[1] < 3) {
					score += (counts[1] * Farkle.ONE_SCORE);
				}
				if(counts[5] && counts[5] < 3) {
					score += (counts[5] * Farkle.FIVE_SCORE);
				}
			}
		}
		this.totalScore += score;
		this.throwScores.push(score);
		trace('\tthrowScores now: ' + this.throwScores + '\n\tturn score: ' + this.totalScore);

		if(this.availableDice === 0) {
			this.hotDice = true;
			this.availableDice = Farkle.NUM_DICE;
		}
	};

	module.TurnDice = TurnDice;
	
	module.straight = [1, 2, 3, 4, 5, 6];

	module.init = function(callback, context) {
		this.callback = callback;
		this.ctx = context || window;
	};

	module.startTurn = function() {
		this.turnDice = new Farkle.TurnDice(Farkle.NUM_DICE);
	};
	
	module.bankScoringDice = function(selection) {
		this.turnDice.bankScoringDice(selection);
		return this.turnDice.throwScores;
	};
	
	module.startRoll = function() {
		var currentRoll = this.roll(this.turnDice.availableDice);
		trace('current roll = ' + currentRoll);
		// this.displayRoll(currentRoll);
		this.turnDice.setActiveRoll(currentRoll);

		if(this.callback) {
			this.callback.call(this.ctx);
		}
	};
	
	module.roll = function(num) {
		var results = [];
		for(var i = 0; i < num; i++) {
			results.push(PWG.Utils.diceRoll());
		}
		// return [1,2,3,4,5,6];
		// return [3,3,3,5,5,1];
		// return [1,1,1,1,1,1];
		// return [1, 1, 5, 5, 5, 5];
		return results.sort();
	};

	module.straightTest = function(arr) {
		return JSON.stringify(arr) === JSON.stringify(module.straight);
	};
	
	return module;
}();