PWG.Utils = function() {
	var module = {};

	module.each = function(list, callback, context) {
		if(Array.isArray(list)) {
			var length = list.length;
			for(var i = 0; i < length; i++) {
				callback.call(context, list[i], i, list);
			}
		} else {
			for(var key in list) {
				callback.call(context, list[key], key, list);
			}
		}
	};
	
	module.clone = function(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = PWG.Utils.clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = PWG.Utils.clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");	
	};

	module.extend = function(a, b) {
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		} 
		return a;
	};

	module.extract = function(obj, prop) {
		var a = obj[prop];
		if(obj !== window) { delete obj[prop]; }
		return a;
	};

	module.has = function(obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};
	
	module.objLength = function(obj) {
		var length = 0;
		for(var key in obj) {
			// if(obj.hasOwnProperty(key)) { length++; }
			if(PWG.Utils.has(obj, key)) { length++; }
		}
		return length;
	};

	module.randomProperty = function(obj) {
	    var keys = Object.keys(obj);
	    return obj[keys[keys.length * Math.random() << 0]];
	};
	
	module.randomKey = function(obj) {
		var keys = Object.keys(obj);
		return [keys[keys.length * Math.random() << 0]];
	};
	
	module.mixin = function(c, p) {
	    for(var k in p) if(p[k]) c[k] = p[k];
	};

	module.bind = function(o, f) {
	    return function() { return f.apply(o, arguments); };
	};

	module.inherit = function(c, p) {
	    this.mixin(c, p);
	    function f() { this.constructor = c; };
	    f.prototype = c._super = p.prototype;
	    c.prototype = new f();
	};

	module.isInView = function(pos) {
		if(pos.x > 0 && pos.x < stageConfig.width && pos.y > 0 && pos.y < stageConfig.height) {
			return true;
		} else {
			return false;
		}
	};
	
	module.parseMarkup = function(str, reference, encodeMarkup) {
		var parsedString = str;
		// trace('Utils/parseMarkup, str = ' + str + ', reference = ', reference);

		if(str.indexOf('~{') > -1) {
			var pattern = /~\{[A-Z]*\}~/gi;
			var patternMatch = str.match(pattern);
			if(patternMatch) {
				for (var matchNum in patternMatch) {
					var match = String(patternMatch[matchNum]);

					var matchLength = match.length;
					var matchKey = match.substring(2, matchLength - 2);
					var output = reference[matchKey];
					if(encodeMarkup) {
						output = encodeURIComponent(output);
					}
					// trace('output = ' + output);
					if(output === undefined || output === null) {
						output = match;
					} else {
						output = output.toString();
					}
					parsedString = parsedString.replace(match, output);
				}
				//// trace(parsedString);
			} else {
				parsedString = null;
			}
		}

		return parsedString;
	};
	
	module.loadScript = function(url, evt) {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');

        if(scriptTag.readyState) {
            scriptTag.onreadystatechange = function() {
                if(scriptTag.readyState == 'loaded' || scriptTag.readyState == 'complete') {
                    // callback.call(evt);
					PWG.EventCenter.trigger(evt);
                }
            };
        } else {
            scriptTag.onload = function() {
                // callback.call(evt);
				PWG.EventCenter.trigger(evt);
            };
        }
        scriptTag.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
	};

	module.diceRoll = function(sides) {
		var s = sides || 6;
		return Math.floor(Math.random() * s) + 1;
	};

	module.formatMoney = function(n, c, d, t){
		var c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	 };
	
	return module;
}();
