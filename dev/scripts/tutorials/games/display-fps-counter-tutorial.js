var canvas = document.getElementById('demoCanvas');
var canvas2 = document.getElementById('demoCanvas2');
var ctx = canvas.getContext('2d');
ctx.font = '6vmin Impact';
var ctx2 = canvas2.getContext('2d');

var lastTime = 0;
var deltaTime = 0;
var executionTime = 0;
var animation;
var fps = 0;

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

function updateFps() {
    fps = (1 / deltaTime).toFixed(1);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBackground() {
    ctx.fillStyle = 'rgba(22, 22, 22, 1)';
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function renderFps() {
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText(fps + ' FPS', 10, canvas.height - 10);
    ctx.textAlign = 'end';
    ctx.fillText(executionTime + ' ms', canvas.width - 10, canvas.height - 10);
    ctx.textAlign = 'start';
}

function main(time) {
    var startTime = performance.now();
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    updateFps();
    renderFps();
    var endTime = performance.now();
    executionTime = (endTime - startTime).toFixed(1);
    ctx2.drawImage(canvas, 0, 0);
    animation = requestAnimationFrame(main);
}

animation = requestAnimationFrame(main);
