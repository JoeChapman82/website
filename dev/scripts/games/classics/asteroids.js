(function() {
"use strict";
checkRotation();
var canvas = document.getElementById('asteroidsMainCanvas');
var ctx = canvas.getContext('2d');
ctx.font = '56px Arial';
var bgCanvas = document.getElementById('asteroidsBgCanvas');
var bgCtx = bgCanvas.getContext('2d');
var rotateSceen = document.getElementById('rotateScreen');
var landingScreen = document.getElementById('landingScreen');
var playButton = document.getElementById('playButton');
var lastTime = 0;
var deltaTime = 0;
var animation;

var gameInPlay = false;
var isPaused = false;
var gameOver = false;
var level = 1;
var credits = 3;
var score = 0;
var stars;
var starsAmount = 1000;
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var shouldFire = false;
var asteroids = [];
var storage = window.localStorage;
var highscore;
var highscores = [
    {player: 'AAA', score: 500000},
    {player: 'CPU', score: 300000},
    {player: 'JOE', score: 100000},
    {player: 'JIM', score: 25000},
    {player: 'SAL', score: 5000}
];
var highscoreElements = document.querySelectorAll('.asteroids-high-score');

var player = {
    x: canvas.width / 2,
    y: canvas.height /2,
    width: 80,
    height: 50,
    thrust: 4,
    drag: 0.01,
    vx: 0,
    vy: 0,
    maxVelocity: 350,
    rotation: 0,
    fireTimer: 0,
    fireTime: 0.2,
    bullets: false,
    isAlive: true,
    isInvulnerable: true,
    invulnerabilityTimer: 0,
    invulnerabilityTime: 3,
    collider: {x: canvas.width / 2, y: canvas.height /2, radius: 20}
};
var explosions;

function PlayerBullet() {
    this.x = 0;
    this.y = 0;
    this.radius = 5;
    this.rotation = 0;
    this.velocity = 450;
    this.additionalVelocity = 250;
}

PlayerBullet.prototype.update = function() {
    this.x += Math.cos(this.rotation) * (this.velocity * deltaTime);
    this.y += Math.sin(this.rotation) * (this.velocity * deltaTime);
};

PlayerBullet.prototype.render = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
};

function Asteroid() {
    this.x = randomNumber(0, canvas.width);
    this.y = randomNumber(0, canvas.height);
    this.vx = randomFloat(-5, 5);
    this.vy = randomFloat(-5, 5);
    this.radius = 100;
    this.splitsRemaining = 2;
    this.numSides = randomNumber(5, 9);
}

Asteroid.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if(this.x + this.radius < 0 && this.vx < 0) {
        this.x = canvas.width + this.radius;
    } else if(this.x - this.radius > canvas.width && this.vx > 0) {
        this.x = -this.radius;
    } else if(this.y + this.radius < 0 && this.vy < 0) {
        this.y = canvas.height + this.radius;
    } else if(this.y -this.radius > canvas.height && this.vy > 0) {
        this.y = -this.radius;
    }
};

Asteroid.prototype.render = function() {
    ctx.strokeStyle = 'rgba(222, 222, 222, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
    for (var i = 1; i <= this.numSides; i++) {
        ctx.lineTo(this.x + this.radius * Math.cos(i * 2 * Math.PI / this.numSides), this.y + this.radius * Math.sin(i * 2 * Math.PI / this.numSides));
    }
    ctx.stroke();
};


function Explosion() {
    this.debrisAmount = 50;
    this.debrisWidth = 2;
    this.debrisHeight = 2;
    this.debris = [];
    this.time = 1.5;
    this.timer = 0;
}

Explosion.prototype.render = function() {
    ctx.fillStyle = 'rgba(222, 222, 222, 1)';
    for(var i = 0; i < this.debris.length; i++) {
        ctx.beginPath();
        ctx.fillRect(this.debris[i].x, this.debris[i].y, this.debrisWidth, this.debrisHeight);
    }
};

Explosion.prototype.update = function() {
    this.timer += deltaTime;
    for(var i = 0; i < this.debris.length; i++) {
        this.debris[i].x += this.debris[i].vx;
        this.debris[i].y += this.debris[i].vy;
    }
};

function Pool() {
    this.active = [];
    this.pool = [];
    this.default = {};
}

Pool.prototype.setDefaults = function(ob) {
    this.default = ob.defaults;
};

Pool.prototype.getNew = function() {
    if(this.pool.length > 0) {
        var ob = this.pool.pop();
        this.active.push(ob);
        return ob;
    }
        return false;
};

Pool.prototype.free = function(ob) {
    var index = this.active.indexOf(ob);
    this.active.splice(index, 1);
    this.pool.push(ob);
};

function createPools() {
    var asteroidAmount = 2 + level > 10 ? 10 : 2 + level;
    player.bullets = new Pool();
    asteroids = new Pool();
    explosions = new Pool();
    for(var i = 0; i < 60; i++) {
        if(i < 10) {
            player.bullets.pool.push(new PlayerBullet(0, 0));
        }
        if(i < 50) {
            explosions.pool.push(new Explosion());
        }
        if(i < 60) {
            asteroids.pool.push(new Asteroid());
        }
    }
    for(var j = 0; j < asteroidAmount; j++) {
        asteroids.getNew();
    }
}

function setup() {
    renderBackground();
    createPools();
    loadHighscore();
    setDomHighscores();
}

function softReset() {
    createPools();
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.vx = 0;
    player.vy = 0;
    player.isAlive = true;
    player.isInvulnerable = true;
    player.invulnerabilityTimer = 0;
}

function hardReset() {
    createPools();
    credits = 4;
    level = 1;
    gameOver = false;
    score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.vx = 0;
    player.vy = 0;
    player.isAlive = true;
    player.isInvulnerable = true;
    player.invulnerabilityTimer = 0;
}

function pause() {
    isPaused = !isPaused;
}

function renderBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    renderBackdrop();
    generateStars();
    renderStars();
}

function renderBackdrop() {
    bgCtx.beginPath();
    bgCtx.fillStyle = '#000000';
    bgCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateStars() {
    stars = [];
    for(var i = 0; i < starsAmount; i++) {
        stars.push({
            x: randomNumber(0, canvas.width),
            y: randomNumber(0, canvas.height),
            size: 1,
        });
    }
}

function renderStars() {
    for(var i = 0; i < stars.length; i++) {
        var star = stars[i];
        bgCtx.beginPath();
        bgCtx.shadowBlur = Math.floor((Math.random() * 5) + 2);
        bgCtx.shadowColor = "white";
        bgCtx.fillStyle = 'rgba(255, 255, 255,' + Math.random() + ')';
        bgCtx.fillRect(star.x , star.y, star.size, star.size);
        bgCtx.closePath();

    }
}

function updateExplosions() {
    explosions.active.forEach(function(explosion) {
        explosion.update();
        if(explosion.timer > explosion.time) {
            explosions.free(explosion);
        }
    });
}

function updatePlayer() {
    if(player.isInvulnerable) {
        player.invulnerabilityTimer += deltaTime;
        if(player.invulnerabilityTimer >= player.invulnerabilityTime) {
            player.isInvulnerable = false;
        }
    }
    player.fireTimer += deltaTime;
    player.x += player.vx;
    player.y += player.vy;
    if(leftPressed) {
        player.rotation -= 0.05;
        if(player.rotation >= 360) {
            player.rotation = 0;
        }
    } else if(rightPressed) {
        player.rotation += 0.05;
        if(player.rotation <= -360) {
            player.rotation = 0;
        }
    }
    if(upPressed) {
        player.vx += Math.cos(player.rotation) * (player.thrust * deltaTime);
        player.vy += Math.sin(player.rotation) * (player.thrust * deltaTime);
    }
    player.vx -= player.vx > 0 ? player.drag : -player.drag;
    player.vy -= player.vy > 0 ? player.drag : -player.drag;
    if(shouldFire && player.fireTimer >= player.fireTime) {
        var bullet = player.bullets.getNew();
        if(!!bullet) {
            player.fireTimer = 0;
            bullet.x = player.x;
            bullet.y = player.y;
            bullet.rotation = player.rotation;
        }
    }
    player.collider.x = player.x;
    player.collider.y = player.y;
}

function keepPlayerInBounds() {
    if(player.x - player.width / 2 < 0) {
        player.x = player.width / 2;
    } else if(player.x + player.width / 2 > canvas.width) {
        player.x = canvas.width - player.width / 2;
    } else if(player.y - player.width / 2 < 0) {
        player.y = player.width / 2;
    } else if(player.y + player.width / 2 > canvas.height) {
        player.y = canvas.height - player.width / 2;
    }
}

function updatePlayerBullets() {
    for(var j = player.bullets.active.length - 1; j >= 0; j--) {
        player.bullets.active[j].update();
        if(player.bullets.active[j].y + player.bullets.active[j].radius < 0 || player.bullets.active[j].y > canvas.height || player.bullets.active[j].x + player.bullets.active[j].radius < 0 || player.bullets.active[j].x > canvas.width) {
            player.bullets.free(player.bullets.active[j]);
            return;
        } else {
            for(var i = asteroids.active.length - 1; i >= 0; i--) {
                if(isCollidingArcArc(player.bullets.active[j], asteroids.active[i])) {
                    player.bullets.free(player.bullets.active[j]);
                    score += asteroids.active[i].splitsRemaining === 2 ? 100 : asteroids.active[i].splitsRemaining === 1 ? 200 : 100;
                    if(asteroids.active[i].splitsRemaining > 0) {
                        spawnNewAsteroids(asteroids.active[i].x, asteroids.active[i].y, asteroids.active[i].radius / 2, asteroids.active[i].splitsRemaining - 1);
                    }
                    createNewExplosion(asteroids.active[i].x, asteroids.active[i].y);
                    asteroids.free(asteroids.active[i]);
                    return;
                }
            }
        }
    }
}

function updateAsteroids() {
    if(asteroids.active.length === 0) {
        level++;
        softReset();
    }
    for(var i = 0; i < asteroids.active.length; i++) {
        asteroids.active[i].update();
        if(!player.isInvulnerable && isCollidingArcArc(asteroids.active[i], player.collider)) {
            if(credits === 0) {
                gameOver = true;
                if(score > highscore) {
                    saveHighscore();
                    setDomHighscores();
                }
                return;
            }
            credits--;
            if(asteroids.active[i].splitsRemaining > 0) {
                spawnNewAsteroids(asteroids.active[i].x, asteroids.active[i].y, asteroids.active[i].radius / 2, asteroids.active[i].splitsRemaining - 1);
            }
            asteroids.free(asteroids.active[i]);
            player.isInvulnerable = true;
            player.invulnerabilityTimer = 0;
            createNewExplosion(player.x, player.y);
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
            player.vx = 0;
            player.vy = 0;
            return;
        }
    }
}

function createNewExplosion(x, y) {
    var explosion = explosions.getNew();
    if(!!explosion) {
        explosion.debris = [];
        explosion.timer = 0;
        for(var l = 0; l < explosion.debrisAmount; l++) {
            explosion.debris.push({
                x: x,
                y: y,
                vx: randomFloat(-5, 5),
                vy: randomFloat(-5, 5)
            });
        }
    }
}

function spawnNewAsteroids(x, y, radius, splits) {
    for(var i = 0; i < 3; i++) {
        var asteroid = asteroids.getNew();
        if(!!asteroid) {
            asteroid.x = x;
            asteroid.y = y;
            asteroid.radius = radius;
            asteroid.splitsRemaining = splits;
        }
    }
}

function renderAsteroids() {
    asteroids.active.forEach(function(asteroid) {
        asteroid.render();
    });
}

function renderPlayerBullets() {
    ctx.fillStyle = 'rgba(222, 222, 222, 1)';
    player.bullets.active.forEach(function(bullet) {
        bullet.render();
    });
}

function renderExplosions() {
    explosions.active.forEach(function(explosion) {
        explosion.render();
    });
}

function renderPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    if(player.isInvulnerable && parseInt(player.invulnerabilityTimer.toFixed(1).slice(-1)) & 1) {
        ctx.strokeStyle = '#999';
    } else {
        ctx.strokeStyle = '#FFF';
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-player.width / 2, -player.height / 2);
    ctx.lineTo(-player.width / 4, -player.height / 2.8);
    ctx.lineTo(-player.width / 4, player.height / 2.8);
    ctx.moveTo(-player.width / 4, -player.height / 2.8);
    ctx.lineTo(player.width / 2, 0);
    ctx.lineTo(-player.width / 2, player.height / 2);
    if(upPressed) {
        ctx.moveTo(-player.width * 0.375, -player.height / 5);
        ctx.lineTo(-player.width * 0.375, player.height / 5);
        ctx.lineTo(-player.width * 0.6875, 0);
        ctx.lineTo(-player.width * 0.375, -player.height / 5);
        ctx.stroke();
    }
    ctx.stroke();
    ctx.restore();
}

function renderOnScreenText() {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(222, 222, 222, 1)';
    ctx.beginPath();
    ctx.fillText('Level: ' + level, 20, canvas.height - 20);
    ctx.textAlign = 'right';
    ctx.beginPath();
    ctx.fillText('Credits: ' + credits, canvas.width - 20, canvas.height - 20);
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.fillText('Score: ' + score, canvas.width / 2, 60);
    if(isPaused) {
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.beginPath();
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
    if(gameOver) {
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.beginPath();
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'rgba(222, 222, 222, 1)';
        ctx.fillText('Press space or touch to play again', canvas.width / 2, canvas.height / 2 + 75);
    }
}

function setDeltaTime(time) {
    deltaTime = time - lastTime < 250 ? (time - lastTime) / 1000 : 0.0167;
    lastTime = time;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function isCollidingRectRect(ob1, ob2) {
    return ob2.x + ob2.width >= ob1.x && ob2.x <= ob1.x + ob1.width && ob2.y + ob2.height >= ob1.y && ob2.y <= ob1.y + ob1.height;
}

function isCollidingArcArc(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) < a.radius + b.radius;
}

function main(time) {
    setDeltaTime(time);
    if(!isPaused && !gameOver && gameInPlay) {
        clearCanvas();
        updatePlayer();
        updatePlayerBullets();
        updateAsteroids();
        updateExplosions();
        keepPlayerInBounds();
        renderPlayerBullets();
        renderAsteroids();
        renderPlayer();
        renderExplosions();
    }
    renderOnScreenText();
    animation = requestAnimationFrame(main);
}

setup();
animation = requestAnimationFrame(main);

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min + 1) + min;
}

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 37) {
        leftPressed = true;
    } else if(e.keyCode === 39) {
        rightPressed = true;
    } else if(e.keyCode === 38) {
        e.preventDefault();
        upPressed = true;
    } else if(e.keyCode === 40) {
        e.preventDefault();
        downPressed = true;
    } else if(e.keyCode === 32) {
        e.preventDefault();
        if(!gameOver) {
            shouldFire = true;
        } else {
            gameOver = false;
            hardReset();
        }
    } else if(e.keyCode === 80) {
        pause();
    }
});

document.addEventListener('keyup', function(e) {
    if(e.keyCode === 37) {
        leftPressed = false;
    } else if(e.keyCode === 39) {
        rightPressed = false;
    } else if(e.keyCode === 38) {
        upPressed = false;
    } else if(e.keyCode === 40) {
        downPressed = false;
    } else if(e.keyCode === 32) {
        shouldFire = false;
    }
});

canvas.addEventListener('touchstart', function(e) {
    if(e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'A') {
        e.preventDefault();
    }
    if(e.touches[0].clientY <= canvas.width / 2) {
        leftPressed = true;
    } else {
        rightPressed = true;
    }
    shouldFire = true;
}, true);

canvas.addEventListener('touchend', function(e) {
    if(e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'A') {
        e.preventDefault();
    }
    leftPressed = false;
    rightPressed = false;
    shouldFire = false;
}, true);

window.addEventListener('resize', checkRotation);

function checkRotation() {
    if(window.innerWidth < window.innerHeight) {
        rotateScreen.classList.remove('invaders-no-display');
        if(!isPaused) {
            isPaused = true;
        }
    } else if(!rotateScreen.classList.contains('invaders-no-display')) {
        rotateScreen.classList.add('invaders-no-display');
        if(isPaused) {
            isPaused = false;
        }
    }
}

document.getElementById('playButton').addEventListener('click', function() {
    gameInPlay = true;
    landingScreen.classList.add('invaders-no-display');
    var el = document.getElementById('fullScreenWrapper');
    var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try {
        rfs.call(el);
    } catch(error) {
        console.log('no full screen');
    }
});

function saveHighscore() {
    storage.setItem('asteroids', score);
}

function loadHighscore() {
    highscore = storage.getItem('asteroids');
    if(highscore === null) {
        return;
    }
    highscore = parseInt(highscore);
    var position = false;
    highscores.reverse().forEach(function(score, index) {
        if(highscore > score.score) {
            position = index;
        }
    });
    if(position !== false) {
        highscores[position].player = 'YOU';
        highscores[position].score = highscore;
    }
}

function setDomHighscores() {
    highscoreElements.forEach(function(element, index) {
        document.getElementById(element.dataset.player).innerText = highscores[highscores.length - 1 - index].player;
        document.getElementById(element.dataset.score).innerText = highscores[highscores.length - 1 - index].score;
    });
}

}());
