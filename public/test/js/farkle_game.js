var Game = function() {
	var module = {};

	function Player(config) {
		// trace('Player/constructor, config = ', config);
		PWG.Utils.extend(this, config);
		this.score = 0;
		this.currentFarkles = 0;
	};
	
	Player.prototype.reset = function() {
		this.score = 0;
		this.currentFarkles = 0;
	};
	
	Player.prototype.printDetails = function() {
		PWG.Utils.each(
			this,
			function(value, key) {
				if(this.hasOwnProperty(key)) {
					// trace('\t' + key + ' = ' + value);
				}
			},
			this
		);
	};
	
	module.Player = Player;

	module.players = [];
	module.currentPlayer = -1;
	module.totalRounds = 0;

	module.init = function() {
		module.players = [];
		Farkle.init(module.onRolled, this);
		FarkleGUI.init(module.startGame);

		PWG.Utils.each(
			players,
			function(player) {
				module.players.push(new Player(player));
			},
			this
		);

	};
	
	module.startGame = function() {
		// trace('Game/startGame');

		FarkleGUI.startGame(module.players);
		// trace('\tplayers now = ', module.players);
		module.currentPlayer = 0;
		module.totalRounds = 1;
		module.startTurn();
		// trace('----- ' + module.players[module.currentPlayer].name + '\'s turn');
		// Farkle.startTurn();
	};

	module.startTurn = function() {
		// trace('Game/startTurn');
		FarkleGUI.startTurn(module.players[module.currentPlayer]);
		Farkle.startTurn();
		Game.startRoll();
	};
	
	module.startRoll = function() {
		// trace('Game/startRoll');
		FarkleGUI.startRoll(Game.onRollClicked);
	};
	
	module.onRollClicked = function() {
		// trace('Game/onRollClicked');
		Farkle.startRoll();
	};
	
	module.onRolled = function() {
		// trace('GAME/onRolled');
		FarkleGUI.displayRoll(Farkle.turnDice.activeRoll);
		FarkleGUI.setSelectedCallback(module.onDiceSelected);
		
		if(Farkle.turnDice.farkled) {
			// trace('FARKLED! womp womp');
			// module.endTurn(true);
			module.showFarkled();
		} else if(Farkle.turnDice.hotDice) {
			FarkleGUI.showHotDice();
		}
	};
	
	module.onDiceSelected = function(dice) {
		// trace('Game/onDiceSelected, dice = ', dice);
		var scores = [];
		scores = Farkle.bankScoringDice(dice);
		// trace('\t...scores = ' + scores + ', is array = ' + (scores instanceof Array));
		var score = 0;
		if(Farkle.turnDice.hotDice) {
			FarkleGUI.showHotDice();
		}
		if(scores instanceof Array) {
			// trace('\tlength = ' + scores.length);
			PWG.Utils.each(
				scores,
				function(value, idx) {
					// trace('\tvalue['+idx+'] = ' + value);
					score += value;
				},
				this
			);
		} else {
			score = scores;
		}
		// trace('---- score now = ' + score);
		FarkleGUI.updateText('turnScore', score);
		if(score >= Farkle.MIN_TURN_SCORE) {
			Game.farkled = false;
			FarkleGUI.showEndTurnButton(Game.endTurn);
		}
		Game.startRoll();
	};
	
	module.showFarkled = function() {
		Game.farkled = true;
		module.players[module.currentPlayer].currentFarkles++;
		FarkleGUI.farkled(Game.endTurn, module.players[module.currentPlayer]);
	};

	module.endTurn = function() {
		if(Game.farkled) {
			if(module.players[module.currentPlayer].currentFarkles >= 3) {
				// trace('TRIPLE FARKLE! setting score back: ' + Farkle.TRIPLE_FARKLE);
				module.players[module.currentPlayer].score -= Farkle.TRIPLE_FARKLE;
				module.players[module.currentPlayer].currentFarkles = 0;
			}
		} else {
			module.players[module.currentPlayer].currentFarkles = 0;
			module.players[module.currentPlayer].score += Farkle.turnDice.totalScore;
		}

		FarkleGUI.endTurn(module.players[module.currentPlayer]);

		// trace('----- end of ' + module.players[module.currentPlayer].name + '\'s turn with a score of: ' + module.players[module.currentPlayer].score);

		if(module.players[module.currentPlayer].score >= Farkle.WINNING_SCORE) {
			module.gameOver();
		} else {
			module.switchPlayer();
		}
	};
	
	module.switchPlayer = function() {
		if(module.currentPlayer < (module.players.length - 1)) {
			module.currentPlayer++;
		} else {
			module.currentPlayer = 0;
			module.totalRounds++;
		}
		// trace('----- start of ' + module.players[module.currentPlayer].name + '\'s turn');
		module.startTurn();
	};
	
	module.gameOver = function() {
		var topScorer = -1;
		var prevScore = 0;
		
		FarkleGUI.gameOver(Game.restart, module.players[module.currentPlayer]);

	};

	module.restart = function() {
		PWG.Utils.each(
			module.players,
			function(player) {
				player.reset();
			},
			this
		);
		FarkleGUI.cleanUp();
		module.startGame();
	};
	
	return module;
}();

var players = [
	{
		name: 'player1',
		age: 39,
		gender: 'male'
	},
	{
		name: 'player2',
		age: 30,
		gender: 'female'
	}//,
	// {
	// 	name: 'player 3',
	// 	age: 30,
	// 	gender: 'female'
	// }
];

Game.init();