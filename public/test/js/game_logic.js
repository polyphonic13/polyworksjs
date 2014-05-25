var TIME_PER_TURN = 20;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;

var gameLogic = {
	states: {
		start: {
			listeners: [
			// // hide notification
			// {
			// 	event: Polyworks.Events.HIDE_NOTIFICATION,
			// 	handler: function(event) {
			// 		trace('hide notification handler, this = ', this);
			// 		this.views['notification'].hide();
			// 	}
			// },
			// // show notification
			// {
			// 	event: Polyworks.Events.SHOW_NOTIFICATION,
			// 	handler: function(event) 
			// 	{
			// 		trace('show notification, this.views = ', this);
			// 		this.views['notification'].show();
			// 	}
			// }
			],
			views: {
				startButton: {
					callback: function() {
						if(PhaserGame.firstPlay) {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'manual' });
							PhaserGame.firstPlay = false;
						} else {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						}
					}
				}
			}
		},
		play: {
			listeners: [
			// start
			{
				event: Polyworks.Events.START_TURN,
				handler: function(event) {
					this.turnTimer.start();
					this.views['start-state-buttons'].children['pause-button'].show();
				}
			},
			// pause
			{
				event: Polyworks.Events.PAUSE_GAME,
				handler: function(event) {
					this.turnTimer.pause();
					this.views['start-state-buttons'].children['pause-button'].hide();
					this.views['start-state-buttons'].children['resume-button'].show();
				}
			},
			// resume
			{
				event: Polyworks.Events.RESUME_GAME,
				handler: function(event) {
					this.turnTimer.resume();
					this.views['start-state-buttons'].children['resume-button'].hide();
					this.views['start-state-buttons'].children['pause-button'].show();
				}
			},
			// turn ended
			{
				event: Polyworks.Events.TURN_ENDED,
				handler: function(event) {
					Polyworks.PhaserTime.removeTimer('turnTime');
					this.views['start-state-text'].children['turn-time'].callMethod('setText', ['Turn ended']);
					this.views['start-state-buttons'].children['pause-button'].hide();
				}
			}
			],
			create: function() {
				this.timePerTurn = TIME_PER_TURN;
				this.turnTimer = new Polyworks.PhaserTime.Controller('turnTime');
				this.turnTimer.loop(TURN_TIME_INTERVAL, function() {
						// trace('\ttimePerTurn = ' + this.timePerTurn + ', views = ', this.views);
						this.timePerTurn--;
						var text = 'Turn time: ' + this.timePerTurn;
						this.views['start-state-text'].children['turn-time'].callMethod('setText', [text]);
						if(this.timePerTurn <= 0) {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.TURN_ENDED });
						}
					},
					this
				);
				// this.turnTimer.start();
			},
			shutdown: function() {
				Polyworks.PhaserTime.removeTimer('turnTime');
			},
			views: {
				buttonsGroup: {
					plusButton: {
						input: {
							inputUp: function() {
								// trace('plus pressed');
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.ZOOM_IN });
							}
						}
					},
					minusButton: {
						input: {
							inputUp: function() {
								// trace('plus pressed');
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.ZOOM_OUT });
							}
						}
					},
					pauseButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.PAUSE_GAME });
						}
					},
					resumeButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.RESUME_GAME });
						}
					},
					startBuildingButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.START_TURN });
						}
					},
					equipmentButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'equipment' });
						}
					}
				},
				iconsGroup: {
					input: {
						inputDown: function() {
							// trace('factory-icon/inputDown, this.selected = ' + this.selected + ', PhaserGame.selectedIcon = ' + PhaserGame.selectedIcon + ', this name = ' + this.controller.id);
							if(this.selected) {
								PhaserGame.selectedIcon = '';
								this.selected = false;
							} else {
								PhaserGame.selectedIcon = this.controller.id;
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
							// trace('config on drag stop, view x/y = ' + view.x + '/' + view.y + ', max = ' + (Polyworks.Stage.unit * 10.5) + ', min = ' + (Polyworks.Stage.unit * 3.5));
							if(view.y < (Polyworks.Stage.unit * 3.5)) {
								view.y = Polyworks.Stage.unit * 3.5;
							} else if(view.y > (Polyworks.Stage.unit * 10.5)) {
								view.y = Polyworks.Stage.unit * 9.4;
							}
							// trace('view x/y is now: ' + view.x + '/' + view.y);
						}
					}
				}
			}
		},
		equipment: {
			listeners: [
			// add notification
			{
				event: Polyworks.Events.UPDATE_AND_SHOW_NOTIFICATION,
				handler: function(event) 
				{
					trace('add notification event handlers, notification = ', (this.views['notification']));
					this.views['notification'].children['notification-text'].view.setText(event.value);
					this.views['notification'].show();
				}
			},
			// remove notification
			{
				event: Polyworks.Events.HIDE_NOTIFICATION,
				handler: function(event) 
				{
					this.views['notification'].hide();
				}
			}
			],
			views: {
				bg: {
					input:{
						inputDown: function() {
							trace('equipment.views.bg.input.inputDown');
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.UPDATE_AND_SHOW_NOTIFICATION, value: 'hello notification' });
						}
					}
				},
				buttonsGroup: {
					closeButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						}
					}
				}
			}
		}
	}
};