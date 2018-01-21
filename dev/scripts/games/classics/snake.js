var canvas = document.getElementById('snakeCanvas');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var lastTime = 0;
var deltaTime = 0;
var animation;
var clicksMade = 0;

// main game
var snake = {
    x: 0,
    y: 0,
    width: 25,
    height: 25,
    direction: 'right',
    bodyLength: 5,
    body: [],
    hasChangedDirection: true
};
var SnakeBody = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = ww(0.5);
    this.height = ww(0.5);
};

var score = 0;
var highScore = getHighScore();
document.getElementById('highScore').innerText = 'Highscore: ' + highScore;
var difficulty = 'easy';
var difficulties = ['easy', 'medium', 'hard'];
var directions = ['right', 'down', 'left', 'up'];
var isAlive = false;
var movementTimer = 0;
var movementTime = difficulty === 'hard' ? 0.5 : difficulty === 'medium' ? 0.1 : 0.2;

var Apple = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = ww(0.5);
    this.height = ww(0.5);
    this.score = 10;
    this.scoreTimer = 0;
    this.scoreTime = difficulty === 'hard' ? 0.5 : difficulty === 'medium' ? 0.75 : 1;
};
var apples = [];

// measurements
var worldWidth = 16;
var worldHeight = 9;
var horizontalUnit = 0;
var verticalUnit = 0;
var ww = function(num) {
    return num * horizontalUnit;
};
var wh = function(num) {
    return canvas.height - num * verticalUnit;
};

// screens
var screens = {
    titleScreen: function() {
        return titleScreen();
    },
    gameScreen: function() {
        return gameScreen();
    },
    settingsScreen: function() {
        return settingsScreen();
    },
    howToScreen: function() {
        return howToScreen();
    },
    pauseScreen: function() {
        return pauseScreen();
    },
    gameOverScreen: function() {
        return gameOverScreen();
    }
};
var activeScreen = 'titleScreen';

function setup() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    horizontalUnit = canvas.width / worldWidth;
    worldHeight = canvas.height / ww(1);
    verticalUnit = canvas.height / worldHeight;
    snake.width = ww(0.5);
    snake.height = ww(0.5);
}

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function renderBackground() {
    ctx.fillStyle = 'rgba(22, 22, 22, 1)';
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
}

function showHideUiElements(uiElement) {
    if(document.getElementById(uiElement)) {
        document.getElementById(uiElement).classList.toggle('js-hidden');
    }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// game screen specific functions
function startGame() {
    setup();
    isAlive = true;
    hasMoved = false;
    clicksMade = 0;
    snake.length = 1;
    snake.direction = 'right';
    snake.x = 0;
    snake.y = ww(4);
    snake.body = [];
    score = 0;
    snake.bodyLength = 5;
    movementTime = difficulty === 'hard' ? 0.05 : difficulty === 'medium' ? 0.1 : 0.2;
    spawnApple();
}

function spawnApple() {
    apples.length = 0;
    var isValidPlacement = true;
    var apple = new Apple(ww(Math.round(randomNumber(0, worldWidth - 0.5))), ww(Math.round(randomNumber(0, worldHeight - 0.5))));
    if(isCollidingRectRect(apple, snake)) {
        isValidPlacement = false;
    }
    for(var i = 0; i < snake.body.length; i++) {
        if(isCollidingRectRect(apple, snake.body[i])) {
            isValidPlacement = false;
        }
    }
    if(isValidPlacement) {
        apples.push(apple);
    } else {
        spawnApple();
    }
}

function updateSnake() {
    movementTimer += deltaTime;
    if(isAlive && movementTimer >= movementTime) {
        snake.hasChangedDirection = true;
        movementTimer = 0;
        snake.body.push(new SnakeBody(snake.x, snake.y));
        switch(snake.direction) {
            case 'right':
                snake.x += snake.width;
                break;
            case 'left':
                snake.x -= snake.width;
                break;
            case 'up':
                snake.y -= snake.height;
                break;
            case 'down':
                snake.y += snake.height;
                break;
        }
        if(isCollidingRectRect(snake, apples[0])) {
            score += apples[0].score;
            snake.bodyLength++;
            spawnApple();
        }
        if(isPassedWorldsEnd(snake)) {
            isAlive = false;
            if(score > highScore && isInteger(score) && score < 10000) {
                setHighScore(score);
            }
            changeGivenScreen('gameOverScreen');
        }
        for(var i = 0; i < snake.body.length; i++) {
            if(isCollidingRectRect(snake, snake.body[i])) {
                isAlive = false;
                changeGivenScreen('gameOverScreen');
            }
        }
        if(snake.body.length > snake.bodyLength) {
            snake.body.shift();
        }
    }
}

function renderSnake() {
    if(!isAlive) {
        return;
    }
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.rect(snake.x, snake.y, snake.width, snake.height);
    ctx.fill();
    ctx.stroke();

    snake.body.forEach(function(bodypart) {
        ctx.beginPath();
        ctx.fillStyle = 'lightgreen';
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.rect(bodypart.x, bodypart.y, bodypart.width, bodypart.height);
        ctx.rect(bodypart.x + bodypart.width / 4, bodypart.y + bodypart.height / 4, bodypart.width / 2, bodypart.height / 2);
        ctx.moveTo(bodypart.x + bodypart.width / 4, bodypart.y + bodypart.height / 4);
        ctx.lineTo(bodypart.x + bodypart.width - bodypart.width / 4, bodypart.y + bodypart.height - bodypart.height / 4);
        ctx.moveTo(bodypart.x + bodypart.width - bodypart.width / 4, bodypart.y + bodypart.height / 4);
        ctx.lineTo(bodypart.x + bodypart.width / 4, bodypart.y + bodypart.height - bodypart.height / 4);
        ctx.fill();
        ctx.stroke();
    });
}

function updateApples() {
    apples.forEach(function(apple) {
        apple.scoreTimer += deltaTime;
        if(apple.scoreTimer >= apple.scoreTime) {
            apple.score--;
            apple.scoreTimer = 0;
            if(apple.score === 0) {
                spawnApple();
            }
        }

    });
}

function renderApples() {
    apples.forEach(function(apple) {
        var gradient = ctx.createRadialGradient(apple.x + apple.width / 2, apple.y + apple.height / 2, apple.width / 2, apple.x + apple.width / 2, apple.y + apple.height / 2, 0);
        ctx.beginPath();
        ctx.strokeStyle = 'darkred';
        ctx.lineWidth = 2;
        gradient.addColorStop(0, 'darkred');
        gradient.addColorStop(1, 'red');
        ctx.fillStyle = gradient;
        ctx.arc(apple.x + apple.width / 2, apple.y + apple.height / 2, apple.width / 2, 0, twoPi);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 5;
        ctx.moveTo(apple.x + apple.width / 2, apple.y);
        ctx.lineTo(apple.x + apple.width / 2, apple.y - 10);
        ctx.stroke();
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(apple.score, apple.x + apple.width / 2, apple.y + apple.height / 2 + 3);
    });
}

function renderScore() {
    ctx.beginPath();
    ctx.textBaseline = 'top';
    ctx.font = '6vmin Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText('Score: ' + score, canvas.width / 2, 0);
    ctx.textBaseline = 'alphabetic';
}

function renderGameOver() {
    ctx.beginPath();
    ctx.font = '10vmin Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'green';
    ctx.fillText('GAME OVER :(', canvas.width / 2, canvas.height / 3);
}

// simplyfied collision detection
function isCollidingRectRect(a, b) {
    return a.x === b.x && a.y === b.y;
}

function isPassedWorldsEnd(item) {
    return item.x < 0 || item.x > ww(worldWidth - 0.5) || item.y < ww(0) || item.y + item.height > ww(worldHeight + 0.5);
}

// screen methods
function changeScreen() {
    showHideUiElements(activeScreen + 'Ui');
    activeScreen = this.dataset.screen;
    showHideUiElements(activeScreen + 'Ui');
    if(activeScreen === 'gameScreen') {
        startGame();
    }
}

function changeGivenScreen(newScreen) {
    showHideUiElements(activeScreen + 'Ui');
    activeScreen = newScreen || this.dataset.screen;
    showHideUiElements(activeScreen + 'Ui');
    if(activeScreen === 'gameScreen') {
        startGame();
    }
}

function changeDifficulty() {
    difficulty = difficulties.includes(this.dataset.difficulty) ? this.dataset.difficulty : 'easy';
}

function getHighScore() {
    var score = parseInt(localStorage.getItem('snakeHighScore'));
    return isInteger(score) ? score : 0;
}

function setHighScore(score) {
    localStorage.setItem('snakeHighScore', score);
    highScore = getHighScore();
    document.getElementById('highScore').innerText = 'Highscore: ' + score;
}

function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

function titleScreen() {}
function settingsScreen() {}
function howToScreen() {}

function gameScreen() {
    updateApples();
    renderApples();
    updateSnake();
    renderSnake();
    renderScore();
}

function gameOverScreen() {
    renderScore();
    renderGameOver();
}

// main method
function main(time) {
    clearCanvas();
    renderBackground();
    setDeltaTime(time);
    screens[activeScreen]();
    animation = requestAnimationFrame(main);
}

setup();
animation = requestAnimationFrame(main);


// event listeners
document.querySelectorAll('.change-screen-button').forEach(function(button) {
    button.addEventListener('click', changeScreen);
});

document.querySelectorAll('.change-difficulty-button').forEach(function(button) {
    button.addEventListener('click', changeDifficulty);
});

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup();
    animation = requestAnimationFrame(main);
});

document.addEventListener('keydown', function(e) {
    if(activeScreen !== 'gameScreen' || !isAlive) {
        return;
    }
    if(e.keyCode === 39 && snake.direction !== 'left' && snake.hasChangedDirection) {
        snake.direction = 'right';
        snake.hasChangedDirection = false;
    } else if(e.keyCode === 37 && snake.direction !== 'right' && snake.hasChangedDirection) {
        snake.direction = 'left';
        snake.hasChangedDirection = false;
    } else if(e.keyCode === 38 && snake.direction !== 'down' && snake.hasChangedDirection) {
        e.preventDefault();
        snake.direction = 'up';
        snake.hasChangedDirection = false;
    } else if(e.keyCode === 40 && snake.direction !== 'up' && snake.hasChangedDirection) {
        e.preventDefault();
        snake.direction = 'down';
        snake.hasChangedDirection = false;
    } else if(e.keyCode === 80) {
        pause();
    }
});

document.addEventListener('click', function(e) {
    if(isAlive && snake.hasChangedDirection) {
        clicksMade++;
        if(clicksMade > 1) {
            snake.direction = e.x > canvas.width / 2 ? directions[(directions.indexOf(snake.direction) + 1) % directions.length] : directions[((directions.indexOf(snake.direction) + 3)) % directions.length];
            snake.hasChangedDirection = false;
        }
    }
});

document.getElementById('playButton').addEventListener('click', function() {
    var el = document.getElementById('body');
    var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try {
        rfs.call(el);
    } catch(error) {
        console.log('no full screen');
    }
});
