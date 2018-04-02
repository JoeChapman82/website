const code = {
baseHtml: {
    type: 'html',
    code:
`
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="demonstration"/>
        <meta name="author" content="me"/>
        <title> page name - site name </title>
    </head>
    <body>
        <canvas class="demo-canvas" id="exampleCanvas" width="600" height="300"></canvas>
        <script type="text/javascript" src="example.js"></script>
    </body>
</html>
`
},
full: {
    type: 'javascript',
    code:
`
(function() {
    "use strict";
    var canvas = document.getElementById("demoCanvasTop");
    var ctx = canvas.getContext("2d");
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var width = canvas.width;
    var height = canvas.height;
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var file = document.getElementById("fileInput");
    var musicDetails;
    var circleRadius = width / 10;
    var toSkip = 100;
    var minBarHeight = 10;

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    var bufferLength = analyser.frequencyBinCount;
    var barWidth = width / bufferLength;
    var dataArray = new Uint8Array(bufferLength);
    var audio = document.getElementById('audioElement');
    var audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    file.onchange = function() {
        var files = this.files;
        URL.revokeObjectURL(audio.src);
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
    };

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function renderBackground() {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(44, 44, 44, 1)';
        ctx.fillRect(0, 0, width, height);
    }

    function renderCircularBars() {
        var toVisualise = bufferLength * 0.66 - toSkip;
        ctx.lineWidth = 2;
        analyser.getByteFrequencyData(dataArray);
        ctx.save();
        ctx.translate(halfWidth, halfHeight);
        ctx.rotate((270) * Math.PI / 180);
        for (var i = toSkip; i < toVisualise; i++) {
            var barHeight = dataArray[i] < minBarHeight ? minBarHeight : dataArray[i] * 0.6;
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

    function renderTrackTime() {
        ctx.lineWidth = 1;
        var fontSize = circleRadius * 0.30;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = "rgba(173, 216, 230, .2)";
        var message = isNaN(audio.duration) ? '0:00' : toMinutesAndSeconds(audio.currentTime);
        ctx.beginPath();
        ctx.fillText(message, halfWidth, halfHeight);
    }

    function renderInnerCircle() {
        var circularDurationRadians = 2 * (audio.currentTime / audio.duration);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, .2)";
        ctx.arc(halfWidth, halfHeight, circleRadius * 0.55, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(halfWidth, halfHeight, circleRadius * 0.80, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(173, 216, 230, 0.05)";
        ctx.lineWidth = circleRadius * 0.25;
        ctx.arc(halfWidth, halfHeight, circleRadius * 0.675, 0, circularDurationRadians * Math.PI);
        ctx.stroke();
    }

    function renderCircularVisualiser() {
        renderCircularBars();
        renderInnerCircle();
        renderTrackTime();
    }

    function animate() {
        clearCanvas();
        renderBackground();
        renderCircularVisualiser();
        requestAnimationFrame(animate);
    }

    function toMinutesAndSeconds(timeInSeconds) {
        var minutes = (Math.floor(timeInSeconds / 60)).toString();
        var seconds = (Math.floor(timeInSeconds % 60)).toString();
        seconds = seconds.length === 1 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    animate();
})();
`
}
};

module.exports = code;
