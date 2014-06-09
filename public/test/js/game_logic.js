var GAME_NAME = 'global_trader_3_0';
var TIME_PER_TURN = 52;
var TURN_TIME_INTERVAL = 1000;
var GRID_CELLS = 9;
var TIME_TO_MANUFACTOR = 5;
var MACHINE_LIST_COLUMNS = 2; 

var buildingCosts = {
	factory: 100000,
	showroom: 50000
};

var turnGroups = [
	'play',
	'equipmentList',
	'equipmentCreate',
	'equipmentEdit',
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
				PWG.ViewManager.switchGroup(event.value);
				PWG.ScreenManager.changeScreen(event.value);

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
				// PWG.ViewManager.hideView('global:turnGroup:pauseButton');
				// PWG.ViewManager.showView('global:turnGroup:resumeButton');
			}
		},
		// resume
		{
			event: PWG.Events.RESUME_GAME,
			handler: function(event) {
				PhaserGame.turnTimer.resume();
				// PWG.ViewManager.showView('global:turnGroup:pauseButton');
				// PWG.ViewManager.hideView('global:turnGroup:resumeButton');
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
			render: function() {
				PWG.ScreenManager.render();
			},
			getSavedData: function() {
				var savedData = PWG.Storage.get(GAME_NAME);
				if(!savedData) {
					savedData = playerData;
				}
				PhaserGame.playerData = savedData;
				trace('============ post get saved data, playerData = ', PhaserGame.playerData);
			},
			setSavedData: function() {
				var params = {};
				params[GAME_NAME] = PhaserGame.playerData;
				PWG.Storage.set(params);
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
				// PhaserGame.turnTimer.start();
				PWG.ViewManager.showView('global');
				PWG.ViewManager.hideView('global:turnGroup:saveMachineButton');
				// PWG.ViewManager.hideView('global:turnGroup:resumeButton');
				PWG.ViewManager.hideView('global:turnGroup:addBuilding');
				PWG.ViewManager.hideView('global:turnGroup:addEquipment');
				PWG.ViewManager.hideView('global:turnGroup:closeButton');
			},
			stopTurn: function() {
				PhaserGame.removeTimer('turnTimer');
				PhaserGame.turnActive = false;
			},
			addPartItemsOverlay: function(type, collection) {
				PhaserGame.currentPartType = type;
				var partsData = gameData.parts[type];
				trace('addPartItemsOverlay, type = ' + type + '\tparts data = ', partsData);
				var partsMenuConfig = PWG.Utils.clone(PhaserGame.config.dynamicViews.partsMenu);
				var itemConfig = PhaserGame.config.dynamicViews.partSelectionButton;
				var offset = itemConfig.offset;
				var iconH = itemConfig.iconH;
				var size = PhaserGame.currentMachineSize;
				var count = 0;
				var itemY = 0;

				PWG.Utils.each(
					partsData,
					function(part, idx) {
						// trace('\tadding part[' + p + '] info to views');
						var item = PWG.Utils.clone(itemConfig);
						item.name = part.id;
						item.views.icon.img = part.icon;
						item.views.description.text = part.description;
						item.views.cost.text = '$' + part.cost[size];
						item.views.invisButton.partIdx = idx;

						itemY = (iconH * count) + offset;
						PWG.Utils.each(
							item.views,
							function(view) {
								view.y += itemY;
							},
							this
						);

						partsMenuConfig.views['items'].views[idx] = item;
						count++;
					},
					this
				);
				trace('partsMenuConfig = ', partsMenuConfig);
				PWG.ViewManager.addView(partsMenuConfig);
				// trace('\tcreated partsMenu from: ', partsMenuConfig, '\tcollection now = ', collection);
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
			newFactory: {
				inputDown: function() {
					trace('factoryIcon/inputDown, this = ', this);
					if(this.selected) {
						PhaserGame.selectedIcon = '';
						this.selected = false;
					} else {
						PhaserGame.selectedIcon = this.controller.id;
						this.selected = true;
						var input = this.controller.view.input;
						var attrs = this.controller.config.attrs;
						input.enableDrag();
						input.enableSnap(attrs.width, attrs.height, false, true);
						// input.enableSnap(32, 32, false, true);
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
					
					var maxX = (PWG.Stage.gameW + view.width);
					if(view.x > maxX) {
						view.x = maxX;
					} else if(view.x < 0) {
						view.x = 0;
					}
					// trace('view x/y is now: ' + view.x + '/' + view.y);
				}
			},
			newShowroom: {
				inputDown: function() {
					trace('showroomIcon/inputDown, this = ', this);
					if(this.selected) {
						PhaserGame.selectedIcon = '';
						this.selected = false;
					} else {
						PhaserGame.selectedIcon = this.controller.id;
						this.selected = true;
						var input = this.controller.view.input;
						var attrs = this.controller.config.attrs;
						input.enableDrag();
						input.enableSnap(attrs.width, attrs.height, false, true);
						// input.enableSnap(32, 32, false, true);
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
					
					var maxX = (PWG.Stage.gameW + view.width);
					if(view.x > maxX) {
						view.x = maxX;
					} else if(view.x < 0) {
						view.x = 0;
					}
					// trace('view x/y is now: ' + view.x + '/' + view.y);
				}
			},
			newTractor: {
				inputDown: function() {
					trace('new tractor callback');
					PWG.EventCenter.trigger({ type: PWG.Events.MACHINE_TYPE_SELECTION, value: EquipmentTypes.TRACTOR });
				}
			},
			newSkidsteer: {
				inputDown: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.MACHINE_TYPE_SELECTION, value: EquipmentTypes.SKIDSTEER });
				}
			},
			editMachine: {
				inputDown: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.EDIT_MACHINE, value: this.controller.config.machineIdx });
				}
			},
			basicSize: {
				inputDown: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.MACHINE_SIZE_SELECTION, value: EquipmentSizes.BASIC });
				}
			},
			mediumSize: {
				inputDown: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.MACHINE_SIZE_SELECTION, value: EquipmentSizes.MEDIUM });
				}
			},
			heavySize: {
				inputDown: function() {
					PWG.EventCenter.trigger({ type: PWG.Events.MACHINE_SIZE_SELECTION, value: EquipmentSizes.HEAVY });
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
			},
			partsMenu: {
				closeButton: {
					callback: function() {
						PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
					}
				}
			},
			partSelectionButton: {
				inputDown: function(event) {
					PWG.EventCenter.trigger({ type: PWG.Events.ADD_PART, value: this.controller.config.partIdx });
				}
			}
		},
		buttonCallbacks: {
			manualStart: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'manual' });
			},
			manualClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'start' });
			},
			playStart: function() {
				if(PhaserGame.isFirstPlay) {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'manual' });
					PhaserGame.isFirstPlay = false;
				} else {
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
				}
			},
			pauseButton: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.PAUSE_GAME });
			},
			resumeButton: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.RESUME_GAME });
			},
			usDetailStart: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'usDetail' });
			},
			usDetailClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
			},
			notificationClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_NOTIFICATION });
			},
			partsMenuClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
			},
			usDetailButton: function() {
					// PWG.EventCenter.trigger({ type: PWG.Events.START_TURN });
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'usDetail' });
			},
			addBuilding: function() {
				trace('add building button clicked');
			},
			equipmentListStart: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentList' });
			},
			equipmentListClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
			},
			addEquipment: function() {
				trace('add equipment button clicked');
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentCreate' });
			},
			equipmentCreateClose: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentList' });
			},
			saveMachine: function() {
				PWG.EventCenter.trigger({ type: PWG.Events.SAVE_MACHINE });
			},
			closeButton: function() {
				switch(PWG.ScreenManager.currentId) {
					case 'usDetail':
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
					break;
					
					case 'equipmentCreate':
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentList' });
					break;
					
					case 'equipmentList':
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'play' });
					break;
					
					case 'equipmentEdit':
					if(PhaserGame.machineDirty) {
						// notify of unsaved changes
					}
					PWG.ViewManager.hideView('global:turnGroup:saveMachineButton');
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentList' });
					break;
					
					default:
					break;
				}
				// PWG.ViewManager.hideView('global:turnGroup:closeButton');
			}
		}
	},
	screens: {
		start: {
			
		},
		play: {
			create: function() {
				PWG.ViewManager.hideView('global:turnGroup:closeButton');
				PWG.ViewManager.showView('global:turnGroup:equipmentButton');
			}
		},
		usDetail: {
			create: function() {
				// show add building button
				trace('show add building button');
				PWG.ViewManager.showView('global:turnGroup:addBuilding');
				PWG.ViewManager.showView('global:turnGroup:closeButton');
			},
			shutdown: function() {
				// hide add building button
				PWG.ViewManager.hideView('global:turnGroup:addBuilding');
			}
		},
		equipmentList: {
			listeners: [
			{
				event: PWG.Events.EDIT_MACHINE,
				handler: function(event) {
					var config = PhaserGame.playerData.equipment[event.value];
					trace('edit machine: event = ', event, 'config = ', config);
					PhaserGame.currentMachineType = config.type;
					PhaserGame.currentMachineSize = config.size;
					PhaserGame.currentMachine = new Machine(config);
					PhaserGame.newMachine = false;
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentEdit' });
				}
			}
			],
			create: function() {
				// show add equipment button
				PWG.ViewManager.showView('global:turnGroup:addEquipment');
				PWG.ViewManager.hideView('global:turnGroup:equipmentButton');
				PWG.ViewManager.showView('global:turnGroup:closeButton');
				
				var equipment = PhaserGame.playerData.equipment;

				var machineList = PWG.Utils.clone(PhaserGame.config.dynamicViews.machineList);
				var machineIcon = PWG.Utils.clone(PhaserGame.config.dynamicViews.machineIcon);

				var offsetX = machineIcon.offsetX;
				var offsetY = machineIcon.offsetY;
				var iconW = machineIcon.iconW;
				var iconH = machineIcon.iconH;
				var columnW = PWG.Stage.gameW/MACHINE_LIST_COLUMNS;
				
				var column = 0;
				var count = 0;
				var itemY = 0;
			
				PWG.Utils.each(
					equipment,
					function(machine, idx) {
						// trace('\tadding machine['+idx+']: ', machine);
						var item = PWG.Utils.clone(machineIcon);
						// trace('\titem = ', item);
						item.name = 'machine' + idx;
						item.views.name.text = machine.name;
						item.views.cost.text = '$' + machine.cost;
						item.views.invisButton.machineIdx = idx;
						// increment y to next row:
						if(count % MACHINE_LIST_COLUMNS === 0) {
							itemY = (iconH * (count/MACHINE_LIST_COLUMNS)) + offsetY;
						}
						
						var columnX = offsetX + ((PWG.Stage.gameW/2) * (count % MACHINE_LIST_COLUMNS));

						PWG.Utils.each(
							item.views,
							function(view) {
								view.x += columnX;
								view.y += itemY;
							},
							this
						);
				
						machineList.views[item.name] = item;
						count++;
					},
					this
				);
				// trace('machineList = ', machineList);
				var equipmentListView = PWG.ViewManager.getControllerFromPath('equipmentList');
				PWG.ViewManager.addView(machineList, equipmentListView, true);
			},
			shutdown: function() {
				// hide add building button
				PWG.ViewManager.hideView('global:turnGroup:addEquipment');
			}
		},
		equipmentCreate: {
			listeners: [
			{
				event: PWG.Events.MACHINE_TYPE_SELECTION,
				handler: function(event) {
					// activate size category buttons
					trace('machine type selection, event = ', event);
					PhaserGame.currentMachineType = event.value;
					PWG.ViewManager.hideView('equipmentCreate:createIcons:machineType');
					if(event.value === EquipmentTypes.TRACTOR) {
						PWG.ViewManager.showView('equipmentCreate:createIcons:tractorSize');
						PWG.ViewManager.hideView('equipmentCreate:createIcons:skidsteerSize');
					} else {
						PWG.ViewManager.showView('equipmentCreate:createIcons:skidsteerSize');
						PWG.ViewManager.hideView('equipmentCreate:createIcons:tractorSize');
					}
				}
			},
			{
				event: PWG.Events.MACHINE_SIZE_SELECTION,
				handler: function(event) {
					// 
					var type = PhaserGame.currentMachineType;
					var letter = alphabet.UPPER[PhaserGame.playerData.machineCount[type]];
					var id = type + letter;
					var name = type.toUpperCase() + ' ' + letter;
					PhaserGame.currentMachineSize = event.value;
					PhaserGame.currentMachine = new Machine({ type: PhaserGame.currentMachineType, size: event.value, name: name });
					PhaserGame.newMachine = true;
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentEdit' });
				}
			}
			],
			create: function() {
				trace('EQUIPMENT CREATE CREATE METHOD');
				PWG.ViewManager.hideView('equipmentCreate:createIcons:tractorSize');
				PWG.ViewManager.hideView('equipmentCreate:createIcons:skidsteerSize');
				PWG.ViewManager.showView('global:turnGroup:closeButton');
			}
		},
		equipmentEdit: {
			listeners: [
			{
				event: PWG.Events.ADD_PART,
				handler: function(event) {
					PhaserGame.currentMachine.setPart(PhaserGame.currentPartType, event.value);
					// trace('show part, type = ' + event.value + ', part type = ' + this.partsMenuType + ', view collection = ', this.views);
					var frame = gameData.parts[this.partsMenuType][event.value].frame;
					// trace('frame = ' + frame + ', type = ' + this.partsMenuType + ', collection = ', this.views);
					var partView = this.partsMenuType + 'Part';
					PWG.ViewManager.setFrame('equipmentEdit:editorParts:'+partView, frame);
					PWG.EventCenter.trigger({ type: PWG.Events.CLOSE_OVERLAY_MENU });
				}
			},
			{
				event: PWG.Events.SHOW_BUILD_GROUP,
				handler: function(event) {
					// trace('showBuildGroup, size = ' + event.size);
					PhaserGame.currentMachine.set('size', event.size);
					// playerData.equipment[PhaserGame.activeMachineId].set('size', event.size);
					this.views['state-group'].children[event.previousGroup].hide();
					this.views['state-group'].children['editor-group'].show();
				}
			},
			{
				event: PWG.Events.OPEN_OVERLAY_MENU,
				handler: function(event) {
					// trace('open overlay menu handler, value = ' + event.value + ', overlay open = ' + this.partsMenuOpen + ', partsMenuType = ' + this.partsMenuType);
					if(!this.partsMenuOpen) 
					{
						if(this.partsMenuType !== event.value) 
						{
							PhaserGame.addPartItemsOverlay.call(this, event.value, this.views);
						}
						PWG.ViewManager.showView('partsMenu');
						this.partsMenuType = event.value;
						this.partsMenuOpen = true;
					}
				}
			},
			{
				event: PWG.Events.CLOSE_OVERLAY_MENU,
				handler: function(event) {
					// trace('close overlay handler, overlay open = ' + this.partsMenuOpen);
					if(this.partsMenuOpen) {
						// trace('\toverlay-menu = ', (this.views['overlay-menu']));
						PWG.ViewManager.hideView('partsMenu');
						this.partsMenuOpen = false;
					}
				}
			},
			{
				event: PWG.Events.SAVE_MACHINE, 
				handler: function(event) {
					trace('time to save currentMachine: ', PhaserGame.currentMachine);
					PhaserGame.currentMachine.save();
					if(PhaserGame.newMachine) {
						PhaserGame.playerData.equipment.push(PhaserGame.currentMachine.config);
						PhaserGame.playerData.machineCount[PhaserGame.currentMachineType]++;
						PhaserGame.newMachine = false;
					}
					PhaserGame.setSavedData();
					PhaserGame.currentMachine = null;
					PhaserGame.machineDirty = false;
					PWG.ViewManager.hideView('global:turnGroup:saveMachineButton');
					PWG.EventCenter.trigger({ type: PWG.Events.CHANGE_SCREEN, value: 'equipmentList' });
				}
			}
			],
			create: function() {
				PWG.ViewManager.showView('global:turnGroup:saveMachineButton');
				PWG.ViewManager.showView('global:turnGroup:closeButton');
				
				var currentMachineParts = PhaserGame.currentMachine.parts;
				if(currentMachineParts) {

				}
				PWG.ViewManager.setChildFrames('equipmentEdit:editorParts', 0);
				PhaserGame.machineDirty = true;
			},
			shutdown: function() {
				this.partsMenuType = '';
				this.partsMenuOpen = false;
				PhaserGame.machineDirty = false;
			}
		}
	}
};