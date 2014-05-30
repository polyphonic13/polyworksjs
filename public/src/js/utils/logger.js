// LOGGING
function trace(message) {
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = { log:function(){} };
	} else {
		pwg.Utils.each(arguments,
			function(a) {
				console.log(a);
			},
			this
		);
	}
}
