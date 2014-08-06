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

		Farkle.init(module.onRolled, this);
		FarkleGUI.init(players);

		PWG.Utils.each(
			players,
			function(player) {
				module.players.push(new Player(player));
			},
			this
		);
		// trace('\tplayers now = ', module.players);
		module.currentPlayer = 0;
		module.totalRounds = 1;
		module.startTurn();
		// trace('----- ' + module.players[module.currentPlayer].name + '\'s turn');
		// Farkle.startTurn();
	};

	module.startTurn = function() {
		trace('Game/startTurn');
		FarkleGUI.startTurn(module.players[module.currentPlayer]);
		Farkle.startTurn();
		Game.startRoll();
	};
	
	module.startRoll = function() {
		trace('Game/startRoll');
		FarkleGUI.startRoll(Game.onRollClicked);
	};
	
	module.onRollClicked = function() {
		trace('Game/onRollClicked');
		Farkle.startRoll();
	};
	
	module.onRolled = function() {
		trace('GAME/onRolled');
		FarkleGUI.displayRoll(Farkle.turnDice.activeRoll);
		FarkleGUI.setSelectedCallback(module.onDiceSelected);
		
		if(Farkle.turnDice.farkled) {
			trace('FARKLED! womp womp');
			// module.endTurn(true);
			module.showFarkled();
		}
	};
	
	module.onDiceSelected = function(dice) {
		trace('Game/onDiceSelected, dice = ', dice);
		var scores = [];
		scores = Farkle.bankScoringDice(dice);
		trace('\t...scores = ' + scores + ', is array = ' + (scores instanceof Array));
		var score = 0;
		if(scores instanceof Array) {
			trace('\tlength = ' + scores.length);
			PWG.Utils.each(
				scores,
				function(value, idx) {
					trace('\tvalue['+idx+'] = ' + value);
					score += value;
				},
				this
			);
		} else {
			score = scores;
		}
		trace('---- score now = ' + score);
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
				trace('TRIPLE FARKLE! setting score back: ' + Farkle.TRIPLE_FARKLE);
				module.players[module.currentPlayer].score -= Farkle.TRIPLE_FARKLE;
				module.players[module.currentPlayer].currentFarkles = 0;
			}
		} else {
			module.players[module.currentPlayer].currentFarkles = 0;
			module.players[module.currentPlayer].score += Farkle.turnDice.totalScore;
		}

		FarkleGUI.endTurn(module.players[module.currentPlayer]);

		trace('----- end of ' + module.players[module.currentPlayer].name + '\'s turn with a score of: ' + module.players[module.currentPlayer].score);

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
		trace('----- start of ' + module.players[module.currentPlayer].name + '\'s turn');
		module.startTurn();
	};
	
	module.gameOver = function() {
		var topScorer = -1;
		var prevScore = 0;
		
		FarkleGUI.gameOver(Game.startGame);
		
		trace('Game Over. Scores: ');
		PWG.Utils.each(
			module.players,
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

		trace('after ' + module.totalRounds + ' rounds the winner is: ');
		trace(module.players[topScorer].printDetails());
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