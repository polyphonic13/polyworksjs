var PWG = PWG || {};
PWG.Utils = function() {
	var module = {};

	module.each = function(list, callback, context) {
		if(Array.isArray(list)) {
			for(var i = 0, length = list.length; i < length; i++) {
				callback.call(context, list[i], i, list);
			}
		} else {
			for(var key in list) {
				callback.call(context, list[key], key, list);
			}
		}
	};
	
	module.clone = function(original) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == original || "object" != typeof original) return original;

	    // Handle Date
	    if (original instanceof Date) {
	        var copy = new Date();
	        copy.setTime(original.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (original instanceof Array) {
			var copy = list.slice(0);
	        // var copy = [];
	        // for (var i = 0, len = original.length; i < len; i++) {
	        //     copy[i] = PWG.Utils.clone(original[i]);
	        // }
	        return copy;
	    }

	    // Handle Object
	    if (original instanceof Object) {
	        var copy = {};
	        for (var attr in original) {
	            if (original.hasOwnProperty(attr)) copy[attr] = PWG.Utils.clone(original[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy original! Its type isn't supported.");	
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
	
	module.contains = function(list, value) {
		var contains = false;
		if(Array.isArray(list)) {
			if(list.indexOf(value) > -1) {
				contains = true;
			}
		} else {
			for(var key in list) {
				if(list.hasOwnProperty(key) && list[key] === value) {
					contains = true;
				}
			}
		}
		return contains;
	};

	module.find = function(list, match) {
		var element = null;
		if(Array.isArray(list)) {
			for(var i = 0, length = list.length; i < length; i++) {
				if(list[i] === match) {
					element = list[i];
					break;
				}
			}
		} else {
			for(var key in list) {
				if(list[key] === match) {
					element = list[key];
					break;
				}
			}
		}
		return element;
	},
	// module.find = function(list, condition, context) {
	// 	var ctx = context || window;
	// 	var value = null;
	// 	if(Array.isArray(list)) {
	// 
	// 		for(var i = 0, length = list.length; i < length; i++) {
	// 			if(condition.call(ctx, list[i], i, list)) {
	// 				value = list[i];
	// 				break;
	// 			}
	// 		}
	// 	} else {
	// 		for(var key in list) {
	// 			if(condition.call(ctx, list[key], key, list)) {
	// 				value = list[key];
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return value;
	// };
	
	module.arraysEqual = function(a, b) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length != b.length) return false;

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	};
	
	module.elementCount = function(list) {
		counts = {};

		if(Array.isArray(list)) {

			for (i = 0, length = list.length; i < length; i++) {
				if(!counts[list[i]]) {
					counts[list[i]] = 0;
				}
				counts[list[i]]++;
			}
		} else {
			return null;
		}
		return counts;
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
				for(var matchNum in patternMatch) {
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

	module.shuffle = function(array) {
		var m = array.length, t, i;

		// http://bost.ocks.org/mike/shuffle/
		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	};
	
	module.diceRoll = function(sides) {
		var s = sides || 6;
		return Math.floor(Math.random() * s) + 1;
	};

	module.coinToss = function() {
		return Math.random() < 0.5 ? true : false;
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
	
	//=== onDomReady function from https://github.com/cms/domready ===
	module.onDomReady = function() {

	    var w3c = !!document.addEventListener,
	        loaded = document.readyState === "complete",
	        toplevel = false,
	        fns = [];

	    if (w3c) {
	        document.addEventListener("DOMContentLoaded", contentLoaded, true);
	        window.addEventListener("load", ready, false);
	    } else {
	        document.attachEvent("onreadystatechange", contentLoaded);
	        window.attachEvent("onload", ready);

	        try {
	            toplevel = window.frameElement === null;
	        } catch(e) {}

	        if ( document.documentElement.doScroll && toplevel ) {
	            scrollCheck();
	        }
	    }

	    function contentLoaded() {
	        (w3c)?
	            document.removeEventListener("DOMContentLoaded", contentLoaded, true) :
	            document.readyState === "complete" && 
	            document.detachEvent("onreadystatechange", contentLoaded);
	        ready();
	    }

	    // If IE is used, use the trick by Diego Perini
	    // http://javascript.nwbox.com/IEContentLoaded/
	    function scrollCheck() {
	        if (loaded) {
	            return;
	        }

	        try {
	            document.documentElement.doScroll("left");
	        } catch(e) {
	            window.setTimeout(arguments.callee, 15);
	            return;
	        }
	        ready();
	    }

	    function ready() {
	        if (loaded) {
	            return;
	        }
	        loaded = true;

	        var len = fns.length,
	            i = 0;

	        for( ; i < len; i++) {
	            fns[i].call(document);
	        }
	    }

	    return function(fn) {
	        // if the DOM is already ready,
	        // execute the function
	        return (loaded)? 
	            fn.call(document):      
	            fns.push(fn);
	    };
	}();

	return module;
}();
