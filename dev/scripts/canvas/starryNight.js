// canvas
var bgCanvas = document.getElementById('timescapeBackgroundCanvas');
var bgCtx = bgCanvas.getContext('2d');
var canvas = document.getElementById('timescapeForegroundCanvas');
var ctx = canvas.getContext('2d');
// timers
var lastTime = 0;
var deltaTime = 0;
var runTime = 0;
// measurements
var worldWidth = 16;
var worldHeight = 9;
var horizontalUnit = 0;
var verticalUnit = 0;
// keyboard handlers
var upPressed = false;
var downPressed  = false;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var twoPi = 2 * Math.PI;
// mouseHandlers
var mouse = {
    x: 0,
    y: 0,
    isOnFire: false
};
// buttons
var buttons = [];
var repositionableItems = [];
var originalPositions = [];
// stars
var starsAmount = 1000;
var twinklingStarsAmount = 75;
var shootingStarTrail = 3;
var stars = [];
var twinklingStars = [];
var shootingStars = [];
// fire
var fireParticles = [];
var maxFireParticles = 30;
var fireSpeed = 2;
var fireParticleSize = 10;
// raindrops
var rainParticles = [];
var maxRainParticles = 1000;
// backgrounds and scenery
var stones = [{x: 2, y: 0.83}, {x: 2.25, y: 0.93}, {x: 1.75, y: 0.93}, {x: 1.85, y: 1.08}, {x: 2.15, y: 1.08}];
var mountains = [];
var hedges = [];
// images needed immediately
var tree = new Image();
tree.src = '/images/tree.png';
var tent = new Image();
tent.src = '/images/tent.png';
// thought bubble
var thoughtBubbleHeight = 0;
var isThoughtBubbleHeightIncreasing = true;
var thoughtMessages = [['This site gives', 'free cookies.', 'Nom nom nom']];
var activeThought = 0;
var thoughtFontHeight = 24;

setup();

var character = {
    x: ww(5),
    y: wh(3),
    width: 176,
    height: 212,
    activeState: 'sleeping',
    isFacingForwards: true,
    isJumping: false,
    jumpTimer: 0,
    jumpTime: 1,
    walking: {image: new Image(), frames: 10, framesPerImage: 6, fullwidth: 1860, fullHeight: 222, width: 176, height: 212, currentFrame: 0, displayedFor: 0, vx: 4},
    walkingReverse: {image: new Image(), frames: 10, framesPerImage: 6, fullwidth: 1860, fullHeight: 222, width: 176, height: 212, currentFrame: 0, displayedFor: 0, vx: 4},
    jumping: {image: new Image(), frames: 10, framesPerImage: 7, fullwidth: 1760, fullHeight: 212, width: 176, height: 212, currentFrame: 0, displayedFor: 0, vy: 4},
    jumpingReverse: {image: new Image(), frames: 10, framesPerImage: 7, fullwidth: 1760, fullHeight: 212, width: 176, height: 212, currentFrame: 0, displayedFor: 0, vy: 4},
    idle: {image: new Image(), frames: 10, framesPerImage: 7, fullwidth: 1760, fullHeight: 212, width: 176, height: 212, currentFrame: 0, displayedFor: 0, idleFor: 0},
    idleReverse: {image: new Image(), frames: 10, framesPerImage: 7, fullwidth: 1760, fullHeight: 212, width: 176, height: 212, currentFrame: 0, displayedFor: 0, idleFor: 0},
    sleeping: {image: new Image(), frames: 1, framesPerImage: 7, fullwidth: 283, fullHeight: 225, width: 283, height: 225, currentFrame: 0, displayedFor: 0
    },
};
character.sleeping.image.src = '/images/sleeping.png';
character.walking.image.src = '/images/walking.png';
character.walkingReverse.image.src = '/images/walkingReverse.png';
character.idle.image.src = '/images/idle.png';
character.idleReverse.image.src = '/images/idleReverse.png';
character.jumping.image.src = '/images/jumping.png';
character.jumpingReverse.image.src = '/images/jumpingReverse.png';
var fireHitBox = {
    x: ww(1.75),
    y: wh(1.35),
    width: 50,
    height: 50
};

repositionableItems.push(character);
repositionableItems.push(fireHitBox);


function setupButtons() {
    buttons = [];
    document.querySelectorAll('#homeScreenButton1, #homeScreenButton2, #homeScreenButton3, #homeScreenButton4').forEach(function(button, index) {
        buttons.push({
            button: button,
            isOnFire: false,
            rect: button.getBoundingClientRect()
        });
    });
}

function setup() {
    getStartingPositions(repositionableItems);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    horizontalUnit = canvas.width / worldWidth;
    verticalUnit = canvas.height / worldHeight;
    recalculatePositions(repositionableItems);
    generateRain();
    generateStars();
    generateMountains();
    renderBackdrop();
    renderStars();
    generateTwinklingStars();
    addKeyboardListeners();
    addMouseListeners();
    setupButtons();
}

function getStartingPositions(items) {
    originalPositions = [];
    items.forEach(function(item) {
        originalPositions.push({x: item.x / horizontalUnit, y: (canvas.height - item.y) / verticalUnit});
    });
}

function recalculatePositions(items) {
    items.forEach(function(item, index) {
        item.x = ww(originalPositions[index].x);
        item.y = wh(originalPositions[index].y);
    });
}

function ww(num) {
    return num * horizontalUnit;
}

function wh(num) {
    return canvas.height - num * verticalUnit;
}

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    runTime += deltaTime;
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ellipse(ctx, cx, cy, rx, ry, fill){
    ctx.save();
    ctx.beginPath();
    ctx.translate(cx - rx, cy - ry);
    ctx.scale(rx, ry);
    ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
    ctx.restore();
    ctx.fillStyle = fill;
    ctx.fill();
}

function renderGround() {
    ctx.strokeStyle = '#1A1710';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, wh(1.75));
    ctx.lineTo(ww(16), wh(1.75));
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, wh(2));
    ctx.stroke();
    ctx.fillStyle = '#1A1710';
    ctx.fill();
    ctx.closePath();
}

function renderHedges() {
    ctx.fillStyle = '#003c00';
    for(var i = 0; i * 25 < canvas.width + 25; i++) {
        ctx.beginPath();
        ctx.arc(i * 25, wh(1.9), 20, 0, twoPi);
        ctx.fill();
    }
    ctx.fillStyle = '#002800';
    for(var j = 0; j * 25 < canvas.width + 25; j++) {
        ctx.beginPath();
        ctx.arc(j * 25, wh(1.9), 15, 0, twoPi);
        ctx.fill();
    }
    ctx.rect(0, wh(1.9), canvas.width, 20);
    ctx.fill();
}

function generateMountains() {
    mountains = [];
    var x = 0;
    var y = 5;
    mountains.push({x: x, y: y});
    while(x < 16) {
        x += Math.random() / 10;
        y = Math.random() > 0.5 && y < 5 ? y + Math.random() / 10 : y > 4 ? y - Math.random() / 10 : y + Math.random() / 10;
        mountains.push({x: x, y: y});
    }
}

function renderMountains() {
    ctx.strokeStyle = '#0C0D09';
    ctx.fillStyle = '#0C0D09';
    ctx.beginPath();
    ctx.moveTo(ww(0), wh(4));
    ctx.lineTo(ww(0), wh(4));
    for(var i = 0; i < mountains.length; i++) {
        ctx.lineTo(ww(mountains[i].x), wh(mountains[i].y));
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, wh(4));
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function renderTree() {
    ctx.drawImage(tree, ww(11), wh(4.75), 300, 350);
}

function renderTent() {
    ctx.drawImage(tent, ww(6.5), wh(4), 233, 295);
}

/******************
fire
*******************/
function FireParticle(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 0;
}

function updateFire() {
    for (var k = 0; k < 8; k++) {
        fireParticles.push(new FireParticle(ww(2), wh(1), (Math.random() * 2 * fireSpeed - fireSpeed) / 2, 0 - Math.random() * 2 * fireSpeed));
        if(mouse.isOnFire) {
            fireParticles.push(new FireParticle(mouse.x, mouse.y, (Math.random() * 2 * fireSpeed - fireSpeed) / 2, 0 - Math.random() * 2 * fireSpeed));
        }
    }
    for(var j = 0; j < 4; j++) {
        buttons.forEach(function(button) {
            if(button.isOnFire) {
                fireParticles.push(
                    new FireParticle(button.rect.x, button.rect.y, (Math.random() * 2 * fireSpeed - fireSpeed) / 2, 0 - Math.random() * 2 * fireSpeed),
                    new FireParticle(button.rect.x + button.rect.width, button.rect.y, (Math.random() * 2 * fireSpeed - fireSpeed) / 2, 0 - Math.random() * 2 * fireSpeed)
                );
            }
        });
    }
    for (var i = 0; i < fireParticles.length; i++) {
        fireParticles[i].x += fireParticles[i].vx;
        fireParticles[i].y += fireParticles[i].vy;
        fireParticles[i].life++;
        if (fireParticles[i].life >= maxFireParticles) {
            fireParticles.splice(i, 1);
            i--;
        }
    }
}

function renderFire() {
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < fireParticles.length; i++) {
        ctx.fillStyle = "rgba(" + (260 - (fireParticles[i].life * 2)) + "," + ((fireParticles[i].life * 2) + 50) + "," + (fireParticles[i].life * 2) + "," + (((maxFireParticles - fireParticles[i].life) / maxFireParticles) * 0.4) + ")";
        ctx.beginPath();
        ctx.arc(fireParticles[i].x, fireParticles[i].y, (maxFireParticles - fireParticles[i].life) / maxFireParticles * (fireParticleSize / 2) + (fireParticleSize / 2), 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
}

function renderFireBase() {
    var gradient = ctx.createRadialGradient(ww(2), wh(0), 200, ww(2), ww(1), 200);
    gradient.addColorStop(0, 'rgba(225, 225, 224, 0.1)');
    gradient.addColorStop(1, 'rgba(225, 225, 0, 0.05)');
    ellipse(ctx, ww(2), wh(1), 150, 40, gradient);
    ellipse(ctx, ww(2), wh(1), 200, 50, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = '#8B8D7A';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for(var i = 0; i < stones.length; i++) {
        ctx.beginPath();
        ellipse(ctx, ww(stones[i].x), wh(stones[i].y), i === 0 ? 17 : 15, i === 0 ? 8 : 7, '#8B8D7A');
        ctx.fill();
        ctx.stroke();
    }
}

/******************
stars
******************/
function renderBackdrop() {
    var nightGradient = bgCtx.createLinearGradient(0, 0, 0, canvas.height - 100);
    nightGradient.addColorStop(0, '#00111e');
    nightGradient.addColorStop(1, '#04263d');
    bgCtx.fillStyle = nightGradient;
    bgCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateStars() {
    stars = [];
    for(var i = 0; i < starsAmount; i++) {
        stars.push({
            x: randomNumber(0, canvas.width),
            y: randomNumber(0, canvas.height / 2),
            size: 1,
        });
    }
}

function generateTwinklingStars() {
    twinklingStars = [];
    for(var i = 0; i < twinklingStarsAmount; i++) {
        twinklingStars.push({
            x: randomNumber(0, canvas.width),
            y: randomNumber(0, canvas.height / 2),
            size: 1,
            opacity: 0,
            increasing: true
        });
    }
}

function generateShootingStars() {
    if(randomNumber(0, 2000) > 1980) {
      shootingStars.push({
          x: randomNumber(0, canvas.width),
          y: randomNumber( 0, canvas.height / 3),
          vx: (Math.random() * 20 - 10),
          vy: randomNumber(1, 3),
          size: Math.random() * 1,
          decay: Math.random() * 2 + 0.5,
          opacity: 0.2,
          color: "255,235,255"
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

function renderTwinklingStars() {
    for(var i = 0; i < twinklingStars.length; i++) {
        var star = twinklingStars[i];
        star.opacity = star.increasing ? star.opacity + 0.01 : star.opacity - 0.01;
        ctx.beginPath();
        ctx.shadowBlur = Math.floor((Math.random() * 5) +5);
        ctx.shadowColor = "white";
        ctx.fillStyle = "rgba(255, 255, 255," + star.opacity + ")";
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        if(star.opacity > 1 || star.opacity < 0 || Math.random() > 0.95) {
            star.increasing = !star.increasing;
        }
    }
    ctx.shadowBlur = 0;
}

function renderShootingStars() {
    for(var i = 0; i < shootingStars.length - 1; i++) {
        var star = shootingStars[i];
        if(typeof(star) !== 'undefined' && star.decay > 0 ) {
            for(var j = 0; j < shootingStarTrail; j++) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(" + star.color + "," + (i = 0 ? star.opacity : star.opacity * (1 - i / shootingStarTrail)) + ")";
                ctx.arc(star.x - (star.vx * i), star.y - (star.vy * i), 1, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
            star.decay -= 0.01;
            star.x += star.vx;
            star.y += star.vy;
            if(star.decay < 1) {
                star.opacity -= 0.01;
            } else if(star.opacity < 1) {
                star.opacity += 0.05;
            }
      } else {
          shootingStars.splice(i, 1);
      }
    }
}

/********************
Weather
*******************/
function generateRain() {
    rainParticles = [];
    for(var i = 0; i < maxRainParticles; i++) {
      rainParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        height: Math.random() * 1,
        vx: -4 + Math.random() * 4 + 2,
        vy: Math.random() * 10 + 10
    });
    }
}

function renderRain() {
  for(var i = 0; i < rainParticles.length; i++) {
    var raindrop = rainParticles[i];
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.moveTo(raindrop.x, raindrop.y);
    ctx.lineTo(raindrop.x + raindrop.height * raindrop.vx, raindrop.y + raindrop.height * raindrop.vy);
    ctx.stroke();
  }
}

function updateRain() {
  for(var i = 0; i < rainParticles.length; i++) {
    var raindrop = rainParticles[i];
    raindrop.x += raindrop.vx;
    raindrop.y += raindrop.vy;
    if(raindrop.x > canvas.width || raindrop.y > canvas.height) {
      raindrop.x = Math.random() * canvas.width;
      raindrop.y = -20;
    }
  }
}

/*****************
Main player
****************/
function updateCharacter() {
    if(upPressed && !character.isJumping) {
        character.activeState = 'jumping';
        character.isJumping = true;
        character.jumping.currentFrame = 0;
    }
    if(character.isJumping) {
        if(rightPressed) {
            character.isFacingForwards = true;
            character.activeState = 'jumping';
            character.x += character.walking.vx;
        } else if(leftPressed) {
            character.isFacingForwards = false;
            character.activeState = 'jumpingReverse';
            character.x -= character.walking.vx;
        }
        character.jumpTimer += deltaTime;
        if(character.jumpTimer < character.jumpTime / 2) {
            character.y -= character.jumping.vy;
        } else {
            character.y += character.jumping.vy;
        }
        if(character.jumpTimer > character.jumpTime) {
            character.activeState = character.isFacingForwards ? 'idle' : 'idleReverse';
            character.isJumping = false;
            character.jumpTimer = 0;
        }
        return;
    }
    if(rightPressed) {
        character.isFacingForwards = true;
        character.activeState = 'walking';
        character.isJumping = false;
        character.x += character.walking.vx;
    } else if(leftPressed) {
        character.isFacingForwards = false;
        character.activeState = 'walkingReverse';
        character.x -= character.walking.vx;
    } else {
        character.idle.idleFor = character.activeState !== 'idle' ? 0 : character.idle.idleFor += deltaTime;
        character.activeState = character.idle.idleFor > 60 ? 'sleeping' : character.activeState;
        character.activeState = character.activeState === 'sleeping' ? 'sleeping' : character.isFacingForwards ? 'idle' : 'idleReverse';
    }
}

function renderCharacter() {
    ctx.drawImage(
    character[character.activeState].image, // the image
    character[character.activeState].currentFrame * character[character.activeState].fullwidth / character[character.activeState].frames, // top left x of source image to take sub image from
    0, // top left y of source image to take sub image from
    character[character.activeState].fullwidth / character[character.activeState].frames, // width of sub image within spritesheet
    character[character.activeState].fullHeight, // height of sub image within spritesheet
    character.x, // pos x of sub image
    character.y, // pos y of sub image
    character[character.activeState].width, // scale x
    character[character.activeState].height); // scale y

    character[character.activeState].displayedFor++;
    if(character[character.activeState].displayedFor === character[character.activeState].framesPerImage) {
        character[character.activeState].displayedFor = 0;
        character[character.activeState].currentFrame = ++character[character.activeState].currentFrame % character[character.activeState].frames;
    }
    if(character.activeState === 'sleeping') {
        renderCharacterThoughts();
    }
}

function renderCharacterThoughts() {
    var x = character.x;
    var y = character.y - character.height / 4 - (thoughtBubbleHeight);
    isThoughtBubbleHeightIncreasing = thoughtBubbleHeight <= 30 && thoughtBubbleHeight >= 0 ? isThoughtBubbleHeightIncreasing : !isThoughtBubbleHeightIncreasing;
    thoughtBubbleHeight = isThoughtBubbleHeightIncreasing ? thoughtBubbleHeight += 0.5 : thoughtBubbleHeight -= 0.5;
    var bubbleHeights = [character.y + character.height / 2, character.y + character.height / 2.5 - thoughtBubbleHeight / 2, character.y + character.height / 4 - thoughtBubbleHeight];
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for(var i = 0; i < bubbleHeights.length; i++) {
        ctx.beginPath();
        ctx.arc(i % 2 === 0 ? character.x + character.width / 3 : character.x + character.width / 3 + 10, bubbleHeights[i], 5 + i * 5, 0, twoPi);
        ctx.stroke();
        ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 40, y + 20, x - 40, y + 70, x + 60, y + 70);
    ctx.bezierCurveTo(x + 80, y + 100, x + 150, y + 100, x + 170, y + 70);
    ctx.bezierCurveTo(x + 250, y + 70, x + 250, y + 40, x + 220, y + 20);
    ctx.bezierCurveTo(x + 260, y - 40, x + 200, y - 50, x + 170, y - 30);
    ctx.bezierCurveTo(x + 150, y - 75, x + 80, y - 60, x + 80, y - 30);
    ctx.bezierCurveTo(x + 30, y - 75, x - 20, y - 60, x, y);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = thoughtFontHeight + 'px Comic Sans MS';
    for(var j = 0; j < thoughtMessages[activeThought].length; j ++) {
        ctx.fillText(thoughtMessages[activeThought][j], x + 110, y + j * thoughtFontHeight);
    }
}

function basicAI() {
    if(mouse.isOnFire && isCollidingMouseRect(character)) {
        if(mouse.x < character.x + character.width / 2) {
            rightPressed = true;
            setTimeout(function() {
                rightPressed = false;
            }, 500);
        } else {
            leftPressed = true;
            setTimeout(function() {
                leftPressed = false;
            }, 500);
        }
    }
}
/**************
Collision detection and collision events
***************/
function isCollidingMouseRect(ob) {
    return mouse.x >= ob.x && mouse.x <= ob.x + ob.width && mouse.y >= ob.y && mouse.y <= ob.y + ob.height;
}

function keepCharacterInBounds() {
    character.x = character.x < canvas.width - 150 ? character.x : canvas.width - 150;
    character.x = character.x > 0 ? character.x : 0;
    character.y = character.y < 550 ? character.y : 550;
}

function handleMousePointer() {
    if(isCollidingMouseRect(fireHitBox)) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'auto';
    }
}

function setFire() {
    if(mouse.isOnFire) {
        buttons.forEach(function(button) {
            if(!button.isOnFire) {
                button.isOnFire = isCollidingMouseRect(button.rect);
            }
        });
    }
}

/*****************
Event listeners
******************/
window.addEventListener('resize', function() {
        cancelAnimationFrame(animation);
        setup();
        animation = requestAnimationFrame(draw);
});

window.addEventListener('orientationchange', function() {
    cancelAnimationFrame(animation);
    setup();
    animation = requestAnimationFrame(draw);
});

function addKeyboardListeners() {
    keyDownListeners();
    keyUpListeners();
}

function addMouseListeners() {
    document.addEventListener('mousemove', getMousePosition);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
}

function addTouchListeners() {
    document.addEventListener('touchmove', getTouchPosition);
    document.addEventListener('touchstart', touchDown);
    document.addEventListener('touchEnd', touchUp);
}

function getTouchPosition(e) {
    var touch = e.touches[0];
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = touch.clientX - rect.left - root.scrollLeft;
    mouse.y = touch.clientY - rect.top - root.scrollTop;
}

function touchDown() {
    var touch = e.touches[0];
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = touch.clientX - rect.left - root.scrollLeft;
    mouse.y = touch.clientY - rect.top - root.scrollTop;
    mouse.isOnFire = isCollidingMouseRect(fireHitBox);
}

function touchUp() {
    mouse.isOnFire = false;
}

function mouseDown() {
    mouse.isOnFire = isCollidingMouseRect(fireHitBox);
}

function mouseUp() {
    mouse.isOnFire = false;
}

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouse.x = e.clientX - rect.left - root.scrollLeft;
    mouse.y = e.clientY - rect.top - root.scrollTop;
}

function keyDownListeners() {
    document.addEventListener('keydown', function(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    } else if(e.keyCode === 37) {
        leftPressed = true;
    } else if(e.keyCode === 38) {
        e.preventDefault();
        upPressed = true;
    } else if(e.keyCode === 40) {
        e.preventDefault();
        downPressed = true;
    } else if(e.keyCode === 32) {
        e.preventDefault();
        spacePressed = true;
    } else if(e.keyCode === 80) {
        pause();
    }
  });
}

function keyUpListeners() {
    document.addEventListener('keyup', function(e) {
    if(e.keyCode === 39) {
      rightPressed = false;
    } else if(e.keyCode === 37) {
      leftPressed = false;
    } else if(e.keyCode === 38) {
        upPressed = false;
    } else if(e.keyCode === 40) {
        downPressed = false;
    } else if(e.keyCode === 32) {
        e.preventDefault();
        spacePressed = false;
    }
    });
}

/***************
Main draw function
***************/
function draw(time) {
    setDeltaTime(time);
    clearCanvas();
    generateShootingStars();
    renderTwinklingStars();
    renderShootingStars();
    renderMountains();
    renderGround();
    renderHedges();
    renderTree();
    renderTent();
    renderFireBase();
    updateFire();
    renderFire();
    setFire();
    handleMousePointer();
    basicAI();
    updateCharacter();
    keepCharacterInBounds();
    renderCharacter();
    // updateRain();
    // renderRain();
    animation = requestAnimationFrame(draw);
}

animation = requestAnimationFrame(draw);
