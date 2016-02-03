"use strict";

function init() {
	window.addEventListener('resize', handleResize);
	handleResize();
	
	var pressed = false;
	document.onkeydown = function(e) {
		if (e.which == 32 && !pressed) {
			beatDown();
			pressed = true;
		}
	};
	
	document.onkeyup = function(e) {
		if (e.which == 32 && pressed) {
			beatUp();
			pressed = false;
		}
	};
	
	document.getElementById('render').addEventListener('touchstart', beatDown);
	document.getElementById('intro').addEventListener('touchstart', beatDown);
	
	document.getElementById('render').addEventListener('touchend', beatUp);
	document.getElementById('intro').addEventListener('touchend', beatUp);
}

function handleResize(value, e) {
	var render = document.getElementById('render');
	render.setAttribute('width', window.innerWidth);
	render.setAttribute('height', Math.floor(window.innerHeight * 0.8));
	draw();
}

function draw() {
	if (currentLevel == null)
		return;
	
	var render = document.getElementById('render');
	currentLevel.draw(render);
}

var GameState = {
	NoLevel: 0,
	Warmup: 1,
	Active: 2,
	Finished: 3,
}

var levelNum = 0, warmupLeft = 0, gameState = GameState.NoLevel;
var levels = [], currentLevel = null;

function beatDown() {
	switch(gameState) {
		case GameState.NoLevel:
		case GameState.Finished:
			moveToLevel(levelNum + 1);
			return;
		case GameState.Warmup:
			startCountIn();
			return;
		case GameState.Active:
			drawBeat(false);
			return;
	}
}

function beatUp() {
	switch(gameState) {
		case GameState.NoLevel:
		case GameState.Warmup:
			return;
	}
	
	if (fade !== undefined)
		window.cancelAnimationFrame(fade);
	
	beatFadeStart = performance.now();
	fade = window.requestAnimationFrame(fadeBeat);
}

var countdown = null;
function moveToLevel(num) {
	levelNum = num;
	gameState = GameState.Warmup;
	currentLevel = levels[levelNum - 1];
	
	document.getElementById('intro').setAttribute('style', 'display:none;');
	document.getElementById('game').setAttribute('style', '');
	document.getElementById('levelNum').innerHTML = levelNum;
	
	document.getElementById('beatIndicator').setAttribute('style', 'display:none;');
	document.getElementById('countdown').setAttribute('style', '');
	
	document.getElementById('countdownTime').innerHTML = warmupLeft = currentLevel.warmupTime;
	
	draw();
	
	countdown = window.setInterval(function() {
		warmupLeft --;
		document.getElementById('countdownTime').innerHTML = warmupLeft;
		
		if (warmupLeft == 0)
			startCountIn();
	}, 1000);
}

function startCountIn() {
	gameState = GameState.Active;
	window.clearInterval(countdown);
	
	document.getElementById('countdown').setAttribute('style', 'display:none;');
	document.getElementById('beatIndicator').setAttribute('style', '');
	
	var countInBeats = currentLevel.timeSigBeats;
	var countIn = window.setInterval(function() {
		countInBeats --;
		
		drawBeat(true);
		
		if (countInBeats <= 0)
			window.clearInterval(countIn);
	}, 60000 / currentLevel.tempoBeats);
}

function Level(data) {
	this.timeSigBeats = data.timeSigBeats;
	this.timeSigValue = data.timeSigValue;
	this.tempoNote = data.tempoNote;
	this.tempoBeats = data.tempoBeats;
	this.bars = data.bars;
	this.warmupTime = data.warmupTime;
}

Level.prototype.draw = function(canvas) {
	var width = parseInt(canvas.getAttribute('width'));
	var inset = width * 0.02, staveWidth = width - inset * 2;
	
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
	var ctx = renderer.getContext();
	
	// add initial "bar" just for clef & time signature
	var bar = this.drawBar(ctx, [], inset, 75, true, false);
	staveWidth -= bar.width;
	
	for (var i=0; i<this.bars.length; i++) {
		var notes = this.parseNotes(this.bars[i]);
		var x = bar.width + bar.x;
		bar = this.drawBar(ctx, notes, x, staveWidth / this.bars.length, false, i == this.bars.length - 1);
	}
};

Level.prototype.parseNotes = function(input) {
	var output = []
	for (var i=0; i<input.length; i++) {
		var val = input[i];
		var rest = val.substr(val.length - 1, 1) == 'r';
		output.push(new Vex.Flow.StaveNote({ keys: [rest ? 'b/4' : 'g/4'], duration: val }));
	}
	return output;
}

Level.prototype.drawBar = function(ctx, notes, startX, barWidth, firstBar, lastBar) {
	var stave = new Vex.Flow.Stave(startX, 0, barWidth);
	
	if (firstBar) {
		stave.addClef('treble');
		stave.addTimeSignature(this.timeSigBeats + '/' + this.timeSigValue);
		stave.setTempo({duration: this.tempoNote, bpm: this.tempoBeats}, 0);
	}
	stave.setBegBarType(firstBar ? Vex.Flow.Barline.type.SINGLE : Vex.Flow.Barline.type.NONE);
	stave.setEndBarType(lastBar ? Vex.Flow.Barline.type.END : firstBar ? Vex.Flow.Barline.type.NONE : Vex.Flow.Barline.type.SINGLE);
	stave.setContext(ctx).draw();
	
	var voice = new Vex.Flow.Voice({
		num_beats: this.timeSigBeats,
		beat_value: this.timeSigValue,
		resolution: Vex.Flow.RESOLUTION
	});
	
	voice.mode = Vex.Flow.Voice.Mode.SOFT;
	voice.addTickables(notes);

	var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], barWidth * 0.95);
	var beams = Vex.Flow.Beam.applyAndGetBeams(voice);
	
	voice.draw(ctx, stave);
	
	beams.forEach(function(beam) {
		beam.setContext(ctx).draw();
	});
	
	return stave;
};

var beatFadeStart = undefined, beatFadeDuration = 300, fade = undefined;

function drawBeat(countIn) {
	var ctx = document.getElementById('beatIndicator').getContext('2d');
	ctx.strokeStyle = countIn ? '#cc0000' : '#00cc00';
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.arc(40, 40, 30, 0, Math.PI * 2);
	ctx.stroke();
	
	if (fade !== undefined)
		window.cancelAnimationFrame(fade);
	
	if (countIn) {
		beatFadeStart = performance.now();
		fade = window.requestAnimationFrame(fadeBeat);
		
		window.navigator.vibrate(25);
	}
}

function fadeBeat(timestamp) {
	var progress = timestamp - beatFadeStart;

	// overdraw with opacity
	var ctx = document.getElementById('beatIndicator').getContext('2d');
	
	if (progress < beatFadeDuration) {
		fade = window.requestAnimationFrame(fadeBeat);
		ctx.globalAlpha = 0.2;
	}
	else
		fade = beatFadeStart = undefined;
	
	ctx.fillStyle = '#ffffff';
	ctx.beginPath();
	ctx.rect(0, 0, 80, 80);
	ctx.fill();
	ctx.globalAlpha = 1;
}