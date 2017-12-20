var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var time, lastTime, deltaTime;
var particles = [];
var particleAmount = 36;
var rotationSpeed = 0.5;
var initialAngle = particleAmount / 2 * Math.PI * particleAmount;
var angleIncrease = rotationSpeed / (particleAmount / 2) * Math.PI / particleAmount;
var increment = initialAngle + angleIncrease;
var offset = 100;
var controls = document.querySelectorAll('.random-canvas-input');
var hasDefaultSettings = true;
var animation;

var particleRadius = 10;
var circleRadius = {
    initial: canvas.width > canvas.height ? canvas.height / 3 : canvas.width / 3,
    max: 0,
    min: 0,
    expansionSpeed: 2,
    variance: 100
};

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
    circleRadius.initial = canvas.width > canvas.height ? canvas.height / 3 : canvas.width / 3;
    circleRadius.max = circleRadius.initial + circleRadius.variance;
    circleRadius.min = circleRadius.initial - circleRadius.variance - offset;
    initialAngle = particleAmount / 2 * Math.PI * particleAmount;
    angleIncrease = rotationSpeed / (particleAmount / 2) * Math.PI / particleAmount;
    increment = initialAngle + angleIncrease;
    particles.length = 0;
    createParticles();
    if(hasDefaultSettings) {
        document.getElementById('particleAmount').value = particleAmount.toString();
        document.getElementById('rotationSpeed').value = rotationSpeed.toString();
        document.getElementById('variance').value = circleRadius.variance.toString();
        document.getElementById('expansionSpeed').value = circleRadius.expansionSpeed.toString();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBackground() {
    ctx.fillStyle = 'rgba(22, 22, 22, 1)';
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function Particle(angle, isAdditionalRadiusIncreasing) {
    this.angle = angle;
    this.radius = particleRadius;
    this.isAdditionalRadiusIncreasing = isAdditionalRadiusIncreasing;
    this.additionalRadius = 0;
    this.setPostion = function() {
        this.x = (circleRadius.initial + this.additionalRadius) * Math.cos(this.angle) + canvas.width / 2;
        this.y = (circleRadius.initial + this.additionalRadius) * Math.sin(this.angle) + canvas.height / 2;
    };
}

function createParticles() {
    for (var i = 0; i < particleAmount; i++) {
        var angle = i / (particleAmount / 2) * Math.PI;
        var isAdditionalRadiusIncreasing = i % 2 === 0;
        particles.push(new Particle(angle, isAdditionalRadiusIncreasing));
        particles[i].setPostion();
    }
}

function updateParticles() {
    particles.forEach(function(particle) {
        particle.additionalRadius += particle.isAdditionalRadiusIncreasing ? circleRadius.expansionSpeed : -circleRadius.expansionSpeed;
        if(circleRadius.initial + particle.additionalRadius >= circleRadius.max || circleRadius.initial + particle.additionalRadius <= circleRadius.min) {
            particle.isAdditionalRadiusIncreasing = !particle.isAdditionalRadiusIncreasing;
        }
        particle.angle += increment;
        particle.setPostion();
    });
}

function renderParticles() {
    particles.forEach(function(particle, index) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, twoPi);
        var gradient = ctx.createRadialGradient(particle.x, particle.y, particle.radius / 3, particle.x, particle.y, particle.radius);
        gradient.addColorStop(0, 'lightblue');
        gradient.addColorStop(1, 'blue');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
        ctx.stroke();
        ctx.fill();
    });
}

function applyUserInput() {
    hasDefaultSettings = false;
    var isAcceptableInput = this.value.length < 4 && parseInt(this.value) <= 1000 && !isNaN(parseInt(this.value));
    if(isAcceptableInput) {
        particleAmount = parseInt(document.getElementById('particleAmount').value);
        rotationSpeed = parseInt(document.getElementById('rotationSpeed').value);
        circleRadius.variance = parseInt(document.getElementById('variance').value);
        circleRadius.expansionSpeed = parseInt(document.getElementById('expansionSpeed').value);
        setup();
    } else {
        this.value = '10';
    }
}

function render(time) {
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    updateParticles();
    renderParticles();
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
