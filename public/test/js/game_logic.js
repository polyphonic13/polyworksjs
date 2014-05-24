var TIME_PER_TURN = 10;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;
var gameLogic = {
	states: {
		global: 
		{
			listeners:[
			// add notification
			{
				event: Polyworks.Events.ADD_NOTIFICATION,
				handler: function(event) 
				{
					this.views['notification'] = new Polyworks.PhaserView.addView(PhaserGame.config.globalViews['notification']);
					this.views['notification'].set({
						text: event.value
					});
				}
			},
			// remove notification
			{
				event: Polyworks.Events.REMOVE_NOTIFICATION,
				handler: function(event) 
				{
					Polyworks.PhaserView.removeView('notification', this.views);
				}
			}
			]
		},
		start: 
		{
			listeners: [
			// hide notification
			{
				event: Polyworks.Events.HIDE_NOTIFICATION,
				handler: function(event) 
				{
					this.views['notification'].hide();
				}
			},
			// show notification
			{
				event: Polyworks.Events.SHOW_NOTIFICATION,
				handler: function(event) 
				{
					this.views['notification'].show();
				}
			}
			]
		},
		play: 
		{
			listeners: [
			// pause
			{
				event: Polyworks.Events.PAUSE_GAME,
				handler: function(event) {
					this.turnTimer.pause();
					this.views['pause-button'].hide();
					this.views['resume-button'].show();
				}
			},
			// resume
			{
				event: Polyworks.Events.RESUME_GAME,
				handler: function(event) {
					this.turnTimer.resume();
					this.views['resume-button'].hide();
					this.views['pause-button'].show();
				}
			},
			// turn ended
			{
				event: Polyworks.Events.TURN_ENDED,
				handler: function(event) {
					Polyworks.PhaserTime.removeTimer('turnTime');
					this.views['turn-time'].callMethod('setText', ['Turn ended']);
					this.views['pause-button'].hide();
				}
			}
			],
			create: function() 
			{
				this.timePerTurn = TIME_PER_TURN;
				this.turnTimer = new Polyworks.PhaserTime.Controller('turnTime');
				this.turnTimer.loop(TURN_TIME_INTERVAL, function() {
						trace('\ttimePerTurn = ' + this.timePerTurn);
						this.timePerTurn--;
						var text = 'Turn time: ' + this.timePerTurn;
						this.views['turn-time'].callMethod('setText', [text]);
						if(this.timePerTurn <= 0) {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.TURN_ENDED });
						}
					},
					this
				);
				// this.turnTimer.start();
			},
			shutdown: function() 
			{
				Polyworks.PhaserTime.removeTimer('turnTime');
			},
			views: 
			{
				icons: 
				{
					input: 
					{
						inputDown: function() {
							// trace('factory-icon/inputDown, this.selected = ' + this.selected + ', PhaserGame.selectedIcon = ' + PhaserGame.selectedIcon + ', this name = ' + this.controller.name);
							if(this.selected) {
								PhaserGame.selectedIcon = '';
								this.selected = false;
							} else {
								PhaserGame.selectedIcon = this.controller.name;
								this.selected = true;
								var input = this.controller.view.input;
								var attrs = this.controller.config.attrs;
								input.enableDrag();
								// input.enableSnap(attrs.width, attrs.height, false, true);
								input.enableSnap(32, 32, false, true);
							}
						},
						onDragStop: function() {
							var view = this.controller.view;
							trace('config on drag stop, view x/y = ' + view.x + '/' + view.y + ', max = ' + (Polyworks.Stage.unit * 10.5) + ', min = ' + (Polyworks.Stage.unit * 3.5));
							if(view.y < (Polyworks.Stage.unit * 3.5)) {
								view.y = Polyworks.Stage.unit * 3.5;
							} else if(view.y > (Polyworks.Stage.unit * 10.5)) {
								view.y = Polyworks.Stage.unit * 9.4;
							}
							trace('view x/y is now: ' + view.x + '/' + view.y);
						}
					}
				}
			}
		},
		tractors: 
		{
			listeners: [
			// add notification
			{
				event: Polyworks.Events.ADD_NOTIFICATION,
				handler: function(event) 
				{
					trace('add notification event handlers');
					this.views['notification'] = new Polyworks.PhaserView.build(PhaserGame.config.globalViews['notification']);
					this.views['notification'].set({
						text: event.value
					});
				}
			},
			// remove notification
			{
				event: Polyworks.Events.REMOVE_NOTIFICATION,
				handler: function(event) 
				{
					Polyworks.PhaserView.removeView('notification', this.views);
				}
			}
			],
			views: 
			{
				bg: 
				{
					input:
					{
						inputDown: function() {
							trace('tractors.views.bg.input.inputDown');
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.ADD_NOTIFICATION, value: 'hello notification' });
						}
					}
				}
			}
		}
	}
};