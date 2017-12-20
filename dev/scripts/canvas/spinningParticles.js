var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var time, lastTime, deltaTime;
var particles = [];
var particleAmount = 36;
var speed = 1;
var initialAngle = particleAmount / 2 * Math.PI * particleAmount;
var angleIncrease = speed / (particleAmount / 2) * Math.PI / particleAmount;
var increment = initialAngle + angleIncrease;
var particleRadius = 10;
var circleRadius = {
    initial: canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2,
    max: 0,
    min: 0,
    increment: 5,
    variance: 100
};
var mouse = {
    x: 0,
    y: 0,
};

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
    circleRadius.initial = canvas.width > canvas.height ? canvas.height / 2.5 : canvas.width / 2.5;
    circleRadius.max = circleRadius.initial + circleRadius.variance;
    circleRadius.min = circleRadius.initial - circleRadius.variance;
    particles.length = 0;
    createParticles();
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
    this.x = 0;
    this.y = 0;
    this.angle = angle;
    this.radius = particleRadius;
    this.isAdditionalRadiusIncreasing = isAdditionalRadiusIncreasing;
    this.additionalRadius = 0;
    this.collider = {
        x: 0,
        y: 0,
        width: this.radius * 4,
        height: this.radius * 4,
    };
    this.setPostion = function() {
        this.x = (circleRadius.initial + this.additionalRadius) * Math.cos(this.angle) + canvas.width / 2;
        this.y = (circleRadius.initial + this.additionalRadius) * Math.sin(this.angle) + canvas.height / 2;
        this.collider.x = this.x - this.radius * 2;
        this.collider.y = this.y - this.radius * 2;
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
        particle.angle += increment;
        if(isCollidingMouseRect(particle.collider) || particle.additionalRadius !== 0) {
            particle.additionalRadius += particle.isAdditionalRadiusIncreasing ? circleRadius.increment : -circleRadius.increment;
            if(circleRadius.initial + particle.additionalRadius >= circleRadius.max || circleRadius.initial + particle.additionalRadius <= circleRadius.min) {
                particle.isAdditionalRadiusIncreasing = !particle.isAdditionalRadiusIncreasing;
            }
        }
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
        ctx.fill();
        ctx.beginPath();
    });
}

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = e.clientX - rect.left - root.scrollLeft;
    mouse.y = e.clientY - rect.top - root.scrollTop;
}

function isCollidingMouseRect(ob) {
    return mouse.x >= ob.x && mouse.x <= ob.x + ob.width && mouse.y >= ob.y && mouse.y <= ob.y + ob.height;
}

function render(time) {
    setDeltaTime(time);
    clearCanvas();
    renderBackground();
    updateParticles();
    renderParticles();
    animation = requestAnimationFrame(render);
}

document.addEventListener('mousemove', getMousePosition);
setup(canvas);
animation = requestAnimationFrame(render);
