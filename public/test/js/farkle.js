
var Farkle = function() {
	var module = {};
	
	var NUM_DICE = 6;
	var MIN_TURN_SCORE = 300;
	var STRAIGHT_SCORE = 1500;
	var FULL_HOUSE_SCORE = 750;
	var ONE_TRIPLE_MULTIPLIER = 1000;
	var TRIPLE_MULTIPLIER = 100;
	var FIVE_SCORE = 50;
	var ONE_SCORE = 100;
	var TRIPLE_FARKLE = 500;
	var WINNING_SCORE = 1000;

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
		this.totalScore = 0;
	}
	
	TurnDice.prototype.setActiveRoll = function(roll) {
		this.activeRoll = roll;
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
				if(counts[1] || counts[5]) {
					this.farkled = false;
				}
			}
		}
		trace('post sort active, farkled = ' + this.farkled + ', hotdice = ' + this.hotDice);
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
						function(count, dieFace) {
							trace('\tadding triples for '+dieFace+': ' + count);
							var multiplier = (parseInt(dieFace) === 1) ? ONE_TRIPLE_MULTIPLIER : TRIPLE_MULTIPLIER;
							trace('\tmultiplier = ' + multiplier);
							score += (dieFace * multiplier) * (count - 2);
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
		this.totalScore += score;
		this.throwScores.push(score);
		trace('\tthrowScores now: ' + this.throwScores + '\n\tturn score: ' + this.totalScore);
	};

	function Player(config) {
		// trace('Player/constructor, config = ', config);
		PWG.Utils.extend(this, config);
		this.score = 0;
		this.currentFarkles = 0;
	};
	
	Player.prototype.printDetails = function() {
		PWG.Utils.each(
			this,
			function(value, key) {
				if(this.hasOwnProperty(key)) {
					trace('\t' + key + ' = ' + value);
				}
			},
			this
		);
	};
	
	module.Player = Player;
	module.TurnDice = TurnDice;
	
	module.straight = [1, 2, 3, 4, 5, 6];
	module.players = [];
	module.currentPlayer = -1;
	module.totalRounds = 0;

	module.startGame = function(players) {
		trace('Farkle/startGame');
		var first = true;
		PWG.Utils.each(
			players,
			function(player) {
				this.players.push(new Farkle.Player(player));
			},
			this
		);
		// trace('\tplayers now = ', this.players);
		this.currentPlayer = 0;
		this.totalRounds = 1;
		this.startTurn();
	};

	module.switchPlayer = function() {
		if(this.currentPlayer < (this.players.length - 1)) {
			this.currentPlayer++;
		} else {
			this.currentPlayer = 0;
			this.totalRounds++;
		}
		this.startTurn();
	};
	
	module.startTurn = function() {
		trace('\n-------------------------------\nFarkle/startTurn, currentPlayer = ' + this.players[this.currentPlayer].name);
		this.turnDice = new Farkle.TurnDice(NUM_DICE);
		this.startRoll();
	};
	
	module.startRoll = function() {
		var currentRoll = this.roll(this.turnDice.availableDice);
		trace('current roll = ' + currentRoll);
		// this.displayRoll(currentRoll);
		this.turnDice.setActiveRoll(currentRoll);

		if(this.turnDice.farkled) {
			trace('FARKLED! womp womp');
			this.endTurn(true);
		} else {
			if(this.turnDice.score > MIN_TURN_SCORE) {
				this.canEndTurn = true;
			}
			this.promptDiceSave();
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

	module.promptDiceSave = function() {
		// have user select dice to score on
		// this.turnDice.bankScoringDice([ user selection ]);
		// if(this.turnDice.totalScore >= MIN_TURN_SCORE) {
		// 	//	prompt end turn
		// } else if(this.turnDice.available > 0) {
		// 		this.startRoll();
		// } else {
		// 	this.endTurn(true);
		// }
	};
	
	module.endTurn = function(farkled) {
		if(farkled) {
			this.players[this.currentPlayer].currentFarkles++;
			if(this.activeFarkles >= 3) {
				trace('TRIPLE FARKLE! setting score back: ' + TRIPLE_FARKLE);
				this.players[this.currentPlayer].score -= TRIPLE_FARKLE;
				this.players[this.currentPlayer].currentFarkles = 0;
			}
		} else {
			this.players[this.currentPlayer].currentFarkles = 0;
			this.players[this.currentPlayer].score += this.turnDice.totalScore;
		}

		if(this.players[this.currentPlayer].score >= WINNING_SCORE) {
			this.gameOver();
		} else {
			this.switchPlayer();
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
	
	module.gameOver = function() {
		var topScorer = -1;
		var prevScore = 0;

		trace('Game Over. Scores: ');
		PWG.Utils.each(
			this.players,
			function(player, idx) {
				trace('\tplayer['+player.name+'] score = ' + player.score);
				if(player.score > prevScore) {
					// trace('\t\tsetting topScorer to + ' + idx);
					topScorer = idx;
					prevScore = player.score;
				}
			},
			this
		);

		trace('After ' + this.totalRounds + ' rounds the winner is: ');
		trace(this.players[topScorer].printDetails());
	};

	return module;
}();

var players = [
	{
		name: 'paul',
		age: 39,
		gender: 'male'
	},
	{
		name: 'seema',
		age: 30,
		gender: 'female'
	}
];

Farkle.startGame(players);