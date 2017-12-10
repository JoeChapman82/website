var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var time, lastTime, deltaTime, circle;

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup(canvas);
    animation = requestAnimationFrame(render);
});

function setup(canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    circle = {min: 50, max: 225, current: 50, increasing: true, increment: 1, innerDifference: 5, colours: ['#005000', '#005a00', '#005a00', '#005000', '#005a00', '#005a00', '#005000', '#005a00', '#005a00']};
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBackground() {
    ctx.fillStyle = 'rgba(244, 244, 244, 0.1)';
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function renderConcentricCircles() {
    ctx.globalCompositeOperation = 'xor';
    circle.current += circle.increasing ? circle.increment : -circle.increment;
    for(var i = 0; i < circle.colours.length; i++) {
        ctx.fillStyle = circle.colours[i];
        for(var j = 0; j * 25 < canvas.width + 25; j++) {
            ctx.beginPath();
            ctx.arc(j * 25, canvas.height / 2, circle.current - (circle.innerDifference * i), 0, twoPi);
            ctx.fill();
        }
    }
    ctx.globalCompositeOperation = 'source-over';
    circle.increasing = circle.current > circle.min && circle.current < circle.max ? circle.increasing : !circle.increasing;
}

function renderTitle() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(104, 104, 104, 1)';
    ctx.font = '72px comic-sans';
    ctx.fillText('Concentric circles', canvas.width / 2, 72);
    ctx.textAlign = 'start';
}

function render(time) {
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    renderConcentricCircles();
    renderTitle();
    animation = requestAnimationFrame(render);
}

setup(canvas);
animation = requestAnimationFrame(render);
