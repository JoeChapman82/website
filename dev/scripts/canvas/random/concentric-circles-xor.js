var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var time, lastTime, deltaTime, circle, animation;
var controls = document.querySelectorAll('.random-canvas-input');
var hasDefaultSettings = true;
var backgroundColour = '#161616';
var primaryColour = '#005000';
var repetitions = 0;


function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup();
    animation = requestAnimationFrame(render);
});

function setup() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    circle = {min: 50, max: canvas.height / 2 - (repetitions * canvas.height / 20), current: 50, increasing: true, increment: 1, innerDifference: 5, colours: []};
    if(hasDefaultSettings) {
        document.getElementById('backgroundColour').value = backgroundColour;
        document.getElementById('foregroundColour').value = primaryColour;
        document.getElementById('repetitions').value = repetitions.toString();
    }
    for(var i = 0; i < repetitions; i++) {
        circle.colours.push(primaryColour, primaryColour);
    }
    circle.colours.push(primaryColour);
    document.body.style.backgroundColor = backgroundColour;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBackground() {
    ctx.fillStyle = backgroundColour;
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

function applyUserInput() {
    hasDefaultSettings = false;
    var isAcceptableInput = this.type === 'range' ? isAcceptedRange(this.value) : isValidHexValue(this.value);
    if(isAcceptableInput) {
        backgroundColour = document.getElementById('backgroundColour').value;
        primaryColour = document.getElementById('foregroundColour').value;
        repetitions = parseInt(document.getElementById('repetitions').value);
        setup();
    } else {
        this.value = this.type === 'range' ? '1' : '#000000';
    }
}

function isAcceptedRange(value) {
    return !isNaN(parseInt(value) && value >= 0 && value <= 4);
}

function isValidHexValue(value) {
    var regex = new RegExp(/^[a-f0-9]+$/);
    return value.charAt(0) === '#' && regex.test(value.substring(1)) && value.length === 7;
}

function render(time) {
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    renderConcentricCircles();
    animation = requestAnimationFrame(render);
}

setup();
animation = requestAnimationFrame(render);

controls.forEach(function(control) {
    control.addEventListener('change', applyUserInput);
});

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('canvasControls').classList.add('js-hidden');
    document.getElementById('openButton').classList.remove('js-hidden');
});

document.getElementById('openButton').addEventListener('click', function() {
    document.getElementById('canvasControls').classList.remove('js-hidden');
    document.getElementById('openButton').classList.add('js-hidden');
});
