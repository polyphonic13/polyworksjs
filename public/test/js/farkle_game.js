var Game = function() {
	var module = {};

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

	module.players = [];
	module.currentPlayer = -1;
	module.totalRounds = 0;

	module.startGame = function(players) {
		trace('Game/startGame');

		Farkle.init(this.onRolled, this);

		PWG.Utils.each(
			players,
			function(player) {
				this.players.push(new Player(player));
			},
			this
		);
		// trace('\tplayers now = ', this.players);
		this.currentPlayer = 0;
		this.totalRounds = 1;
		trace('----- start of ' + this.players[this.currentPlayer].name + '\'s turn');
		Farkle.startTurn();
	};

	module.onRolled = function() {
		if(Farkle.turnDice.farkled) {
			trace('FARKLED! womp womp');
			this.endTurn(true);
		} else {
			if(Farkle.turnDice.score > Farkle.MIN_TURN_SCORE) {
				this.canEndTurn = true;
			}
			this.promptDiceSave();
		}
	};
	
	module.switchPlayer = function() {
		if(this.currentPlayer < (this.players.length - 1)) {
			this.currentPlayer++;
		} else {
			this.currentPlayer = 0;
			this.totalRounds++;
		}
		trace('----- start of ' + this.players[this.currentPlayer].name + '\'s turn');
		Farkle.startTurn();
	};
	
	module.promptDiceSave = function() {
		// have user select dice to score on
		// Farkle.bankScoringDice([ user selection ]);
		// if(Farkle.turnDice.totalScore >= MIN_TURN_SCORE) {
		// 	//	prompt end turn
		// } else if(Farkle.turnDice.available > 0) {
		// 		this.startRoll();
		// } else {
		// 	this.endTurn(true);
		// }
	};
	
	module.endTurn = function(farkled) {
		if(farkled) {
			this.players[this.currentPlayer].currentFarkles++;
			if(this.activeFarkles >= 3) {
				trace('TRIPLE FARKLE! setting score back: ' + Farkle.TRIPLE_FARKLE);
				this.players[this.currentPlayer].score -= Farkle.TRIPLE_FARKLE;
				this.players[this.currentPlayer].currentFarkles = 0;
			}
		} else {
			this.players[this.currentPlayer].currentFarkles = 0;
			this.players[this.currentPlayer].score += Farkle.turnDice.totalScore;
		}

		trace('----- end of ' + this.players[this.currentPlayer].name + '\'s turn with a score of: ' + this.players[this.currentPlayer].score);

		if(this.players[this.currentPlayer].score >= Farkle.WINNING_SCORE) {
			this.gameOver();
		} else {
			this.switchPlayer();
		}
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

Game.startGame(players);