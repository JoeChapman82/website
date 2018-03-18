(function() {

    "use strict";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var file = document.getElementById("fileInput");
    var controlsWrapper = document.getElementById('controlsWrapper');
    var canvasWidthProperty = 900;
    var canvasWidthRatio = 1;
    var musicDetails, barWidth;
    var circleRadius = 100;
    var toSkip = 100;
    var minBarHeight = 10;
    var activeMode = 'demo';
    var reduceBarHeight = false;
    var displayText = 'Choose an audio file below';
    var trackTimeUp = true;
    var modes = {
        circular: function() {
            return renderCircularVisualiser();
        },
        linear: function() {
            return renderLinearVisualiser();
        },
        demo: function() {
            return renderDemoVisualiser();
        },
        chaos: function() {
            return renderChaosVisualiser();
        },
        concentric: function() {
            return renderConcentricVisualiser();
        },
    };
    var availableModes = ['circular', 'linear', 'chaos', 'concentric'];
    var availableBackgrounds = [0, 1, 2, 3];
    var activeBackground = 0;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // check against older machines - each increase near doubles scripting time
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var audio = document.getElementById('audioElement');
    activeMode = 'circular';
    var audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    setup();

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50;
        canvasWidthRatio = canvas.width / 900;
        circleRadius = canvas.width > canvas.height ? canvas.height / 4 : canvas.width / 4;
        reduceBarHeight = canvas.width > canvas.height ?
            circleRadius * 2 + 255 > canvas.height :
            circleRadius * 2 + 255 > canvas.width;
        barWidth = canvas.width / bufferLength;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    file.onchange = function() {
        var files = this.files;
        URL.revokeObjectURL(audio.src);
        audio.src = URL.createObjectURL(files[0]);
        setDisplayText(files[0].name);
        audio.load();
        activeMode = activeMode === 'demo' ? 'circular' : activeMode;
        audio.play();
    };

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function renderLinearBars() {
        var x = 0;
        ctx.fillStyle = "rgba(173, 216, 230, .15)";
        analyser.getByteFrequencyData(dataArray);
        for(var i = 0; i < bufferLength; i++) {
            var barHeight = dataArray[i];
            ctx.fillRect(x, canvas.height * 0.835 - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    function renderDemoBars() {
        var toVisualise = 150;
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((270) * Math.PI / 180);
        for (var i = 0; i < toVisualise; i++) {
            var barHeight = 10;
            ctx.rotate(Math.PI * 2 / (toVisualise));
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 0, 255, .8)";
            ctx.moveTo(circleRadius, 0);
            ctx.lineTo(circleRadius + barHeight, 0);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.strokeStyle = "rgba(173, 216, 230, .15)";
            ctx.moveTo(circleRadius, 0);
            ctx.lineTo(circleRadius + (barHeight / 3), 0);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }

    function renderChaosBars() {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        analyser.getByteFrequencyData(dataArray);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        for (var i = 0; i < bufferLength; i++) {
            var barHeight = dataArray[i];
            barHeight *= reduceBarHeight ? 0.5 : 0.8;
            var angle = i / (bufferLength / 2) * Math.PI;
            ctx.beginPath();
            ctx.rotate(Math.PI * 2 * angle);
            ctx.moveTo(100, 0);
            ctx.lineTo(100 + barHeight, 0);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }

    function renderCircularBars() {
        var toVisualise = bufferLength * 0.66 - toSkip;
        ctx.lineWidth = 2;
        analyser.getByteFrequencyData(dataArray);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((270) * Math.PI / 180);
        for (var i = toSkip; i < toVisualise; i++) {
            var barHeight = dataArray[i] < minBarHeight ? minBarHeight : dataArray[i];
            barHeight *= reduceBarHeight ? 0.5 : 0.8;
            ctx.rotate(Math.PI * 2 / (toVisualise - toSkip));
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 0, 255, .8)";
            ctx.moveTo(circleRadius, 0);
            ctx.lineTo(circleRadius + barHeight, 0);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.strokeStyle = "rgba(173, 216, 230, .15)";
            ctx.moveTo(circleRadius, 0);
            ctx.lineTo(circleRadius + (barHeight / 3), 0);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }

    function renderConcentricBars() {
        var toVisualise = bufferLength * 0.66 - toSkip;
        var minConcentricRadius = 5;
        ctx.lineWidth = 1;
        analyser.getByteFrequencyData(dataArray);
        var x = 0;
        for (var i = toSkip; i < toVisualise; i++) {
            var concentricRadius = dataArray[i] < minConcentricRadius ? minConcentricRadius : dataArray[i];
            concentricRadius *= reduceBarHeight ? 0.5 : 1;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 0, 255, .3)";
            ctx.beginPath();
            ctx.arc(x, canvas.height / 2, concentricRadius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            x += canvas.width / (toVisualise - toSkip);
        }
    }

    function renderTrackTime() {
        ctx.lineWidth = 1;
        var fontSize = circleRadius * 0.30;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = activeBackground !== 2 ? "rgba(173, 216, 230, .2)" : "rgba(43, 16, 30, .2)";
        var message = trackTimeUp ? toMinutesAndSeconds(audio.currentTime) : isNaN(audio.duration) ? '0:00' : toMinutesAndSeconds(audio.duration - audio.currentTime);
        ctx.beginPath();
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    function renderInnerCircle() {
        var circularDurationDegrees = 360 * (audio.currentTime / audio.duration);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, .2)";
        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * 0.55, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * 0.80, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(173, 216, 230, 0.05)";
        ctx.lineWidth = circleRadius * 0.25;
        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius * 0.675, 0, degreesToRadians(circularDurationDegrees));
        ctx.stroke();
    }

    function renderMessage() {
        ctx.lineWidth = 2;
        var fontSize = canvasWidthRatio > 1 ? 30 * canvasWidthRatio : 40 * canvasWidthRatio;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = getMessageColour();
        ctx.beginPath();
        ctx.fillText(displayText, canvas.width / 2, 35);
    }

    function getMessageColour() {
        return activeBackground !== 2 ? 'rgba(177, 177, 177, .5)' : 'rgba(44, 44, 44, .5)';
    }

    function setDisplayText(name) {
        displayText = name.slice(0, name.lastIndexOf('.'));
    }

    function renderLinearVisualiser() {
        renderLinearBars();
    }

    function renderConcentricVisualiser() {
        renderConcentricBars();
    }

    function renderChaosVisualiser() {
        renderChaosBars();
        renderTrackTime();
    }

    function renderDemoVisualiser() {
        renderDemoBars();
        renderInnerCircle();
        renderTrackTime();
    }

    function renderCircularVisualiser() {
        renderCircularBars();
        renderInnerCircle();
        renderTrackTime();
    }

    function animate() {
        clearCanvas();
        modes[activeMode]();
        renderMessage();
        requestAnimationFrame(animate);
    }

    function toMinutesAndSeconds(timeInSeconds) {
        var minutes = (Math.floor(timeInSeconds / 60)).toString();
        var seconds = (Math.floor(timeInSeconds % 60)).toString();
        seconds = seconds.length === 1 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    animate();

    function changeMode() {
        activeMode = availableModes[(availableModes.indexOf(activeMode) + 1) % availableModes.length];
    }

    function changeBackground() {
        document.getElementById('audioVisualiserBackground').classList.remove('audio-visualiser-bg-' + activeBackground);
        activeBackground = (activeBackground + 1) % availableBackgrounds.length;
        document.getElementById('audioVisualiserBackground').classList.add('audio-visualiser-bg-' + activeBackground);
    }

    function changeTimer() {
        trackTimeUp = !trackTimeUp;
    }

    function shouldCloseControls(e) {
        return !document.getElementById('audioVisualiserControls').contains(e.target) ? closeControls() : false;
    }

    function openControls() {
        this.classList.add('js-hidden');
        document.getElementById('audioVisualiserControls').classList.remove('js-hidden');
    }

    function closeControls() {
        document.getElementById('audioVisualiserControls').classList.add('js-hidden');
        document.getElementById('audioVisualiserOpenButton').classList.remove('js-hidden');
    }

    window.addEventListener('resize', setup);
    document.getElementById('audioVisualiserOpenButton').addEventListener('click', openControls);
    document.getElementById('audioVisualiserCloseButton').addEventListener('click', closeControls);
    document.getElementById('audioVisualiserModeButton').addEventListener('click', changeMode);
    document.getElementById('audioVisualiserBackgroundButton').addEventListener('click', changeBackground);
    document.getElementById('audioVisualiserTimerButton').addEventListener('click', changeTimer);
    document.addEventListener('click', shouldCloseControls, true);

    document.getElementById('fileInput').addEventListener('click', function() {
        var el = document.getElementById('audioVisualiserWrapper');
        var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        try {
            rfs.call(el);
        } catch(error) {
            console.log('no full screen');
        }
    });


})();
