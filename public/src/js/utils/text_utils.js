var PWG = PWG || {};
PWG.TextUtils = function() {
	var module = {};
	
	module.resizeText = function(el, unit, step) {
		var textUnit = unit || 'px';
		var fontStep = step || 2;
		var pops = el.parentNode;
		trace('TextUtils/resizeText, pops.width = ' + pops.clientWidth + ', pops height = ' + pops.clientHeight);
		if(el.clientHeight > pops.clientHeight || el.clientWidth > pops.clientWidth) {
			trace('\tel w/h = ' + el.clientWidth + '/' + el.clientHeight + ', font size = ' + el.style.fontSize + ', line height = ' + el.style.lineHeight);
			var fontSize = parseInt(el.style.fontSize.substr(0, el.style.fontSize.length));
			el.style.fontSize = (fontSize - fontStep) + textUnit;
			if(el.style.lineHeight !== '') {
				el.style.lineHeight = (el.style.fontSize.substr(0,2) + textUnit);
			}
			module.resizeText(el, unit, step);
		}
	};
	return module;
}();

/*
function adjustHeights(elem) {
     var fontstep = 2;
     if ($(elem).height()>$(elem).parent().height() || $(elem).width()>$(elem).parent().width()) {
       $(elem).css('font-size',(($(elem).css('font-size').substr(0,2)-fontstep)) + textUnit).css('line-height',(($(elem).css('font-size').substr(0,2))) + textUnit);
       adjustHeights(elem);
     }
   }
*/