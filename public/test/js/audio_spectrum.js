// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();



var audioVisual = document.getElementById('audio-visual');
console.log(wrap);
// canvas stuff
var canvas = document.getElementById('c');
canvas_context = canvas.getContext('2d');

// audio stuff
var audio = new Audio();
var audioSrc = 'http://ia601007.us.archive.org/18/items/NodeUp54_20131107/NodeUp54.mp3';
audio.src = audioSrc;
audio.controls = true;
audio.autoplay = true;
audio.id = 'a';
audioVisual.appendChild(audio);

// analyser stuff
var context = new webkitAudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 2048;
 
// connect the stuff up to eachother
var source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);
freqAnalyser();
 
 
// draw the analyser to the canvas
function freqAnalyser() {
 window.requestAnimFrame(freqAnalyser);
  var sum;
  var average;
  var bar_width;
  var scaled_average;
	var num_bars = 60;
  var data = new Uint8Array(2048);
  analyser.getByteFrequencyData(data);
  
  // clear canvas
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  var bin_size = Math.floor(data.length / num_bars);
  for (var i = 0; i < num_bars; i += 1) {
    sum = 0;
    for (var j = 0; j < bin_size; j += 1) {
      sum += data[(i * bin_size) + j];
    }
  	average = sum / bin_size;
  	bar_width = canvas.width / num_bars;
  	scaled_average = (average / 256) * canvas.height;
  	canvas_context.fillRect(i * bar_width, canvas.height, bar_width - 2, - scaled_average);
	}
}