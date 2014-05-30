var TIME_PER_TURN = 20;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;

var gameLogic = {
	methods: {
		addOverlayMenuItems: function(type, collection) {
			PhaserGame.currentPartType = type;
			var partsData = gameData.parts[type];
			trace('this['+this.name+']/addOverlayMenuItems, type = ' + type + '\tparts data = ', partsData, ', collection = ', collection);

			// remove previously added items since different
			if(collection['overlay-menu']) {
				PWG.PhaserView.removeView('overlay-menu', collection);
			}

			var menuConfig = PWG.Utils.clone(PhaserGame.sharedViews.overlayMenu);
			var itemConfig = PWG.Utils.clone(PhaserGame.sharedViews.overlayMenuItem);
			var count = 0;
			var itemY = 0;
			var offset = itemConfig.offset;
			var totalHeight = itemConfig.totalHeight;
			var size = PhaserGame.newMachine.get('size');

			PWG.Utils.each(
				partsData,
				function(part, p) {
					trace('\tadding part[' + p + '] info to views');
					var item = PWG.Utils.clone(itemConfig);
					item.name = part.id;
					item.views.icon.img = part.icon;
					item.views.description.text = part.description;
					item.views.cost.text = '$' + part.cost[size];
					item.views.invisButton.partIdx = p;

					itemY = (totalHeight * count) + offset;
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
			trace('\tcreated overlay-menu from: ', menuConfig, '\tcollection now = ', collection);
		}
	},
	sharedViews: {
		notification: {
			closeButton: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_NOTIFICATION });
				}
			}
		},
		overlayMenu: {
			closeButton: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
				}
			}
		},
		overlayMenuItem: {
			invisButton: {
				input: {
					inputDown: function(event) {
						PWG.EventCenter.trigger({ type: PWG.Events.ADD_PART, value: this.controller.config.partIdx });
					}
				}
			}
		}
	},
	states: {
		start: {
			views: {
				startButton: {
					callback: function() {
						if(PhaserGame.firstPlay) {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'manual' });
							PhaserGame.firstPlay = false;
						} else {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'play' });
						}
					}
				}
			}
		},
		play: {
			listeners: [
			// start
			{
				event: PWG.Events.START_TURN,
				handler: function(event) {
					this.turnTimer.start();
					this.views['start-state-buttons'].children['pause-button'].show();
				}
			},
			// pause
			{
				event: PWG.Events.PAUSE_GAME,
				handler: function(event) {
					this.turnTimer.pause();
					this.views['start-state-buttons'].children['pause-button'].hide();
					this.views['start-state-buttons'].children['resume-button'].show();
				}
			},
			// resume
			{
				event: PWG.Events.RESUME_GAME,
				handler: function(event) {
					this.turnTimer.resume();
					this.views['start-state-buttons'].children['resume-button'].hide();
					this.views['start-state-buttons'].children['pause-button'].show();
				}
			},
			// game time updated
			{
				event: PWG.Events.GAME_TIME_UPDATED,
				handler: function(event) {
					var text = 'Turn time: ' + event.value;
					this.views['start-state-text'].children['turn-time'].callMethod('setText', [text]);

				}
			},
			// turn ended
			{
				event: PWG.Events.TURN_ENDED,
				handler: function(event) {
					PWG.PhaserTime.removeTimer('turnTime');
					this.views['start-state-text'].children['turn-time'].callMethod('setText', ['Turn ended']);
					this.views['start-state-buttons'].children['pause-button'].hide();
				}
			}
			],
			create: function() {
				this.timePerTurn = TIME_PER_TURN;
				this.turnTimer = new PWG.PhaserTime.Controller('turnTime');
				this.turnTimer.loop(TURN_TIME_INTERVAL, function() {
						// trace('\ttimePerTurn = ' + this.timePerTurn + ', views = ', this.views);
						this.timePerTurn--;
						if(this.timePerTurn <= 0) {
							PWG.EventCenter.trigger({ type: PWG.Events.TURN_ENDED });
						} else {
							PWG.EventCenter.trigger({ type: PWG.Events.GAME_TIME_UPDATED, value: this.timePerTurn });
						}
					},
					this
				);
				// this.turnTimer.start();
			},
			shutdown: function() {
				PWG.PhaserTime.removeTimer('turnTime');
			},
			views: {
				buttons: {
					plusButton: {
						input: {
							inputUp: function() {
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_IN });
							}
						}
					},
					minusButton: {
						input: {
							inputUp: function() {
								// trace('plus pressed');
								PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_OUT });
							}
						}
					},
					pauseButton: {
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.PAUSE_GAME });
						}
					},
					resumeButton: {
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.RESUME_GAME });
						}
					},
					startBuildingButton: {
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.START_TURN });
						}
					},
					equipmentButton: {
						callback: function() {
							PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipment' });
						}
					}
				},
				icons: {
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
		equipment: {
			listeners: [
			// add notification
			{
				event: PWG.Events.OPEN_NOTIFICATION,
				handler: function(event) 
				{
					trace('add notification event handlers, notification = ', (this.views['notification']));
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
							trace('equipment.views.bg.input.inputDown');
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
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipmentEditor' });
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
		equipmentEditor: {
			listeners: [
			{
				event: PWG.Events.ADD_PART,
				handler: function(event) {
					PhaserGame.newMachine.setPart(PhaserGame.currentPartType, event.value);
					// trace('show part, type = ' + event.value + ', part type = ' + this.overlayMenuType + ', view collection = ', this.views);
					var frame = gameData.parts[this.overlayMenuType][event.value].frame;
					trace('frame = ' + frame + ', type = ' + this.overlayMenuType + ', collection = ', this.views);
					var partView = this.overlayMenuType + '-part';
					this.views['editor-group'].children['editor-parts'].children[partView].view.frame = frame;
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
				}
			},
			{
				event: PWG.Events.SHOW_BUILD_GROUP,
				handler: function(event) {
					trace('showBuildGroup, size = ' + event.size);
					PhaserGame.newMachine.set('size', event.size);
					// playerData.equipment[PhaserGame.activeMachineId].set('size', event.size);
					this.views[event.previousGroup].hide();
					this.views['editor-group'].show();
				}
			},
			{
				event: PWG.Events.OPEN_OVERLAY_MENU,
				handler: function(event) {
					trace('open overlay menu handler, value = ' + event.value + ', overlay open = ' + this.overlayMenuOpen + ', overlayMenuType = ' + this.overlayMenuType);
					if(!this.overlayMenuOpen) {
						if(this.overlayMenuType !== event.value) {
							PhaserGame.addOverlayMenuItems.call(this, event.value, this.views);
						}

						this.views['overlay-menu'].show();
						this.overlayMenuType = event.value;
						this.overlayMenuOpen = true;
					}
				}
			},
			{
				event: PWG.Events.CLOSE_OVERLAY_MENU,
				handler: function(event) {
					trace('close overlay handler, overlay open = ' + this.overlayMenuOpen);
					if(this.overlayMenuOpen) {
						trace('\toverlay-menu = ', (this.views['overlay-menu']));
						this.views['overlay-menu'].hide();
						this.overlayMenuOpen = false;
					}
				}
			}
			],
			create: function() {
				trace('create, views = ', this.views);
				switch(PhaserGame.currentEquipmentAction) {
					case EquipmentActions.CREATE:
					this.views['create-group'].show();
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
					trace('error: unknown equipment action: ' + PhaserGame.currentEquipmentAction);
					break;
				}
				PhaserGame.currentEquipmentAction = '';
			},
			shutdown: function() {
				this.overlayMenuType = '';
				this.overlayMenuOpen = false;
			},
			views: {
				editor: {
					buttons: {
						closeButton: {
							callback: function() {
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipment' });
							}
						},
						saveButton: {
							callback: function() {
								PhaserGame.newMachine.save();
								PhaserGame.newMachine = null;
								// playerData.equipment[PhaserGame.activeMachineId].save();
								// PhaserGame.activeMachineId = -1;
								PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_STATE, value: 'equipment' });
							}
						}
					},
					icons: {
						wheelIcon: {
							input: {
								inputDown: function() {
									trace('wheel icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.WHEELS });
								}
							}
						},
						engineIcon: {
							input: {
								inputDown: function() {
									trace('engine icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.ENGINE });
								}
							}
						},
						transmissionIcon: {
							input: {
								inputDown: function() {
									trace('transmission icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.TRANSMISSION });
								}
							}
						},
						cabIcon: {
							input: {
								inputDown: function() {
									trace('cab icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.CAB });
								}
							}
						},
						headlightsIcon: {
							input: {
								inputDown: function() {
									trace('headlights icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.HEADLIGHTS });
								}
							}
						}
					}
				},
				machineSize: {
					icons: {
						createBasic: {
							input: {
								inputDown: function() {
									// trace('createBasic icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.STANDARD, previousGroup: 'create-group' });
								}
							}
						},
						createMedium: {
							input: {
								inputDown: function() {
									// trace('createMedium icon input down');
									PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.MEDIUM, previousGroup: 'create-group' });
								}
							}
						},
						createHeavy: {
							input: {
								inputDown: function() {
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