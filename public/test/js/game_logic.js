var gameLogic = {
	states: {
		play: {
			views: {
				icons: {
					input: {
						inputDown: function() {
							trace('factory-icon/inputDown, this.selected = ' + this.selected + ', PhaserGame.selectedIcon = ' + PhaserGame.selectedIcon + ', this name = ' + this.controller.name);
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
							trace('config on drag stop for: ', this.controller.view);
						}
					}
				}
			}
		}
	}
};