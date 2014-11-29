var PWG = PWG || {};
PWG.Color = function() {
	var module = {};
	
	module.PERCENT_COLORS_RAINBOW = [
	    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
	    { pct: 0.25, color: { r: 0xff, g: 0xff, b: 0x00 } },
	    { pct: 0.50, color: { r: 0x00, g: 0xff, b: 0x00 } },
	    { pct: 0.75, color: { r: 0x00, g: 0x99, b: 0xff } },
	    { pct: 1.0, color: { r: 0x99, g: 0x00, b: 0x99 } } ];
	
	module.createPercentColors = function(config) {
		var percentColors = [];
		if(config.pcts) {
			PWG.Utils.each(
				config.pcts,
				function(pct, idx) {
					var stop = { pct: pct, color: config.colors[idx] };
					percentColors.push(stop);
				},
				module
			);
		} else if(config.colors) {
			var m = 100/(config.colors.length - 1);
			PWG.Utils.each(
				config.colors,
				function(color, idx) {
					var stop = { pct: ((idx === 0) ? 0 : (m * idx)/100), color: color };
					percentColors.push(stop);
				}
			)
		}
		
		return percentColors;
	};
	
	module.percentToRGB = function(pct, colors) {
		var percentColors = colors || module.PERCENT_COLORS_RAINBOW;
		
	    for (var i = 1; i < percentColors.length - 1; i++) {
	        if (pct < percentColors[i].pct) {
	            break;
	        }
	    }
	    var lower = percentColors[i - 1];
	    var upper = percentColors[i];
	    var range = upper.pct - lower.pct;
	    var rangePct = (pct - lower.pct) / range;
	    var pctLower = 1 - rangePct;
	    var pctUpper = rangePct;
	    var color = {
	        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
	        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
	        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
	    };
		return color;
	    // or output as hex if preferred
	}
		// 
	module.formatRGB = function(color) {
		return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
	};
	
	module.percentToHex = function(pct, colors) {
		var rgb = module.percentToRGB(pct, colors);
		return module.rgbToHex(rgb.r, rgb.g, rgb.b);
	};
	
	module.rgbToHex = function(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	};

	// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}


	return module;
}();