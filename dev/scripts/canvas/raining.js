var canvas = document.getElementById('rainCanvas');
var ctx = canvas.getContext('2d');
var bgCanvas = document.getElementById('lightningCanvas');
var bgCtx = bgCanvas.getContext('2d');

var columns;
var raindrops;
var centralTextOpacity = 0.0005;
var isIncreasing = true;
var binary = ['0', '1'];
var fontSize = 6;
var message = 'Coming soon';
var lastTime = 0;
var deltaTime = 0;

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup(canvas);
    animation = requestAnimationFrame(draw);
});

function setup(canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    columns = canvas.width / fontSize;
    raindrops = [];
    for(var i = 0; i < columns; i++) {
        raindrops[i] = -Math.random() * 100;
    }
}

function drawCentralText() {
    var centralTextFontSize = canvas.width > 500 ? 72 : Math.floor((canvas.width) / message.length);
    centralTextOpacity += isIncreasing ? 0.0005 : -0.0005;
    isIncreasing = centralTextOpacity > 0.05 || centralTextOpacity < 0 ? !isIncreasing : isIncreasing;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(104, 104, 104,' + centralTextOpacity +')';
    ctx.font = centralTextFontSize + 'px comic-sans';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'start';
}

function drawRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.font = fontSize + 'px arial';
    for(var i = 0; i < raindrops.length; i++) {
        var text = binary[Math.floor(Math.random() * binary.length)];
        ctx.fillText(text, i * fontSize, raindrops[i] * fontSize);
        if(raindrops[i] * fontSize > canvas.height && Math.random() > 0.97) {
            raindrops[i] = 0;
        }
        raindrops[i]++;
    }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

function draw(time) {
    setDeltaTime(time);
    // foreground canvas
    drawRain();
    drawCentralText();
    animation = requestAnimationFrame(draw);
}

setup(canvas);
animation = requestAnimationFrame(draw);
