"use strict";

function init() {
	window.addEventListener('resize', handleResize);
	handleResize();
	
	var pressed = false;
	document.onkeydown = function(e) {
		if (e.which == 32 && !pressed) {
			beatInput();
			pressed = true;
		}
	};
	
	document.onkeyup = function(e) {
		if (e.which == 32)
			pressed = false;
	};
	
	var render = document.getElementById('render');
	render.addEventListener('touchstart', function(e) {
		beatInput();
		e.preventDefault();
	}, false);
}

function handleResize(value, e) {
	var render = document.getElementById('render');
	render.setAttribute('width', window.innerWidth);
	render.setAttribute('height', Math.floor(window.innerHeight * 0.8));
	draw();
}

var bars = [
	['q', 'q', 'qr', 'q'],
	['q', 'qr', 'qr', 'q'],
	['qr', 'q', 'q', 'qr'],
	['qr', 'q', 'q', 'q']
];

var timeSigBeats = 4, timeSigValue = 4;

function draw() {
	var render = document.getElementById('render');
	var width = parseInt(render.getAttribute('width'));
	var inset = width * 0.02, staveWidth = width - inset * 2;
	
	var renderer = new Vex.Flow.Renderer(render, Vex.Flow.Renderer.Backends.CANVAS);
	var ctx = renderer.getContext();
	
	// add initial "bar" just for clef & time signature
	var bar = drawBar(ctx, timeSigBeats, timeSigValue, undefined, inset, 75, true, false);
	staveWidth -= bar.width;
	
	for (var i=0; i<bars.length; i++) {
		var notes = parseNotes(bars[i]);
		var x = bar.width + bar.x;
		bar = drawBar(ctx, timeSigBeats, timeSigValue, notes, x, staveWidth / bars.length, false, i == bars.length - 1);
	}
}

function parseNotes(input) {
	var output = []
	for (var i=0; i<input.length; i++) {
		var val = input[i];
		var rest = val.substr(val.length - 1, 1) == 'r';
		output.push(new Vex.Flow.StaveNote({ keys: [rest ? 'b/4' : 'g/4'], duration: val }));
	}
	return output;
}

function drawBar(ctx, numBeats, beatValue, notes, startX, barWidth, firstBar, lastBar) {
	var stave = new Vex.Flow.Stave(startX, 0, barWidth);
	
	if (firstBar) {
		stave.addClef('treble');
		stave.addTimeSignature(numBeats + '/' + beatValue);
	}
	stave.setBegBarType(firstBar ? Vex.Flow.Barline.type.SINGLE : Vex.Flow.Barline.type.NONE);
	stave.setEndBarType(lastBar ? Vex.Flow.Barline.type.END : firstBar ? Vex.Flow.Barline.type.NONE : Vex.Flow.Barline.type.SINGLE);
	stave.setContext(ctx).draw();
	
	var voice = new Vex.Flow.Voice({
		num_beats: numBeats,
		beat_value: beatValue,
		resolution: Vex.Flow.RESOLUTION
	});
	
	if (firstBar)
		voice.mode = Vex.Flow.Voice.Mode.SOFT;
	else
		voice.addTickables(notes);

	var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], barWidth * 0.95);

	voice.draw(ctx, stave);
	
	var beams = Vex.Flow.Beam.applyAndGetBeams(voice);
	
	beams.forEach(function(beam) {
		beam.setContext(ctx).draw();
	});
	
	return stave;
}

function beatInput() {
	console.log('beat');
}