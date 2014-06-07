var GAME_NAME = 'global_trader_3_0';
var TIME_PER_TURN = 52;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;
var TIME_TO_MANUFACTOR = 5;

var buildingCosts = {
	factory: 100000,
	showroom: 50000
};

var turnGroups = [
	'play',
	'inventoryList',
	'equipmentEditor',
	'usDetail'
];

var gameLogic = {
	global: {
		listeners: 
		[
		// change state
		{
			event: PWG.Events.CHANGE_SCREEN,
			handler: function(event) {
				PWG.ScreenManager.changeScreen(event.value);
				PWG.ViewManager.switchGroup(event.value);

				if(turnGroups.indexOf(event.value) > -1) {
					// trace('this is a turn group!');
					if(!PhaserGame.turnActive) {
						PhaserGame.startTurn();
					}
				} else {
					if(PhaserGame.turnActive) {
						// trace('deactivating turn');
						PhaserGame.stopTurn();
					}
				}
			}
		},
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
		},
		// game time updated
		{
			event: PWG.Events.GAME_TIME_UPDATED,
			handler: function(event) {
				PhaserGame.turnTime = event.value;
				var text = (event.value >= 10) ? event.value : '0' + event.value;
				// trace('turn time = ' + event.value);
				PWG.ViewManager.callMethod('global:turnGroup:timerText', 'setText', [text], this);
			}
		},
		// turn ended
		{
			event: PWG.Events.TURN_ENDED,
			handler: function(event) {
				PWG.PhaserTime.removeTimer('turnTime');
				trace('turn ended');
				PWG.ViewManager.callMethod('global:turnGroup:timerText', 'setText', [TIME_PER_TURN], this);
			}
		},
		// pause
		{
			event: PWG.Events.PAUSE_GAME,
			handler: function(event) {
				PhaserGame.turnTimer.pause();
				PWG.ViewManager.hideView('global:turnGroup:pauseButton');
				PWG.ViewManager.showView('global:turnGroup:resumeButton');
			}
		},
		// resume
		{
			event: PWG.Events.RESUME_GAME,
			handler: function(event) {
				PhaserGame.turnTimer.resume();
				PWG.ViewManager.showView('global:turnGroup:pauseButton');
				PWG.ViewManager.hideView('global:turnGroup:resumeButton');
			}
		},
		// add part
		{
			event: PWG.Events.ADD_PART,
			handler: function(event) 
			{
				PhaserGame.newMachine.setPart(PhaserGame.currentPartType, event.value);
				// trace('show part, type = ' + event.value + ', part type = ' + this.overlayMenuType + ', view collection = ', this.views);
				var frame = gameData.parts[this.overlayMenuType][event.value].frame;
				// trace('frame = ' + frame + ', type = ' + this.overlayMenuType + ', collection = ', this.views);
				var partView = this.overlayMenuType + '-part';
				this.views['state-group'].children['editor-group'].children['editor-parts'].children[partView].view.frame = frame;
				PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
			}
		},
		// show build group
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
		// open overlay menu
		{
			event: PWG.Events.OPEN_OVERLAY_MENU,
			handler: function(event) 
			{
				// trace('open overlay menu handler, value = ' + event.value + ', overlay open = ' + this.overlayMenuOpen + ', overlayMenuType = ' + this.overlayMenuType);
				if(!this.overlayMenuOpen) 
				{
					if(this.overlayMenuType !== event.value) 
					{
						PhaserGame.addOverlayMenuItems.call(this, event.value, this.views);
					}

					this.views['overlay-menu'].show();
					this.overlayMenuType = event.value;
					this.overlayMenuOpen = true;
				}
			}
		},
		// close overlay menu
		{
			event: PWG.Events.CLOSE_OVERLAY_MENU,
			handler: function(event) 
			{
				// trace('close overlay handler, overlay open = ' + this.overlayMenuOpen);
				if(this.overlayMenuOpen) 
				{
					// trace('\toverlay-menu = ', (this.views['overlay-menu']));
					this.views['overlay-menu'].hide();
					this.overlayMenuOpen = false;
				}
			}
		}
		],
		methods: {
			init: function() {
				PhaserGame.getSavedData();
			},
			preload: function() {
				PWG.PhaserLoader.load(PhaserGame.config.assets);
				// PWG.ScreenManager.preload();
			},
			create: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: PhaserGame.config.defaultScreen });
				// PWG.ScreenManager.create();
			},
			// update: function() {
			// 	PWG.ScreenManager.update();
			// },
			getSavedData: function() {
				PhaserGame.gameData = PWG.Storage.get(GAME_NAME);
				trace('post get saved data, gameData = ', PhaserGame.gameData);
			},
			setSavedData: function(data) {
				PWG.Storage.set(GAME_NAME, PhaserGame.gameData);
			},
			update: function() {

			},
			startTurn: function() {
				trace('START TURN');
				PhaserGame.turnActive = true;
				PhaserGame.timePerTurn = TIME_PER_TURN;
				PhaserGame.turnTimer = new PWG.PhaserTime.Controller('turnTime');
				PhaserGame.turnTimer.loop(TURN_TIME_INTERVAL, function() {
						// trace('\ttimePerTurn = ' + PhaserGame.timePerTurn + ', views = ', this.views);
						PhaserGame.timePerTurn--;
						if(PhaserGame.timePerTurn <= 0) {
							PWG.EventCenter.trigger({ type: PWG.Events.TURN_ENDED });
						} else {
							BuildingManager.update();
							PWG.EventCenter.trigger({ type: PWG.Events.GAME_TIME_UPDATED, value: PhaserGame.timePerTurn });
						}
					},
					this
				);
				PhaserGame.turnTimer.start();
				PWG.ViewManager.showView('global');
				PWG.ViewManager.hideView('global:turnGroup:resumeButton');
				PWG.ViewManager.hideView('global:turnGroup:addBuilding');
				PWG.ViewManager.hideView('global:turnGroup:addEquipment');
			},
			stopTurn: function() {
				PhaserGame.removeTimer('turnTimer');
				PhaserGame.turnActive = false;
			},
			addOverlayMenuItems: function(type, collection) {
				PhaserGame.currentPartType = type;
				var partsData = gameData.parts[type];
				// trace('this['+this.name+']/addOverlayMenuItems, type = ' + type + '\tparts data = ', partsData, ', collection = ', collection);

				// remove previously added items since different
				if(collection['overlay-menu']) {
					PWG.ViewManager.removeView('overlay-menu', collection);
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
						// trace('\tadding part[' + p + '] info to views');
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
				PWG.ViewManager.addView(menuConfig, collection);
				// trace('\tcreated overlay-menu from: ', menuConfig, '\tcollection now = ', collection);
			}
		},
		input: {
			plusButton: {
				inputUp: function() {
					// trace('plus pressed');
					PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_IN });
				}
			},
			minusButton: {
				inputUp: function() {
					// trace('plus pressed');
					PWG.EventCenter.trigger({ type: PWG.Events.ZOOM_OUT });
				}
			},
			overlayMenuItemButton: {
				inputDown: function(event) {
					PWG.EventCenter.trigger({ type: PWG.Events.ADD_PART, value: this.controller.config.partIdx });
				}
			},
			tractor: {
				inputDown: function() {
					PhaserGame.currentEquipmentType = EquipmentTypes.TRACTOR;
					PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentEditor' });
				}
			},
			skidsteer: {
				inputDown: function() {
					PhaserGame.currentEquipmentType = EquipmentTypes.SKIDSTEER;
					PhaserGame.currentEquipmentAction = EquipmentActions.CREATE;
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'skidsteerBuilder' });
				}
			},
			createBasic: {
				inputDown: function() {
					// trace('createBasic icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.STANDARD, previousGroup: 'create-group' });
				}
			},
			createMedium: {
				inputDown: function() {
					// trace('createMedium icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.MEDIUM, previousGroup: 'create-group' });
				}
			},
			createHeavy: {
				inputDown: function() {
					// trace('createHeavy icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.SHOW_BUILD_GROUP, size: EquipmentSizes.HEAVY, previousGroup: 'create-group' });
				}
			},
			wheelIcon: {
				inputDown: function() {
					// trace('wheel icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.WHEELS });
				}
			},
			engineIcon: {
				inputDown: function() {
					// trace('engine icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.ENGINE });
				}
			},
			transmissionIcon: {
				inputDown: function() {
					// trace('transmission icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.TRANSMISSION });
				}
			},
			cabIcon: {
				inputDown: function() {
					// trace('cab icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.CAB });
				}
			},
			headlightsIcon: {
				inputDown: function() {
					// trace('headlights icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.HEADLIGHTS });
				}
			},
			bucketIcon: {
				inputDown: function() {
					// trace('bucket icon input down');
					PWG.EventCenter.trigger({ type: PWG.Events.OPEN_OVERLAY_MENU, value: PartTypes.BUCKET });
				}
			}
		},
		buttonCallbacks: {
			manualStart: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'manual' });
				}
			},
			manualClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'start' });
				},
			},
			playStart: {
				callback: function() {
					if(PhaserGame.isFirstPlay) {
						PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'manual' });
						PhaserGame.isFirstPlay = false;
					} else {
						PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
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
			usDetailStart: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'usDetail' });
				}
			},
			usDetailClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
				}
			},
			notificationClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_NOTIFICATION });
				}
			},
			overlayMenuClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
				}
			},
			usDetailButton: {
				callback: function() {
					// PWG.EventCenter.trigger({ type: PWG.Events.START_TURN });
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'usDetail' });
				}
			},
			addBuilding: {
				callback: function() {
					trace('add building button clicked');
				}
			},
			inventoryStart: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'inventoryList' });
				}
			},
			inventoryClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
				}
			},
			addEquipment: {
				callback: function() {
					trace('add equipment button clicked');
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentEditor' });
				}
			},
			equipmentEditorClose: {
				callback: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'inventoryList' });
				}
			},
			equipmentEditorSave: {
				callback: function() {
					PhaserGame.newMachine.save();
					PhaserGame.newMachine = null;
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'inventoryList' });
				}
			}
		}
	},
	screens: {
		start: {
			
		},
		play: {
			
		},
		usDetail: {
			create: function() {
				// show add building button
				trace('show add building button');
				PWG.ViewManager.showView('global:turnGroup:addBuilding');
			},
			shutdown: function() {
				// hide add building button
				PWG.ViewManager.hideView('global:turnGroup:addBuilding');
			}
		},
		inventoryList: {
			create: function() {
				// show add equipment button
				PWG.ViewManager.showView('global:turnGroup:addEquipment');
			},
			shutdown: function() {
				// hide add building button
				PWG.ViewManager.hideView('global:turnGroup:addEquipment');
			}
		},
		equipmentEditor: {
			listeners: [
			{
				event: PWG.Events.ADD_PART,
				handler: function(event) 
				{
					PhaserGame.newMachine.setPart(PhaserGame.currentPartType, event.value);
					// trace('show part, type = ' + event.value + ', part type = ' + this.overlayMenuType + ', view collection = ', this.views);
					var frame = gameData.parts[this.overlayMenuType][event.value].frame;
					// trace('frame = ' + frame + ', type = ' + this.overlayMenuType + ', collection = ', this.views);
					var partView = this.overlayMenuType + '-part';
					this.views['state-group'].children['editor-group'].children['editor-parts'].children[partView].view.frame = frame;
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
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
				event: PWG.Events.OPEN_OVERLAY_MENU,
				handler: function(event) 
				{
					// trace('open overlay menu handler, value = ' + event.value + ', overlay open = ' + this.overlayMenuOpen + ', overlayMenuType = ' + this.overlayMenuType);
					if(!this.overlayMenuOpen) 
					{
						if(this.overlayMenuType !== event.value) 
						{
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
				handler: function(event) 
				{
					// trace('close overlay handler, overlay open = ' + this.overlayMenuOpen);
					if(this.overlayMenuOpen) 
					{
						// trace('\toverlay-menu = ', (this.views['overlay-menu']));
						this.views['overlay-menu'].hide();
						this.overlayMenuOpen = false;
					}
				}
			}
			],
			create: function() {
				// trace('create, views = ', this.views);
				switch(PhaserGame.currentEquipmentAction) {
					case EquipmentActions.CREATE:
					// this.views['state-group'].children['create-group'].show();
					var machine = new Machine({ type: PhaserGame.currentEquipmentType });

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
			shutdown: function() {
				this.overlayMenuType = '';
				this.overlayMenuOpen = false;
			}
		}
	}
};