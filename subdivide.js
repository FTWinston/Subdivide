"use strict";

function init() {
	window.addEventListener('resize', handleResize);
	handleResize();
	
	document.onkeydown = function(e) {
		if (e.which == 32)
			beatDown();
	};
	
	document.onkeyup = function(e) {
		if (e.which == 32)
			beatUp();
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
	CountIn: 2,
	Active: 3,
	Finishing: 4,
	Finished: 5,
}

var pressed = false;
var levelNum = 0, warmupLeft = 0, gameState = GameState.NoLevel;
var levels = [], currentLevel = null;

function beatDown() {
	if (pressed)
		return;
	
	switch(gameState) {
		case GameState.NoLevel:
		case GameState.Finished:
			if (levelNum < levels.length)
				moveToLevel(levelNum + 1);
			return;
		case GameState.Warmup:
			startCountIn();
			return;
		case GameState.Active:
		case GameState.CountIn:
			pressed = true;
			drawBeat(false);
			return;
	}
}

function beatUp() {
	if (!pressed || (gameState != GameState.Active && gameState != GameState.CountIn))
		return;
	
	pressed = false;
	
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
	document.getElementById('continuePrompt').setAttribute('style', 'display:none;');
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
	gameState = GameState.CountIn;
	window.clearInterval(countdown);
	
	document.getElementById('countdown').setAttribute('style', 'display:none;');
	document.getElementById('beatIndicator').setAttribute('style', '');
	
	var beatsLeft = currentLevel.timeSigBeats;
	var beatCount = window.setInterval(function() {
		beatsLeft --;
		
		if (currentLevel.showBeats || gameState == GameState.CountIn)
			drawBeat(true);
		
		// TODO: if counting in, show a beat NUMBER to differentiate the count-in from the actual start
		
		if (beatsLeft <= 0) {
			if (gameState == GameState.CountIn) {
				gameState = GameState.Active;
				beatsLeft = currentLevel.getTotalBeats();
			}
			else
			{
				beatUp();
				gameState = GameState.Finishing;
				window.clearInterval(beatCount);
				window.setTimeout(finishLevel, 60000 / currentLevel.tempoBeats * currentLevel.timeSigBeats);
			}
		}
	}, 60000 / currentLevel.tempoBeats);
}

function finishLevel() {
	gameState = GameState.Finished;
	
	document.getElementById('beatIndicator').setAttribute('style', 'display:none;');
	document.getElementById('continuePrompt').setAttribute('style', '');
}

function Level(data) {
	this.timeSigBeats = data.timeSigBeats;
	this.timeSigValue = data.timeSigValue;
	this.tempoNote = data.tempoNote;
	this.tempoBeats = data.tempoBeats;
	this.bars = data.bars;
	this.warmupTime = data.warmupTime !== undefined ? data.warmupTime : 10;
	this.showBeats = data.showBeats !== undefined ? data.showBeats : true;
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

Level.prototype.getTotalBeats = function() {
	return this.timeSigBeats * this.bars.length;
};

var beatFadeStart = undefined, beatFadeDuration = 300, fade = undefined;

function drawBeat(countIn) {
	var ctx = document.getElementById('beatIndicator').getContext('2d');
	ctx.strokeStyle = '#00cc00';
	ctx.fillStyle = '#cc0000';
	ctx.lineWidth = 10;
	ctx.beginPath();
	
	if (fade !== undefined)
		window.cancelAnimationFrame(fade);
	
	if (countIn) {
		ctx.arc(40, 40, 20, 0, Math.PI * 2);
		ctx.fill();
		
		beatFadeStart = performance.now() + 20;
		fade = window.requestAnimationFrame(fadeBeat);
		
		window.navigator.vibrate(25);
	}
	else {
		ctx.arc(40, 40, 30, 0, Math.PI * 2);
		ctx.stroke();
	}
}

function fadeBeat(timestamp) {
	if (beatFadeStart > timestamp) {
		fade = window.requestAnimationFrame(fadeBeat);
		return;
	}
	
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
	if (pressed)
		ctx.arc(40, 40, 22, 0, Math.PI * 2);
	else
		ctx.rect(0, 0, 80, 80);
	ctx.fill();
	ctx.globalAlpha = 1;
}