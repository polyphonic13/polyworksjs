var gameLogic = {
	states: {
		play: {
			views: {
				icons: {
					input: {
						inputDown: function() {
							// trace('factory-icon/inputDown, this.selected = ' + this.selected + ', PhaserGame.selectedIcon = ' + PhaserGame.selectedIcon + ', this name = ' + this.controller.name);
							if(this.selected) {
								PhaserGame.selectedIcon = '';
								this.selected = false;
							} else {
								PhaserGame.selectedIcon = this.controller.name;
								this.selected = true;
								var input = this.controller.view.input;
								input.enableDrag();
								input.enableSnap(90, 90, false, true);
							}
						},
						onDragStop: function() {
							trace('config on drag stop, view.x = ' + this.controller.view.y + ', max = ' + (Polyworks.Stage.unit * 10.5) + ', min = ' + (Polyworks.Stage.unit * 3.5));
							var view = this.controller.view;
							if(view.y < (Polyworks.Stage.unit * 3.5)) {
								view.y = Polyworks.Stage.unit * 3.5;
							} else if(view.y > (Polyworks.Stage.unit * 10.5)) {
								view.y = Polyworks.Stage.unit * 9.4;
							}
							trace('view.y is now: ' + view.y);
						}
					}
				}
			}
		}
	}
};