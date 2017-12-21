var canvas = document.getElementById('demoCanvas');
var ctx = canvas.getContext('2d');

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
    ctx.fillText(fps + ' FPS', canvas.width / 2, canvas.height / 2);
    ctx.fillText(executionTime + ' ms', canvas.width / 2, canvas.height / 2 + 50);
}

function main(time) {
    var start = performance.now();
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    updateFps();
    renderFps();
    var end = performance.now();
    executionTime = (end - start).toFixed(2);
    animation = requestAnimationFrame(main);
}

animation = requestAnimationFrame(main);
