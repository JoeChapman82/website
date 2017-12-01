var canvas = document.getElementById('starryNightCanvas');
var ctx = canvas.getContext('2d');
var lastTime = 0;
var deltaTime = 0;
var worldWidth = 16;
var worldHeight = 9;
var horizontalUnit = 0;
var verticalUnit = 0;

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup(canvas);
    animation = requestAnimationFrame(draw);
});

function setup(canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    horizontalUnit = canvas.width / worldWidth;
    verticalUnit = canvas.height / worldHeight;
    makeStars(15);
}

function ww(num) {
    return num * horizontalUnit;
}

function wh(num) {
    return num * verticalUnit;
}

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawStar(cx, cy, spikes, outerRadius, innerRadius){
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for(var i = 0; i < spikes; i++){
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x,y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x,y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'goldenrod';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
}

var stars = [];

function makeStars(num) {
    for(var i = 0; i < num; i++) {
        stars.push({x: ww(randomNumber(0, 16)), y: wh(randomNumber(0, 3)), a: 5, b: 5, c: 2.5});
    }
}

function drawStars() {
    stars.forEach(function(s) {
        drawStar(s.x, s.y, s.a, s.b, s.c);
    });
}

function draw(time) {
    setDeltaTime(time);
    clearCanvas();
    drawStars();
    animation = requestAnimationFrame(draw);
}

setup(canvas);
animation = requestAnimationFrame(draw);
