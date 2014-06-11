var TIME_PER_TURN = 52;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;
var TIME_TO_MANUFACTOR = 5;

var buildingCosts =
{
	factory: 100000,
	showroom: 50000
}

var sharedListeners =
{
	// game time updated
	gameTimeUpdated: 
	{
		event: PWG.Events.GAME_TIME_UPDATED,
		handler: function(event) {
			PhaserGame.turnTime = event.value;
			var text = (event.value >= 10) ? event.value : '0' + event.value;
			// trace('turn time = ' + event.value);
			this.views['timer-text'].callMethod('setText', [text]);

		}
	},
	// turn ended
	turnEnded: 
	{
		event: PWG.Events.TURN_ENDED,
		handler: function(event) {
			PWG.PhaserTime.removeTimer('turnTime');
			// trace('turn ended');
			this.views['timer-text'].callMethod('setText', [TIME_PER_TURN]);
			// this.views['start-state-buttons'].children['pause-button'].hide();
		}
	}
};


var gameLogic = 
{
	global: 
	{
		listeners: 
		[
		// change state
		{
			event: PWG.Events.CHANGE_STATE,
			handler: function(event) 
			{
				PWG.StateManager.changeState(event.value);
			}
		},
		// start
		{
			event: PWG.Events.START_TURN,
			handler: function(event) {
				PhaserGame.turnTimer.start();
				this.views['start-state-buttons'].children['pause-button'].show();
			}
		},
		// // pause
		// {
		// 	event: PWG.Events.PAUSE_GAME,
		// 	handler: function(event) {
		// 		PhaserGame.turnTimer.pause();
		// 		this.views['start-state-buttons'].children['pause-button'].hide();
		// 		this.views['start-state-buttons'].children['resume-button'].show();
		// 	}
		// },
		// // resume
		// {
		// 	event: PWG.Events.RESUME_GAME,
		// 	handler: function(event) {
		// 		PhaserGame.turnTimer.resume();
		// 		this.views['start-state-buttons'].children['resume-button'].hide();
		// 		this.views['start-state-buttons'].children['pause-button'].show();
		// 	}
		// }
		],
		methods: 
		{
			update: function() 
			{

			},
			startTurn: function() 
			{
				// trace('START TURN');
				PhaserGame.turnActive = true;
				PhaserGame.timePerTurn = TIME_PER_TURN;
				PhaserGame.turnTimer = new PWG.PhaserTime.Controller('turnTime');
				PhaserGame.turnTimer.loop(TURN_TIME_INTERVAL, function() 
				{
						// trace('\ttimePerTurn = ' + PhaserGame.timePerTurn + ', views = ', this.views);
						PhaserGame.timePerTurn--;
						if(PhaserGame.timePerTurn <= 0) 
						{
							PWG.EventCenter.trigger({ type: PWG.Events.TURN_ENDED });
						} 
						else 
						{
							BuildingManager.update();
							PWG.EventCenter.trigger({ type: PWG.Events.GAME_TIME_UPDATED, value: PhaserGame.timePerTurn });
						}
					},
					this
				);
				// PhaserGame.turnTimer.start();
			},
			addOverlayMenuItems: function(type, collection) {
				PhaserGame.currentPartType = type;
				var partsData = gameData.parts[type];
				// trace('this['+this.name+']/addOverlayMenuItems, type = ' + type + '\tparts data = ', partsData, ', collection = ', collection);

				// remove previously added items since different
				if(collection['overlay-menu']) {
					PWG.PhaserView.removeView('overlay-menu', collection);
				}

				var menuConfig = PWG.Utils.clone(PhaserGame.dynamicViews.partsMenu);
				var itemConfig = PWG.Utils.clone(PhaserGame.dynamicViews.partSelectionIcon);
				var count = 0;
				var itemY = 0;
				var offset = itemConfig.offset;
				var iconH = itemConfig.iconH;
				var size = PhaserGame.newMachine.get('size');

				PWG.Utils.each(
					partsData,
					function(part, p) {
						// trace('\tadding part[' + p + '] info to views');
						var item = PWG.Utils.clone(itemConfig);
						item.name = part.id;
						item.views.icon.img = part.icon;
						item.views.description.text = part.description;
						item.views.cost.text = '$' + part.cost[size];
						item.views.invisButton.partIdx = p;

						itemY = (iconH * count) + offset;
						PWG.Utils.each(
							item.views,
							function(view) {
								view.y += itemY;
							},
							this
						);

						menuConfig.views['items'].views[p] = item;
						count++;
					},
					this
				);
				PWG.PhaserView.addView(menuConfig, collection);
				// trace('\tcreated overlay-menu from: ', menuConfig, '\tcollection now = ', collection);
			}
		},
		views: 
		{
			pauseButton: 
			{
				callback: function() 
				{
					PWG.EventCenter.trigger({ type: PWG.Events.PAUSE_GAME });
				}
			},
			resumeButton: 
			{
				callback: function() 
				{
					PWG.EventCenter.trigger({ type: PWG.Events.RESUME_GAME });
				}
			}
		}
	},
	dynamicViews: 
	{
		notification: {
			closeButton: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_NOTIFICATION });
				}
			}
		},
		timerText: {
			
		},
		partsMenu: {
			closeButton: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_PARTS_LIST });
				}
			}
		},
		partSelectionIcon: {
			invisButton: {
				input: {
					inputDown: function(event) {
						PWG.EventCenter.trigger({ type: PWG.Events.ADD_PART, value: this.controller.config.partIdx });
					}
				}
			}
		}
	},
	states: 
	{
		start: 
		{
			views: {
				startButton: {
					callback: function() {
						if(PhaserGame.isFirstPlay) {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'manual' });
							PhaserGame.isFirstPlay = false;
						} else {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'play' });
						}
					}
				}
			}
		},
		play: 
		{
			listeners: 
			[
				PWG.Utils.clone(sharedListeners.gameTimeUpdated),
				PWG.Utils.clone(sharedListeners.turnEnded)
			],
			create: function() 
			{
				if(!PhaserGame.turnActive) {
					PhaserGame.startTurn();
				}
			},
			shutdown: function() 
			{
				// PWG.PhaserTime.removeTimer('turnTime');
			},
			views: 
			{
				buttons: 
				{
					plusButton: 
					{
						input: 
						{
							inputUp: function() 
							{
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_IN });
							}
						}
					},
					minusButton: 
					{
						input: 
						{
							inputUp: function() 
							{
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_OUT });
							}
						}
					},
					usDetailButton: 
					{
						callback: function() 
						{
							// PWG.EventCenter.trigger({ type: PWG.Events.START_TURN });
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'usDetail' });
						}
					},
					equipmentButton: 
					{
						callback: function() 
						{
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentList' });
						}
					}
				},
				icons: 
				{
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
							// trace('config on drag stop, view x/y = ' + view.x + '/' + view.y + ', max = ' + (PWG.Stage.unit * 10.5) + ', min = ' + (PWG.Stage.unit * 3.5));
							if(view.y < (PWG.Stage.unit * 3.5)) {
								view.y = PWG.Stage.unit * 3.5;
							} else if(view.y > (PWG.Stage.unit * 10.5)) {
								view.y = PWG.Stage.unit * 9.4;
							}
							// trace('view x/y is now: ' + view.x + '/' + view.y);
						}
					}
				}
			}
		},
		usDetail: 
		{
			listeners: 
			[
			PWG.Utils.clone(sharedListeners.gameTimeUpdated),
			PWG.Utils.clone(sharedListeners.turnEnded)
			],
			create: function() 
			{
				if(!PhaserGame.turnActive) {
					PhaserGame.startTurn();
				}
			},
			shutdown: function() 
			{
				PWG.PhaserTime.removeTimer('turnTime');
			},
			views: 
			{
				buttons: 
				{
					plusButton: 
					{
						input: 
						{
							inputUp: function() 
							{
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_IN });
							}
						}
					},
					minusButton: 
					{
						input: 
						{
							inputUp: function() 
							{
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_OUT });
							}
						}
					},
					usDetailButton: 
					{
						callback: function() 
						{
							// PWG.EventCenter.trigger({ type: PWG.Events.START_TURN });
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'usDetail' });
						}
					},
					equipmentButton: 
					{
						callback: function() 
						{
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentList' });
						}
					}
				},
				icons: 
				{
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
							// trace('config on drag stop, view x/y = ' + view.x + '/' + view.y + ', max = ' + (PWG.Stage.unit * 10.5) + ', min = ' + (PWG.Stage.unit * 3.5));
							if(view.y < (PWG.Stage.unit * 3.5)) {
								view.y = PWG.Stage.unit * 3.5;
							} else if(view.y > (PWG.Stage.unit * 10.5)) {
								view.y = PWG.Stage.unit * 9.4;
							}
							// trace('view x/y is now: ' + view.x + '/' + view.y);
						}
					}
				}
			}
		},
		equipment: 
		{
			listeners: [
			PWG.Utils.clone(sharedListeners.gameTimeUpdated),
			PWG.Utils.clone(sharedListeners.turnEnded),
			// add notification
			{
				event: PWG.Events.OPEN_NOTIFICATION,
				handler: function(event) 
				{
					// trace('add notification event handlers, notification = ', (this.views['notification']));
					var notification = this.views['notification'];
					var notificationView = notification.children['notification-text'].view;

					if(notificationView.text !== event.value) {
						notificationView.setText(event.value);
					}
					notification.show();
				}
			},
			// remove notification
			{
				event: PWG.Events.CLOSE_NOTIFICATION,
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
							// trace('equipment.views.bg.input.inputDown');
							PWG.EventCenter.trigger({ type: PWG.Events.OPEN_NOTIFICATION, value: 'hello notification' });
						}
					}
				},
				buttons: {
					closeButton: {
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'play' });
						}
					}
				},
				icons: {
					tractor: {
						input: {
							inputDown: function() {
								PhaserGame.currentEquipmentType = EquipmentTypes.TRACTOR;
								PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentCreate' });
							}
						}
					},
					skidsteer: {
						input: {
							inputDown: function() {
								PhaserGame.currentEquipmentType = EquipmentTypes.SKIDSTEER;
								PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'skidsteerBuilder' });
							}
						}
					}
				}
			}
		},
		equipmentCreate: 
		{
			listeners: [
			PWG.Utils.clone(sharedListeners.gameTimeUpdated),
			PWG.Utils.clone(sharedListeners.turnEnded),
			{
				event: PWG.Events.ADD_PART,
				handler: function(event) 
				{
					PhaserGame.newMachine.setPart(PhaserGame.currentPartType, event.value);
					// trace('show part, type = ' + event.value + ', part type = ' + this.partsMenuType + ', view collection = ', this.views);
					var frame = gameData.parts[this.partsMenuType][event.value].frame;
					// trace('frame = ' + frame + ', type = ' + this.partsMenuType + ', collection = ', this.views);
					var partView = this.partsMenuType + '-part';
					this.views['state-group'].children['editor-group'].children['editorParts'].children[partView].view.frame = frame;
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_PARTS_LIST });
				}
			},
			{
				event: PWG.Events.SHOW_BUILD_GROUP,
				handler: function(event) 
				{
					// trace('showBuildGroup, size = ' + event.size);
					PhaserGame.newMachine.set('size', event.size);
					// playerData.equipment[PhaserGame.activeMachineId].set('size', event.size);
					this.views['state-group'].children[event.previousGroup].hide();
					this.views['state-group'].children['editor-group'].show();
				}
			},
			{
				event: PWG.Events.OPEN_PARTS_LIST,
				handler: function(event) 
				{
					// trace('open overlay menu handler, value = ' + event.value + ', overlay open = ' + this.partsMenuOpen + ', partsMenuType = ' + this.partsMenuType);
					if(!this.partsMenuOpen) 
					{
						if(this.partsMenuType !== event.value) 
						{
							PhaserGame.addOverlayMenuItems.call(this, event.value, this.views);
						}

						this.views['overlay-menu'].show();
						this.partsMenuType = event.value;
						this.partsMenuOpen = true;
					}
				}
			},
			{
				event: PWG.Events.CLOSE_PARTS_LIST,
				handler: function(event) 
				{
					// trace('close overlay handler, overlay open = ' + this.partsMenuOpen);
					if(this.partsMenuOpen) 
					{
						// trace('\toverlay-menu = ', (this.views['overlay-menu']));
						this.views['overlay-menu'].hide();
						this.partsMenuOpen = false;
					}
				}
			}
			],
			create: function() 
			{
				// trace('create, views = ', this.views);
				switch(PhaserGame.currentEquipmentAction) 
				{
					case EquipmentActions.CREATE:
					this.views['state-group'].children['create-group'].show();
					var machine = new Machine({ type: PhaserGame.currentEquipmentType });
					// playerData.equipment[machine.id] = machine;
					// PhaserGame.activeMachineId = machine.id;

					PhaserGame.newMachine = new Machine({
						type: PhaserGame.currentEquipmentType
					});
					break;

					case EquipmentActions.EDIT:
					break;

					case EquipmentActions.DELETE:
					break;

					default: 
					// trace('error: unknown equipment action: ' + PhaserGame.currentEquipmentAction);
					break;
				}
				PhaserGame.currentEquipmentAction = '';
			},
			shutdown: function() 
			{
				this.partsMenuType = '';
				this.partsMenuOpen = false;
			},
			views: 
			{
				editor: 
				{
					buttons: 
					{
						closeButton: 
						{
							callback: function() 
							{
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentList' });
							}
						},
						saveButton: 
						{
							callback: function() 
							{
								PhaserGame.newMachine.save();
								PhaserGame.newMachine = null;
								// playerData.equipment[PhaserGame.activeMachineId].save();
								// PhaserGame.activeMachineId = -1;
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentList' });
							}
						}
					},
					icons: 
					{
						wheelIcon: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('wheel icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_PARTS_LIST, value: PartTypes.WHEELS });
								}
							}
						},
						engineIcon: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('engine icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_PARTS_LIST, value: PartTypes.ENGINE });
								}
							}
						},
						transmissionIcon: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('transmission icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_PARTS_LIST, value: PartTypes.TRANSMISSION });
								}
							}
						},
						cabIcon: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('cab icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_PARTS_LIST, value: PartTypes.CAB });
								}
							}
						},
						headlightsIcon: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('headlights icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_PARTS_LIST, value: PartTypes.HEADLIGHTS });
								}
							}
						}
					}
				},
				machineSize: 
				{
					icons: 
					{
						createBasic: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('createBasic icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.STANDARD, previousGroup: 'create-group' });
								}
							}
						},
						createMedium: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('createMedium icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.MEDIUM, previousGroup: 'create-group' });
								}
							}
						},
						createHeavy: 
						{
							input: 
							{
								inputDown: function() 
								{
									// trace('createHeavy icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.HEAVY, previousGroup: 'create-group' });
								}
							}
						}
					}
				}
			}
		}
	}
};