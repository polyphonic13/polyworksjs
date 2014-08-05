var Farkle = function() {
	var module = {};
	
	var NUM_DICE = 6;
	var MIN_TURN_SCORE = 300;
	var STRAIGHT_SCORE = 1500;
	var FULL_HOUSE_SCORE = 750;
	var TRIPLE_MULTIPLIER = 100;
	var FIVE_SCORE = 50;
	var ONE_SCORE = 100;
	var TRIPLE_FARKLE = 500;
	var WINNING_SCORE = 10000;

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
	
	// data / calculations
	function TurnDice(startingDice) {
		this.availableDice = startingDice;
		this.activeRoll = [];
		this.throwScores = [];
	}
	
	TurnDice.prototype.setActiveRoll = function(roll) {
		this.activeRoll = roll;
		this.sortActive();
	};
	
	TurnDice.prototype.sortActive = function() {
		this.triples = {};
		this.hotDice = false;
		this.farkled = true;

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
				if(PWG.Utils.objLength(this.triples.length) > 0) {
					this.farkled = false;
					if(PWG.Utils.objLength(this.triples.length) === 2) {
						this.hotDice = true;
					}
				}
				// DON'T BOTHER WITH 1s AND 5s IF HOTDICE
				if(!this.hotDice) {
					if(counts[1] || counts[5]) {
						this.farkled = false;
					}
				}
			}
		}
		trace('post sort active, farkled = ' + this.farkled);
	};
	
	TurnDice.prototype.bankScoringDice = function(selection) {
		var scoringDice = [];

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

		var score = 0;
		if(Farkle.straightTest(scoringDice.sort())) {
			score = STRAIGHT_SCORE;
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
				score = FULL_HOUSE_SCORE;
			} else {
				if(PWG.Utils.objLength(triples) > 0) {
					// trace('there are triples');
					PWG.Utils.each(
						triples,
						function(triple, key) {
							// trace('\tadding triples for '+key+': ' + triple);
							var multipler = (key === 1) ? TRIPLE_MULTIPLIER * ONE_SCORE : TRIPLE_MULTIPLIER;
							score += (key * multipler) * (triple/3);
						},
						this
					);
				}
				if(counts[1] && counts[1] < 3) {
					score += (counts[1] * ONE_SCORE);
				}
				if(counts[5] && counts[5] < 3) {
					score += (counts[5] * FIVE_SCORE);
				}
			}
		}
		this.throwScores.push(score);
		trace('\tthrowScores now: ' + this.throwScores);
	};

	module.TurnDice = TurnDice;
	
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
		this.turnDice = new Farkle.TurnDice(NUM_DICE);
		this.startRoll();
	};
	
	module.startRoll = function() {
		var currentRoll = this.roll(this.turnDice.availableDice);
		trace('current roll = ' + currentRoll);
		// this.displayRoll(currentRoll);
		this.turnDice.setActiveRoll(currentRoll);

		if(this.turnDice.farkle) {
			trace('FARKLED! womp womp');
			this.endTurn(true);
		} else {
			if(this.turnDice.score > MIN_TURN_SCORE) {
				this.canEndTurn = true;
			}
			this.promptDiceToSave();
		}
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

	module.promptDiceToSave = function() {
		// have user select dice to score on
		
		// this.startRoll();
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
	
	module.straightTest = function(arr) {
		return JSON.stringify(arr) === JSON.stringify(module.straight);
	};
	
	return module;
}();

Farkle.startGame();