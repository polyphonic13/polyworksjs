var hot;
var tempCanvas;
var tempCtx;
var canvas;
var canvasCtx; 
var sourceNode;
var audioBuffer;
var analyser;
var analyser2;
var splitter;

var jsNode; 


var AudioAnalyserTest = function() {	
	var module = {};
	// var AUDIO_FILE_URL = 'assets/audio/march_to_the_sea.mp3';
	// var AUDIO_FILE_URL = 'assets/audio/fall_into_autumn.mp3';
	var AUDIO_FILE_URL = 'assets/audio/1777.mp3';
	
	var WIDTH = 800;
	var HEIGHT = 512;
	
	module.init = function() {
		canvas = document.getElementById('analyser_output');
		canvasCtx = canvas.getContext('2d');

		canvasCtx.fillStyle = "#000000";
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		
	    tempCanvas = document.createElement("canvas");
	    tempCtx = tempCanvas.getContext("2d");
	    tempCanvas.width = WIDTH;
	    tempCanvas.height = HEIGHT;
	
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		// volume and frequency
	    var gradient = canvasCtx.createLinearGradient(0,0,0,300);
	    gradient.addColorStop(0,'#000000');
	    gradient.addColorStop(0.25,'#ff0000');
	    gradient.addColorStop(0.75,'#ffff00');
	    gradient.addColorStop(1,'#ffffff');

		// spectograM

		// var pc = PWG.Color.createPercentColors({ 
		// 	colors: [
		// 	{ r: 0xff, g: 0x00, b: 0 }, 
		// 	{ r: 0xff, g: 0xff, b:0x11 }, 
		// 	{ r: 0x33, g: 0xff, b:0x55 }, 
		// 	{ r:0x00, g: 0xff, b:0xff }] 
		// });
/*	
		var pc = PWG.Color.createPercentColors({ 
			// pcts: [
			// 	0,
			// 	0.025,
			// 	0.05,
			// 	0.075,
			// 	0.1,
			// 	0.125,
			// 	0.15,
			// 	0.175,
			// 	1
			// ],
			colors: [
				{ r: 0x00, g: 0x00, b: 0x00 }, 
				{ r: 0xff, g: 0x00, b:0xff }, 
				{ r: 0x33, g: 0x99, b:0xff }, 
				{ r: 0x33, g: 0x33, b:0xff }, 
				{ r: 0xff, g: 0x33, b:0x33 }, 
				{ r: 0x66, g: 0xff, b:0xff }, 
				{ r: 0xff, g: 0x66, b:0x66 }, 
				{ r:0x99, g: 0x99, b:0x99 },
				{ r:0xff, g: 0xff, b:0xff }
			] 
		});
*/

		var pc = PWG.Color.createPercentColors({
			colors: [
				{ r: 0x00, g: 0x00, b: 0x00 },
				{ r: 0xff, g: 0xff, b: 0xff }
			]
		})
	    // load the sound
	    setupAudioNodes();
		loadSound(AUDIO_FILE_URL);
		
		
		jsNode.onaudioprocess = function() {
			// SOUND VOLUME
			/*
	       // get the average for the first channel
	        var array =  new Uint8Array(analyser.frequencyBinCount);
	        analyser.getByteFrequencyData(array);
	        var average = getAverageVolume(array);

	        // get the average for the second channel
	        var array2 =  new Uint8Array(analyser2.frequencyBinCount);
	        analyser2.getByteFrequencyData(array2);
	        var average2 = getAverageVolume(array2);

	        // clear the current state
	        canvasCtx.clearRect(0, 0, 60, 130);

	        // set the fill style
	        canvasCtx.fillStyle=gradient;

	        // create the meters
	        canvasCtx.fillRect(0,130-average,25,130);
	        canvasCtx.fillRect(30,130-average2,25,130);
			*/
			// FREQUENCY ANALYSER

			// get the average for the first channel
	        var array = new Uint8Array(analyser.frequencyBinCount);
	        analyser.getByteFrequencyData(array);

	        // clear the current state
	        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

	        // set the fill style
	        canvasCtx.fillStyle = gradient;

			var toggle = false; 
			var quarter = Math.floor(array.length/4);
			var freq = array;
			// var freq = array.splice(quarter, (array.length - quarter));

	        drawSpectrum(freq);

			function drawSpectrum(freq) {
				var e;
				
				PWG.Utils.each(
					array,
					function(value, idx) {
						// EQ BARS: 
						// canvasCtx.fillRect(idx * 5, 325-value, 3, HEIGHT);
						
						// RADIAL RAINBOW
						if(!outputOnce) {
							if(idx > (quarter) && idx < (array.length - quarter)) {
								// console.log('array length = ' + array.length + ', idx = ' + idx + ', e = '+ (idx - quarter));
							}
						}
						// if(idx < divBoxes.length) {
							// if(idx > array.length/2) {
							if(idx > (quarter) && idx < (array.length - quarter)) {
									var p = 100/radius;
								// e = (idx - (array.length/2));
								// e = idx;
								e = (idx - quarter);
								
								var offset = value;

								var r2 = (offset * p * 7) + min;

								// if(toggle) r2 *= 1.2;

								var x = x0 + r2 * Math.cos(2 * Math.PI * e / items);
								var y = y0 + r2 * Math.sin(2 * Math.PI * e / items);

								divBoxes[e].style.left = x + 'px';
								divBoxes[e].style.top = y + 'px';

								toggle = !toggle;
							}
						// }
						
					},
					module
				);
				outputOnce = true;
			}

			// SPECTOGRAM
	        // get the average for the first channel
			/*
	        var array = new Uint8Array(analyser.frequencyBinCount);
	        analyser.getByteFrequencyData(array);

	        // draw the spectrogram
	        if (sourceNode.playbackState == sourceNode.PLAYING_STATE) {
	            drawSpectrogram(array);
	        }
			*/
		}

		function drawSpectrogram(array) {

			tempCtx.drawImage(canvas, 0, 0, WIDTH, HEIGHT);

			// iterate over the elements from the array
			// var length = array.length/3;
			var length = array.length;
			
			for (var i = 0; i < length; i++) {
				// draw each pixel with the specific color
				var value = array[i];
				tempCtx.fillStyle = PWG.Color.percentToHex(value/512, pc);
				// tempCtx.fillStyle = PWG.Color.percentToHex(value/256, pc);

				// draw the line at the right side of the canvas
				tempCtx.fillRect(WIDTH - 1, HEIGHT - i, 1, 1);
				// tempCtx.fillRect(WIDTH - 1, HEIGHT - (i*3), 1, 3);
				// tempCtx.fillRect(WIDTH - 1, HEIGHT - (i*4), 1, 4);
			}

			// set translate on the canvas
			canvasCtx.translate(-1, 0);
			// draw the copied image
			canvasCtx.drawImage(tempCanvas, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);

			// reset the transformation matrix
			canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
		}
	
	    function setupAudioNodes() {
			jsNode = audioCtx.createScriptProcessor(2048, 1, 1);
			jsNode.connect(audioCtx.destination);

			// SOUND VOLUME
			/* 
			analyser = audioCtx.createAnalyser();
			analyser.smoothingTimeConstant = 0.3;
			analyser.fftSize = 2048;

			analyser2 = audioCtx.createAnalyser();
			analyser2.smoothingTimeConstant = 0.3;
			analyser2.fftSize = 2048;

	        // create a buffer source node
	        sourceNode = audioCtx.createBufferSource();
			splitter = audioCtx.createChannelSplitter();
			
	        // and connect to destination
			// sourceNode.connect(analyser);
			sourceNode.connect(splitter);
			
			splitter.connect(analyser, 0, 0);
			splitter.connect(analyser2, 0, 0);
			*/
			// FREQUENCY ANAYLSER
			analyser = audioCtx.createAnalyser();
			analyser.smoothingTimeConstant = 0.3;
			analyser.fftSize = 1024;
			// analyser.fftSize = 512;
			// analyser.fftSize = 256;
			
	        sourceNode = audioCtx.createBufferSource();
			sourceNode.connect(analyser);

			analyser.connect(jsNode);

	        sourceNode.connect(audioCtx.destination);
	    }

	    // load the specified sound
	    function loadSound(url) {
	        var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.responseType = 'arraybuffer';

	        // When loaded decode the data
	        request.onload = function() {

	            // decode the data
	            audioCtx.decodeAudioData(request.response, function(buffer) {
	                // when the audio is decoded play the sound
	                playSound(buffer);
	            }, onError);
	        }
	        request.send();
	    }


	    function playSound(buffer) {
	        sourceNode.buffer = buffer;
	        sourceNode.start(0);
	    }
	
		function onError(e) {
			trace('error: ', e);
		}
		
	   function getAverageVolume(array) {
	        var values = 0;
	        var average;

	        var length = array.length;

	        // get all the frequency amplitudes
	        for (var i = 0; i < length; i++) {
	            values += array[i];
	        }

	        average = values / length;
	        return average;
	    }
	
		trace('audioCtx = ', audioCtx.currentTime);
		
	};
	
	return module;
}();