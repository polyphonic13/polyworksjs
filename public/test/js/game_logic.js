var TIME_PER_TURN = 20;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;

var gameLogic = {
	methods: {
		addOverlayMenuItems: function(type, collection) {
			PhaserGame.currentPartType = type;
			var partsData = gameData.market[type];
			// var overlayMenu = collection['overlay-menu'];
			trace('this['+this.name+']/addOverlayMenuItems, type = ' + type + '\tparts data = ', partsData, ', collection = ', collection);

			// remove previously added items since different
			if(collection['overlay-menu']) {
				// Polyworks.PhaserView.removeView('items-group', collection['overlay-menu'].children);
				Polyworks.PhaserView.removeView('overlay-menu', collection);
			}

			var menuConfig = Polyworks.Utils.clone(PhaserGame.sharedViews.overlayMenu);
			var itemConfig = Polyworks.Utils.clone(PhaserGame.sharedViews.overlayMenuItem);
			var count = 0;
			var itemY = 0;
			var offset = itemConfig.offset;
			var totalHeight = itemConfig.totalHeight;
			var size = PhaserGame.newMachine.get('size');

			Polyworks.Utils.each(
				partsData,
				function(part, p) {
					trace('\tadding part[' + p + '] info to views');
					var item = Polyworks.Utils.clone(itemConfig);
					item.name = part.id;
					item.views.icon.img = part.icon;
					item.views.description.text = part.description;
					item.views.cost.text = '$' + part.cost[size];
					item.views.invisButton.partIdx = p;
					
					itemY = (totalHeight * count) + offset;
					Polyworks.Utils.each(
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
			Polyworks.PhaserView.addView(menuConfig, collection);
			trace('\tcreated overlay-menu from: ', menuConfig, '\tcollection now = ', collection);
		}
	},
	sharedViews: {
		notification: {
			closeButton: {
				callback: function() {
					Polyworks.EventCenter.trigger({ type: Polyworks.Events.CLOSE_NOTIFICATION });
				}
			}
		},
		overlayMenu: {
			closeButton: {
				callback: function() {
					Polyworks.EventCenter.trigger({ type: Polyworks.Events.CLOSE_OVERLAY_MENU });
				}
			}
		},
		overlayMenuItem: {
			invisButton: {
				input: {
					inputDown: function(event) {
						trace('invisButton inputDown, this = ', this);
						PhaserGame.newMachine.setPart(PhaserGame.currentPartType, this.controller.config.partIdx);
						Polyworks.EventCenter.trigger({ type: Polyworks.Events.CLOSE_OVERLAY_MENU });
					}
				}
			}
		}
	},
	states: {
		start: {
			listeners: [
			// // hide notification
			// {
			// 	event: Polyworks.Events.CLOSE_NOTIFICATION,
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
			// game time updated
			{
				event: Polyworks.Events.GAME_TIME_UPDATED,
				handler: function(event) {
					var text = 'Turn time: ' + event.value;
					this.views['start-state-text'].children['turn-time'].callMethod('setText', [text]);

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
						if(this.timePerTurn <= 0) {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.TURN_ENDED });
						} else {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.GAME_TIME_UPDATED, value: this.timePerTurn });
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
				buttons: {
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
				event: Polyworks.Events.OPEN_NOTIFICATION,
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
				event: Polyworks.Events.CLOSE_NOTIFICATION,
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
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_NOTIFICATION, value: 'hello notification' });
						}
					}
				},
				buttons: {
					closeButton: {
						callback: function() {
							Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'play' });
						}
					}
				},
				icons: {
					tractor: {
						input: {
							inputDown: function() {
								PhaserGame.currentEquipmentType = EquipmentTypes.TRACTOR;
								PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'equipmentEditor' });
							}
						}
					},
					skidsteer: {
						input: {
							inputDown: function() {
								PhaserGame.currentEquipmentType = EquipmentTypes.SKIDSTEER
								PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'skidsteerBuilder' });
							}
						}
					}
				}
			}
		},
		equipmentEditor: {
			listeners: [
			{
				event: Polyworks.Events.SHOW_BUILD_GROUP,
				handler: function(event) {
					// trace('showBuildGroup, size = ' + event.size);
					PhaserGame.newMachine.set('size', event.size);
					this.views[event.previousGroup].hide();
					this.views['build-group'].show();
				}
			},
			{
				event: Polyworks.Events.OPEN_OVERLAY_MENU,
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
				event: Polyworks.Events.CLOSE_OVERLAY_MENU,
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
					PhaserGame.newMachine = new Machine({
						id: String(new Date().getTime()),
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
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'equipment' });
							}
						},
						saveButton: {
							callback: function() {
								PhaserGame.newMachine.save();
								Polyworks.EventCenter.trigger({ type: Polyworks.Events.CHANGE_STATE, value: 'equipment' });
							}
						}
					},
					icons: {
						wheelIcon: {
							input: {
								inputDown: function() {
									trace('wheel icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_OVERLAY_MENU, value: PartTypes.WHEELS });
								}
							}
						},
						engineIcon: {
							input: {
								inputDown: function() {
									trace('engine icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_OVERLAY_MENU, value: PartTypes.ENGINE });
								}
							}
						},
						transmissionIcon: {
							input: {
								inputDown: function() {
									trace('transmission icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_OVERLAY_MENU, value: PartTypes.TRANSMISSION });
								}
							}
						},
						cabIcon: {
							input: {
								inputDown: function() {
									trace('cab icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_OVERLAY_MENU, value: PartTypes.CAB });
								}
							}
						},
						headlightsIcon: {
							input: {
								inputDown: function() {
									trace('headlights icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.OPEN_OVERLAY_MENU, value: 'headlights' });
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
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.BASIC, previousGroup: 'create-group' });
								}
							}
						},
						createMedium: {
							input: {
								inputDown: function() {
									// trace('createMedium icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.MEDIUM, previousGroup: 'create-group' });
								}
							}
						},
						createHeavy: {
							input: {
								inputDown: function() {
									// trace('createHeavy icon input down');
									Polyworks.EventCenter.trigger({ type: Polyworks.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.HEAVY, previousGroup: 'create-group' });
								}
							}
						}
					}
				}
			}
		}
	}
};