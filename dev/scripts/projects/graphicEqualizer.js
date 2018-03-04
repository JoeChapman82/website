(function() {
    "use strict";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var file = document.getElementById("fileInput");
    var controlsWrapper = document.getElementById('controlsWrapper');
    var audio, audioContext, audioSource, analyser, bufferLength, dataArray, barWidth, musicDetails;
    var circleRadius = 100;
    var fftSize = 1024;
    var toSkip = 100;
    var minBarHeight = 10;
    var activeMode = 'demo';
    var reduceBarHeight = false;
    var displayText = 'Work in progress. Choose an audio file below';
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
        random: function() {
            return renderRandomVisualiser();
        },
    };
    setup();

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50;
        circleRadius = canvas.width > canvas.height ? canvas.height / 4 : canvas.width / 4;
        reduceBarHeight = canvas.width > canvas.height ?
            circleRadius * 2 + 255 > canvas.height :
            circleRadius * 2 + 255 > canvas.width;
        barWidth = typeof bufferLength === 'undefined' ? 0 : canvas.width / bufferLength;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    file.onchange = function() {
        var files = this.files;
        addAudioElement();
        audio.onended = function(e) {
            URL.revokeObjectURL(this.src);
        };
        audio.src = URL.createObjectURL(files[0]);
        setDisplayText(files[0].name);
        audio.load();
        audioContext = new AudioContext();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 1024; // check against older machines - each increase near doubles scripting time
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        barWidth = canvas.width / bufferLength;
        activeMode = 'circular';
        audio.play();
    };

    function addAudioElement() {
        controlsWrapper.removeChild(document.getElementById('audioElement'));
        audio = document.createElement('audio');
        audio.controls = true;
        audio.controlsList = 'nodownload';
        audio.classList.add('audio-visualiser-audio-control');
        audio.setAttribute('id', 'audioElement');
        controlsWrapper.appendChild(audio);
        audio.playbackRate = 5;
    }

    function renderBackground() {
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function renderLinearVisualiser() {
        var x = 0;
        ctx.fillStyle = "red";
        analyser.getByteFrequencyData(dataArray);
        for(var i = 0; i < bufferLength; i++) {
            var barHeight = dataArray[i];
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    function renderRandomVisualiser() {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
        analyser.getByteFrequencyData(dataArray);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        for (var i = 0; i < bufferLength; i++) {
            var barHeight = dataArray[i] < minBarHeight ? minBarHeight : dataArray[i];
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

    function renderDemoVisualiser() {
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

    function renderCircularVisualiser() {
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

    function renderMessage() {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.strokeText(displayText, canvas.width / 2, 35);
        ctx.stroke();
    }

    function setDisplayText(name) {
        displayText = name.slice(0, name.lastIndexOf('.'));
    }

    function animate() {
        renderBackground();
        modes[activeMode]();
        renderMessage();
        requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', setup);

})();
