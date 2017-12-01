var canvas = document.getElementById('rainCanvas');
var ctx = canvas.getContext('2d');
var bgCanvas = document.getElementById('lightningCanvas');
var bgCtx = bgCanvas.getContext('2d');

var columns;
var raindrops;
var centralTextOpacity = 0.0005;
var isIncreasing = true;
var binary = ['0', '1'];
var bolts = [];
var fontSize = 6;
var message = 'Coming soon';
var lastTime = 0;
var deltaTime = 0;
var isFlashing = false;
var boltAmount = 10;
var flashTimer = 0;
var flashDuration = 0.5;
var isFlashIncreasing = true;
var lightningSpeed = 100;

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

function handleFlash() {
    if(!isFlashing) {
        isFlashing = Math.random() > 0.995;
    } else {
        flashTimer += deltaTime;
        isFlashIncreasing = flashTimer < flashDuration / 2;
        if(flashTimer > flashDuration) {
            flashTimer = 0;
            isFlashing = !isFlashing;
            for(var i = 0; i < boltAmount; i++) {
                createBolt();
            }
        }
    }
}

function drawFlash() {
    if(isFlashing) {
        bgCtx.fillStyle = isFlashIncreasing ? 'rgba(220,220,220, 1)' : 'rgba(0, 0, 0, 0.1)';
        bgCtx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        bgCtx.fillStyle = 'rgba(0, 0, 0, 1)';
        bgCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawLightning() {
    bolts.forEach(function(bolt) {
        if(bolt.forks.length === 0) {
            bolt.x += 10;
            bolt.y += lightningSpeed;
        }
            bgCtx.beginPath();
            bgCtx.moveTo(bolt.startX, bolt.startY);
            bgCtx.lineTo(bolt.x, bolt.y);
            bgCtx.lineWidth = bolt.weight;
            bgCtx.strokeStyle = '#FFFF99';
            bgCtx.stroke();
            bgCtx.closePath();
            if(!bolt.hasForked) {
                bolt.forks.push(createFork(bolt.x, bolt.y, bolt.weight));
                bolt.hasForked = true;
            }
        bolt.forks.forEach(function(fork, index) {
            if(fork[0].y > bgCanvas.height || fork[1].y > bgCanvas.height) {
                bolts.splice(bolts.indexOf(bolt), 1);
                return;
            }
            if(!fork[0].hasForked && (fork[0].y > bolt.maxForkHeight * (index + 1) || fork[1].y > bolt.maxForkHeight * (index + 1))) {
                fork[0].hasForked = true;
                fork[1].hasForked = true;
                bolt.forks.push(createFork(fork[0].x, fork[0].y, fork[0].weight));
                bolt.forks.push(createFork(fork[1].x, fork[1].y, fork[1].weight));
            }
            if(!fork[0].hasForked) {
                fork[0].x += fork[0].xv;
                fork[0].y += lightningSpeed;
                fork[1].x -= fork[0].xv;
                fork[1].y += lightningSpeed;
            }
            bgCtx.beginPath();
            bgCtx.moveTo(fork[0].startX, fork[0].startY);
            bgCtx.lineTo(fork[0].x, fork[0].y);
            bgCtx.lineWidth = bolt.forkWeight;
            bgCtx.strokeStyle = '#FFFF99';
            bgCtx.stroke();
            bgCtx.closePath();
            bgCtx.beginPath();
            bgCtx.moveTo(fork[1].startX, fork[1].startY);
            bgCtx.lineTo(fork[1].x, fork[1].y);
            bgCtx.lineWidth = fork[0].weight;
            bgCtx.strokeStyle = '#FFFF99';
            bgCtx.stroke();
            bgCtx.closePath();
        });
    });
}

function createFork(x, y, weight) {
    var fork1 = {
        startX: x,
        startY: y,
        x: x,
        y: y,
        xv: randomNumber(3, 70),
        weight: weight - 1,
        hasForked: false
    };
    var fork2 = {
        startX: x,
        startY: y,
        x: x,
        y: y,
        xv: randomNumber(3, 30),
        weight: weight - 1,
        hasForked: false,
    };
    return [fork1, fork2];
}

function createBolt() {
    var startX = Math.random() * (bgCanvas.width - bgCanvas.width / 10) + bgCanvas.width / 10;
    var startY = 0;
    var bolt = {
        startX: startX,
        startY: startY,
        x: startX,
        y: startY,
        forks: [],
        maxForks: 5,
        maxForkHeight: bgCanvas.height / 5,
        weight: 5,
        hasForked: false
    };
    bolts.push(bolt);
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
    // backgroundCanvas
    handleFlash();
    drawFlash();
    drawLightning();
    // foreground canvas
    drawRain();
    drawCentralText();
    animation = requestAnimationFrame(draw);
}

setup(canvas);
animation = requestAnimationFrame(draw);
