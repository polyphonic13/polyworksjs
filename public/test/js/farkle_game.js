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
		FarkleGUI.init();

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
		this.startTurn();
		// trace('----- ' + this.players[this.currentPlayer].name + '\'s turn');
		// Farkle.startTurn();
	};

	module.onRollClicked = function() {
		trace('Game/onRollClicked');
		Farkle.startTurn();
	};
	
	module.onRolled = function() {
		trace('GAME/onRolled');
		FarkleGUI.displayRoll(Farkle.turnDice.activeRoll);
		FarkleGUI.setSelectedCallback(this.onDiceSelected);
		
		if(Farkle.turnDice.farkled) {
			trace('FARKLED! womp womp');
			this.endTurn(true);
		} else {
			if(Farkle.turnDice.score > Farkle.MIN_TURN_SCORE) {
				this.canEndTurn = true;
			}
		}
	};
	
	module.startTurn = function() {
		trace('Game/startTurn');
		var startText = this.players[this.currentPlayer].name + '\'s turn';
		FarkleGUI.startTurn({ 
			subTitleText: startText,
			totalScore: this.players[this.currentPlayer].score
		});
		Game.startRoll();
	};
	
	module.startRoll = function() {
		trace('Game/startRoll, onRollClicked = ', Game.onRollClicked);
		FarkleGUI.startRoll(Game.onRollClicked);
	};
	
	module.onDiceSelected = function(dice) {
		trace('Game/onDiceSelected, dice = ', dice);
		var scores = Farkle.bankScoringDice(dice);
		trace('\t...scores = ' + scores);
		var score = 0;
		PWG.Utils.each(
			scores,
			function(score) {
				score += score
			},
			this
		);
		FarkleGUI.updateTurnScore(score);
		Game.startRoll();
	};
	
	module.switchPlayer = function() {
		if(this.currentPlayer < (this.players.length - 1)) {
			this.currentPlayer++;
		} else {
			this.currentPlayer = 0;
			this.totalRounds++;
		}
		trace('----- start of ' + this.players[this.currentPlayer].name + '\'s turn');
		this.startTurn();
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