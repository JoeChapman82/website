(function() {
"use strict";
checkRotation();
var canvas = document.getElementById('invadersMainCanvas');
var ctx = canvas.getContext('2d');
ctx.font = '56px Arial';
var bgCanvas = document.getElementById('invadersBgCanvas');
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
var credits = 4;
var score = 0;
var stars;
var starsAmount = 1000;
var leftPressed = false;
var rightPressed = false;
var enemies = [];
var defenses = [];

var cannonImage = new Image();
var enemyImages = {
    "1-1": new Image(),
    "1-2": new Image(),
    "2-1": new Image(),
    "2-2": new Image(),
    "3-1": new Image(),
    "3-2": new Image(),
    special: new Image()
};
enemyImages["1-1"].src = '/images/games/classics/space-invaders/invader-1-1.png';
enemyImages["1-2"].src = '/images/games/classics/space-invaders/invader-1-2.png';
enemyImages["2-1"].src = '/images/games/classics/space-invaders/invader-2-1.png';
enemyImages["2-2"].src = '/images/games/classics/space-invaders/invader-2-2.png';
enemyImages["3-1"].src = '/images/games/classics/space-invaders/invader-3-1.png';
enemyImages["3-2"].src = '/images/games/classics/space-invaders/invader-3-2.png';
enemyImages.special.src = '/images/games/classics/space-invaders/invaderSpecial.png';
cannonImage.src = '/images/games/classics/space-invaders/cannon.png';
var imageCycle = 1;
var enemyDetails = {
    initialOffset: 200,
    widths: [50, 70, 90],
    height: 50,
    movementX: 25,
    movementY: 35,
    rows: 5,
    perRow: 11,
    movingForward: true,
    spacingX: 60,
    spacingY: 30,
    initialFireChance: 0.0001,
    fireChance: 0.0001
};
var enemyInitialMoveTime = 0.85;
var enemyMoveTime = 0.85;
var enemyMoveTimer = 0;
var specialEnemyTime = 10;
var specialEnemyTimer = 0;
var specialEnemyInPlay = false;
var shouldFire = false;
var playerBullets;
var enemyBullets;
var explosions;
var playerFireTime = 0.25;
var playerFireTimer = 0;
var player = {
    x: 300,
    y: canvas.height - 55,
    width: 150,
    height: 30,
    vx: 250
};
var specialEnemy = {
    x: canvas.width,
    y: 50,
    width: 125,
    height: 40,
    vx: 4,
    isAlive: true
};

function PlayerBullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.vy = 10;
}

PlayerBullet.prototype.update = function() {
    this.y -= this.vy;
};

PlayerBullet.prototype.render = function() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
};

function EnemyBullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 35;
    this.vy = 5;
}

EnemyBullet.prototype.update = function() {
    this.y += this.vy;
};

EnemyBullet.prototype.render = function() {
    ctx.beginPath();
    ctx.moveTo(this.x + (this.width / 2), this.y);
    ctx.lineTo(this.x + this.width, this.y + (this.height / 4));
    ctx.lineTo(this.x, this.y + ((this.height / 4) * 2));
    ctx.lineTo(this.x + this.width, this.y + ((this.height / 4) * 3));
    ctx.lineTo(this.x + (this.width / 2), this.y + this.height);
    ctx.stroke();
};

function Explosion() {
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    this.timer = 0.2;
}

Explosion.prototype.render = function() {
    ctx.strokeStyle = 'rgba(166, 166, 166, 1)';
    ctx.moveTo(this.x, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.moveTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.stroke();
};

Explosion.prototype.update = function() {
    this.timer -= deltaTime;
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

function createBulletPools() {
    playerBullets = new Pool();
    enemyBullets = new Pool();
    for(var i = 0; i < 3; i++) {
        playerBullets.pool.push(new PlayerBullet(0, 0));
    }
    for(var k = 0; k < 100; k++) {
        enemyBullets.pool.push(new EnemyBullet(0, 0));
    }
}

function createExplosionPools() {
    explosions = new Pool();
    for(var i = 0; i < 50; i++) {
        explosions.pool.push(new Explosion());
    }
}

function setup() {
    renderBackground();
    createWave();
    createDefenses();
    createBulletPools();
    createExplosionPools();
}

function softReset() {
    enemyMoveTime = enemyInitialMoveTime;
    enemyMoveTimer = 0;
    createWave();
    createDefenses();
    createBulletPools();
    createExplosionPools();
}

function hardReset() {
    createWave();
    createDefenses();
    createBulletPools();
    createExplosionPools();
    credits = 3;
    level = 1;
    gameOver = false;
    score = 0;
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

function createWave() {
    enemies = [];
    for(var i = 1; i <= enemyDetails.rows; i++) {
        for(var j = 1; j <= enemyDetails.perRow; j++) {
            var offset = i === 1 ? 10 : i === 2 || i === 3 ? 0 : -10;
            enemies.push({
                x: j * (enemyDetails.widths[1] + enemyDetails.spacingX) - enemyDetails.widths[1] + enemyDetails.initialOffset + offset,
                y: i * ((enemyDetails.height + enemyDetails.spacingY) - enemyDetails.spacingY + 30),
                width: enemyDetails.widths[i === 1 ? 0 : i === 2 || i === 3 ? 1 : 2],
                height: enemyDetails.height,
                type: i === 1 ? '1' : i === 2 || i === 3 ? '2' : '3',
                isAlive: true,
            });
        }
    }
}

function createDefenses() {
    defenses = [];
    for(var i = 0; i < 4; i++) {
        defenses.push({
            x: 200 + (i * 200) + (230 * i),
            y: canvas.height - 250,
            width: 220,
            height: 130,
            pieces: [],
        });
    }
    defenses.forEach(function(defense) {
        for(var j = 0; j < 5; j++) {
            for(var k = 0; k < 4; k++) {
                defense.pieces.push({
                    x: defense.x + (j * (defense.width / 5)),
                    y: defense.y + (k * (defense.height / 4)),
                    width: defense.width / 5,
                    height: (defense.height / 4) + 2,
                    hitpoints: 3
                });
            }

        }
    });
}

function updatePlayer() {
    player.x += leftPressed ? -Math.floor(player.vx * deltaTime) : rightPressed ? Math.floor(player.vx * deltaTime) : 0;
    playerFireTimer += deltaTime;
    if(shouldFire && playerFireTimer >= playerFireTime) {
        var bullet = playerBullets.getNew();
        if(bullet !== false) {
            playerFireTimer = 0;
            bullet.x = player.x + (player.width / 2) - (bullet.width / 2);
            bullet.y = player.y;
        }
    }
}

function updatePlayerBullets() {
    playerBullets.active.forEach(function(bullet) {
        bullet.update();
        if(bullet.y + bullet.height < 0) {
            playerBullets.free(bullet);
        }
        for(var i = 0; i < enemies.length; i++) {
            if(enemies[i].isAlive && isCollidingRectRect(bullet, enemies[i])) {
                playerBullets.free(bullet);
                enemies[i].isAlive = false;
                score += enemies[i].type === '1' ? 300 : enemies[i].type === '2' ? 200 : 100;
                enemyMoveTime -= 0.015;
                var explosion = explosions.getNew();
                if(explosion !== false) {
                    explosion.x = enemies[i].x + (enemies[i].width / 4);
                    explosion.y = enemies[i].y + (enemies[i].height / 4);
                    explosion.timer = 0.2;
                }
                return;
            }
        }
        if(isCollidingRectRect(bullet, specialEnemy)) {
            specialEnemy.isAlive = false;
            score += 1000;
            var ex = explosions.getNew();
            if(ex !== false) {
                ex.x = specialEnemy.x + specialEnemy.width / 2;
                ex.y = specialEnemy.y;
                ex.timer = 0.2;
            }
        }

        defenses.forEach(function(defense) {
            for(var i = 0; i < defense.pieces.length; i++) {
                if(defense.pieces[i].hitpoints > 0 && isCollidingRectRect(bullet, defense.pieces[i])) {
                    defense.pieces[i].hitpoints = 0;
                    playerBullets.free(bullet);
                    return;
                }
            }
        });
    });
}

function updateEnemyBullets() {
    var playerHit = false;
    enemyBullets.active.forEach(function(bullet) {
        bullet.update();
        if(bullet.y > canvas.height) {
            enemyBullets.free(bullet);
        } else if(isCollidingRectRect(bullet, player)) {
            enemyBullets.free(bullet);
            playerHit = true;
        }
        defenses.forEach(function(defense) {
            for(var i = 0; i < defense.pieces.length; i++) {
                if(defense.pieces[i].hitpoints > 0 && isCollidingRectRect(bullet, defense.pieces[i])) {
                    defense.pieces[i].hitpoints--;
                    enemyBullets.free(bullet);
                    return;
                }
            }
        });
    });
    if(playerHit) {
        if(credits > 0) {
            credits--;
            softReset();
        } else {
            gameOver = true;
        }
    }
}

function updateExplosions() {
    explosions.active.forEach(function(explosion) {
        explosion.update();
        if(explosion.timer < 0) {
            explosions.free(explosion);
        }
    });
}

function renderPlayerBullets() {
    playerBullets.active.forEach(function(bullet) {
        bullet.render();
    });
}

function renderExplosions() {
    explosions.active.forEach(function(explosion) {
        explosion.render();
    });
}

function renderEnemyBullets() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    enemyBullets.active.forEach(function(bullet) {
        bullet.render();
    });
}

function keepPlayerInBounds() {
    if(player.x < 0) {
        player.x = 0;
    } else if(player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function renderPlayer() {
    ctx.beginPath();
    ctx.drawImage(cannonImage, player.x, player.y - 20, player.width, player.height + 20);
}

function updateEnemies() {
    var playerHit = false;
    var shouldMove = false;
    enemyMoveTimer += deltaTime;
    if(enemyMoveTimer >= enemyMoveTime) {
        enemyMoveTimer = 0;
        shouldMove = true;
    }
    if(shouldMove) {
        imageCycle++;
        var shouldChangeDirection = false;
        var offset;
        enemies.forEach(function(enemy) {
            if(enemy.isAlive) {
                enemy.x += enemyDetails.movingForward ? enemyDetails.movementX : -enemyDetails.movementX;
                if(enemy.x <= 0) {
                    offset = enemy.x;
                    shouldChangeDirection = true;
                } else if(enemy.x + enemy.width >= canvas.width) {
                    offset = enemy.x + enemy.width - canvas.width;
                    shouldChangeDirection = true;
                }
                if(isCollidingRectRect(player, enemy) || enemy.y + enemy.height > canvas.height) {
                    playerHit = true;
                }
                for(var i = 0; i < defenses.length; i++) {
                    for(var k = 0; k < defenses[i].pieces.length; k++) {
                        if(defenses[i].pieces[k].hitpoints > 0) {
                            if(isCollidingRectRect(enemy, defenses[i].pieces[k])) {
                                defenses[i].pieces[k].hitpoints = 0;
                            }
                        }
                    }
                }
            }
        });
        if(shouldChangeDirection) {
            enemies.forEach(function(enemy) {
                enemy.x -= offset;
                enemy.y += enemyDetails.movementY;
            });
            enemyDetails.movingForward = !enemyDetails.movingForward;
        }
    }
    enemies.forEach(function(enemy) {
        if(enemy.isAlive && Math.random() < enemyDetails.fireChance) {
            var bullet = enemyBullets.getNew();
            if(bullet !== false) {
                bullet.x = enemy.x + (enemy.width / 2);
                bullet.y = enemy.y + enemy.height;
            }
        }
    });
    if(playerHit) {
        if(credits > 0) {
            credits--;
            softReset();
        } else {
            gameOver = true;
        }
    }
    // special enemy
    if(!specialEnemyInPlay) {
        specialEnemyTimer += deltaTime;
        if(specialEnemyTimer >= specialEnemyTime) {
            specialEnemyInPlay = true;
        }
    } else {
        specialEnemy.x -= specialEnemy.vx;
        if(specialEnemy.x + specialEnemy.width < 0 || !specialEnemy.isAlive) {
            specialEnemy.x = canvas.width;
            specialEnemyInPlay = false;
            specialEnemyTimer = 0;
            specialEnemy.isAlive = true;
        }
    }
}

function renderDefenses() {
    defenses.forEach(function(defense) {
        defense.pieces.forEach(function(piece) {
            if(piece.hitpoints > 0) {
                ctx.fillStyle = piece.hitpoints === 3 ? 'rgba(188, 188, 188, 1)' : piece.hitpoints >= 2 ? 'rgba(144, 144, 144, 1)' : 'rgba(102, 102, 102, 1)';
                ctx.beginPath();
                ctx.rect(piece.x, piece.y, piece.width, piece.height);
                ctx.fill();
            }
        });
    });
}

function renderEnemies() {
    enemies.forEach(function(enemy, index) {
        if(enemy.isAlive) {
            ctx.beginPath();
            if(imageCycle % 2 === 0) {
                ctx.drawImage(enemyImages[enemy.type + '-1'], enemy.x, enemy.y, enemy.width, enemy.height);
            } else {
                ctx.drawImage(enemyImages[enemy.type + '-2'], enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
    });
    ctx.beginPath();
    ctx.drawImage(enemyImages.special, specialEnemy.x, specialEnemy.y, specialEnemy.width, specialEnemy.height);
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

function checkStageCompletion() {
    var levelComplete = true;
    enemies.forEach(function(enemy) {
        if(enemy.isAlive) {
            levelComplete = false;
        }
    });
    if(levelComplete) {
        level++;
        if(level.toString().slice(-1) === '1') {
            enemyDetails.fireChance = enemyDetails.initialFireChance;
        } else {
            enemyDetails.fireChance += 0.0002;
        }
        softReset();
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

function main(time) {
    setDeltaTime(time);
    if(!isPaused && !gameOver && gameInPlay) {
        clearCanvas();
        updatePlayer();
        updateEnemies();
        updatePlayerBullets();
        updateEnemyBullets();
        updateExplosions();
        keepPlayerInBounds();
        renderPlayerBullets();
        renderPlayer();
        renderDefenses();
        renderExplosions();
        renderEnemyBullets();
        renderEnemies();
        checkStageCompletion();
    }
    renderOnScreenText();
    requestAnimationFrame(main);
}

setup();
animation = requestAnimationFrame(main);

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 37) {
        leftPressed = true;
    } else if(e.keyCode === 39) {
        rightPressed = true;
    } else if(e.keyCode === 32) {
        e.preventDefault();
        if(gameOver) {
            hardReset();
        } else {
            shouldFire = true;
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

}());
