(function() {

var canvas = document.getElementById('pongCanvas');
var ctx = canvas.getContext('2d');
var twoPi = 2 * Math.PI;
var lastTime = 0;
var deltaTime = 0;
var animation;
var isPaused = false;

// ai
var aiDecisionTime = 0;
var aiDecisionTimer = 0;

var p1AiDecisionTime = 0.1;
var p1AiDecisionTimer = 0;

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
    titleScreen: function() {return titleScreen();},
    gameScreen: function() {return gameScreen();},
    settingsScreen: function() {return settingsScreen();},
    howToScreen: function() {return howToScreen();},
    pauseScreen: function() {return pauseScreen();},
    gameOverScreen: function() {return gameOverScreen();}
};
var activeScreen = 'titleScreen';

// main game
var playerOffset = canvas.width / 25;
var player1 = {player: 1, x: playerOffset, y: 0, score: 0, width: 0.25, height: 2, vy: 4, isHuman: true};
var player2 = {player: 2, x: canvas.width - playerOffset, y: 0, score: 0, width: 0.25, height: 2, vy: 4, isHuman: false};
var players = [player1, player2];
var ball = {x: canvas.width / 2, y: canvas.height / 2, width: 0.35, height: 0.35, vx: 4, vy: 4, vxMin: 1, vxMax: 8, vyMax: 6};
var borderWidth = canvas.width / 50;
var mainColour = 'rgba(222, 222, 222, 1)';
var p1UpPressed = false;
var p1DownPressed = false;
var p2UpPressed = false;
var p2DownPressed = false;
var winningScore = 10;

function setup() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    horizontalUnit = canvas.width / worldWidth;
    verticalUnit = canvas.height / worldHeight;
    borderWidth = canvas.width / 50;
    playerOffset = canvas.width / 25;
    player1.x = playerOffset - horizontalUnit * player1.width;
    player2.x = canvas.width - playerOffset;
    player1.y = canvas.height / 2 - player1.height * verticalUnit / 2;
    player2.y = canvas.height / 2 - player1.height * verticalUnit / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vy = 4;
}

function setDeltaTime(time) {
    deltaTime = time - lastTime < 250 ? (time - lastTime) / 1000 : 0.0167;
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

function renderBorder() {
    ctx.textBaseline = 'hanging';
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = mainColour;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}

function renderCentralLine() {
    for(var i = 0; i <= worldHeight; i++) {
        ctx.moveTo(canvas.width / 2, wh(worldHeight - i + 0.25));
        ctx.lineTo(canvas.width / 2, wh(worldHeight - i + 0.75));
        ctx.stroke();
    }
}

function updatePlayers() {
    player1.y += p1UpPressed ? verticalUnit * player1.vy * deltaTime : p1DownPressed ? -(verticalUnit * player1.vy * deltaTime) : 0;
    player2.y += p2UpPressed ? verticalUnit * player2.vy * deltaTime : p2DownPressed ? -(verticalUnit * player2.vy * deltaTime) : 0;
    keepPlayerInBounds(player1);
    keepPlayerInBounds(player2);
}

function keepPlayerInBounds(player) {
    player.y = player.y <= borderWidth ? borderWidth : player.y + (player.height * verticalUnit) >= (verticalUnit * worldHeight) - borderWidth ? (verticalUnit * worldHeight) - borderWidth - (player.height * verticalUnit) : player.y;
}

function renderPlayers() {
    players.forEach(function(player) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.rect(player.x, player.y, player.width * horizontalUnit, player.height * verticalUnit);
        ctx.stroke();
        ctx.fill();
    });
}

function updateBall() {
    ball.x += horizontalUnit * ball.vx * deltaTime;
    ball.y += verticalUnit * ball.vy * deltaTime;
    keepBallInBounds();
    checkScored();
    if(isCollidingRectRect(ball, player1)){
        ball.vx = -ball.vx;
        ball.vy = calculateReturnTrajectory(player1);
        ball.x = player1.x + (player1.width * horizontalUnit);
    } else if(isCollidingRectRect(ball, player2)) {
        ball.vx = -ball.vx;
        ball.vy = calculateReturnTrajectory(player2);
        ball.x = player2.x - (ball.width * horizontalUnit);
     }
}

function calculateReturnTrajectory(paddle) {
    var paddleCenter = paddle.y + (paddle.height * verticalUnit / 2);
    var ballCenter = ball.y + (ball.height * horizontalUnit / 2);
    var difference = paddleCenter - ballCenter; // between center of paddle and center of ball
    // calculate the percentage of difference and half the paddle height and multiply by the max y velocity
    var trajectory = Math.abs(difference) / (paddle.height * verticalUnit / 2) * ball.vyMax;
    // return a positive or negative value based on relativity to the center of the paddle
    return difference <= 0 ? trajectory : -trajectory;
}

function keepBallInBounds() {
    if(ball.y <= borderWidth / 2) {
        ball.vy = -ball.vy;
        ball.y = borderWidth / 2;
    } else if(ball.y >= (canvas.height - borderWidth / 2) - (ball.height * horizontalUnit)) {
        ball.vy = -ball.vy;
        ball.y = (canvas.height - borderWidth / 2) - (ball.height * horizontalUnit);
    }
}

function ai() {
    if(player2.isHuman) {
        return;
    }
    if(ball.vx < 0) {
        p2UpPressed = false;
        p2DownPressed = false;
        return;
    }
    aiDecisionTimer += deltaTime;
    if(aiDecisionTimer >= aiDecisionTime) {
        aiDecisionTimer = 0;
        var ballCenter = ball.y + (ball.height * horizontalUnit / 2);
        if(ballCenter < player2.y) {
            p2UpPressed = false;
            p2DownPressed = true;
        } else if(ballCenter > player2.y + (player2.height * verticalUnit)) {
            p2UpPressed = true;
            p2DownPressed = false;
        }
    }
}

function player1Ai() {
    if(player1.isHuman) {
        return;
    }
    if(ball.vx > 0) {
        p1UpPressed = false;
        p1DownPressed = false;
        return;
    }
    p1AiDecisionTimer += deltaTime;
    if(p1AiDecisionTimer >= p1AiDecisionTime) {
        p1AiDecisionTimer = 0;
        var ballCenter = ball.y + (ball.height * horizontalUnit / 2);
        if(ballCenter < player1.y) {
            p1UpPressed = false;
            p1DownPressed = true;
        } else if(ballCenter > player1.y + (player1.height * verticalUnit)) {
            p1UpPressed = true;
            p1DownPressed = false;
        }
    }
}

function checkScored() {
    if(ball.x <= borderWidth / 2) {
        ctx.fillStyle = 'grey';
        player2.score++;
        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'center';
        if(player2.score < winningScore) {
            ctx.fillText(player2.isHuman ? 'Score: P2' : 'Score: CPU', canvas.width / 2, borderWidth + canvas.height / 4);
        } else {
            ctx.fillText(player2.isHuman ? 'Winner: P1!' : 'Winner: CPU!', canvas.width / 2, borderWidth + canvas.height / 4);
        }
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        resetGame();
    } else if(ball.x >= (canvas.width - borderWidth / 2) - (ball.width * horizontalUnit)) {
        ctx.fillStyle = 'grey';
        player1.score++;
        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'center';
        if(player1.score < winningScore) {
            ctx.fillText(player1.isHuman ? 'Score: P1' : 'Score: CPU', canvas.width / 2, borderWidth + canvas.height / 4);
        } else {
            ctx.fillText(player1.isHuman ? 'Winner: P1!' : 'Winner: CPU!', canvas.width / 2, borderWidth + canvas.height / 4);
        }
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        resetGame();
    }
}

function resetGame() {
    isPaused = true;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vy = randomNumber(0, 1) > 0.5 ? randomNumber(1, 4) : -randomNumber(1, 4);
    ball.vx = randomNumber(0, 1) > 0.5 ? 4 : -4;
    animation = cancelAnimationFrame(main);
    setTimeout(function() {
        isPaused = false;
        animation = requestAnimationFrame(main);
        if(player1.score >= winningScore || player2.score >= winningScore) {
            changeGivenScreen('titleScreen');
        }
    }, 1000);
}

function renderScore() {
    ctx.fillStyle = mainColour;
    ctx.textBaseline = 'hanging';
    ctx.font = 'bold 14vmin Arial Black';
    ctx.textAlign = 'end';
    ctx.fillText(player1.score, canvas.width / 2 - borderWidth, borderWidth / 2);
    ctx.textAlign = 'start';
    ctx.fillText(player2.score, canvas.width / 2 + borderWidth, borderWidth / 2);
    ctx.textBaseline = 'alphabetic';
}

function renderBall() {
    ctx.beginPath();
    ctx.fillStyle = mainColour;
    ctx.rect(ball.x, ball.y, ball.width * horizontalUnit, ball.height * horizontalUnit);
    ctx.fill();
}

function isCollidingRectRect(ob1, ob2) {
    return ob2.x + (horizontalUnit * ob2.width) >= ob1.x && ob2.x <= ob1.x + (horizontalUnit * ob1.width) && ob2.y + (verticalUnit * ob2.height) >= ob1.y && ob2.y <= ob1.y + (verticalUnit * ob1.height);
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
    player1.score = 0;
    player2.score = 0;
    setup();
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

function changePlayerAmount() {
    player1.isHuman = false;
    player2.isHuman = false;
    for(var i = 0; i <= parseInt(this.dataset.players); i++) {
        if(i === 1) {
            player1.isHuman = true;
        } else if(i === 2) {
            player2.isHuman = true;
        }
    }
    document.querySelectorAll('.player-select-button').forEach(function(button) {
        button.classList.remove('pong-selected');
    });
    this.classList.add('pong-selected');
}

function titleScreen() {}
function settingsScreen() {}
function howToScreen() {}
function gameOverScreen() {}

function gameScreen() {
    renderCentralLine();
    ai();
    player1Ai();
    updatePlayers();
    renderPlayers();
    updateBall();
    renderBall();
    renderScore();
}

// main method
function main(time) {
    clearCanvas();
    renderBackground();
    renderBorder();
    setDeltaTime(time);
    screens[activeScreen]();
    if(!isPaused) {
        animation = requestAnimationFrame(main);
    }
}

setup();
animation = requestAnimationFrame(main);

// event listeners
document.querySelectorAll('.change-screen-button').forEach(function(button) {
    button.addEventListener('click', changeScreen);
});

window.addEventListener('resize', function() {
    cancelAnimationFrame(animation);
    setup();
    animation = requestAnimationFrame(main);
});

document.addEventListener('keydown', function(e) {
    if(activeScreen !== 'gameScreen') {
        return;
    }
    if(e.keyCode === 38 && player1.isHuman) {
        e.preventDefault();
        p1DownPressed = true;
    } else if(e.keyCode === 40 && player1.isHuman) {
        e.preventDefault();
        p1UpPressed = true;
    } else if(e.keyCode === 83 && player2.isHuman) {
        p2UpPressed = true;
    } else if(e.keyCode === 87 && player2.isHuman) {
        p2DownPressed = true;
    } else if(e.keyCode === 80) {
        pause();
    }
});

document.addEventListener('keyup', function(e) {
    if(activeScreen !== 'gameScreen') {
        return;
    }
    if(e.keyCode === 38 && player1.isHuman) {
        e.preventDefault();
        p1DownPressed = false;
    } else if(e.keyCode === 40 && player1.isHuman) {
        e.preventDefault();
        p1UpPressed = false;
    } else if(e.keyCode === 83 && player2.isHuman) {
        p2UpPressed = false;
    } else if(e.keyCode === 87 && player2.isHuman) {
        p2DownPressed = false;
    } else if(e.keyCode === 80) {
        pause();
    }
});

document.querySelectorAll('.player-select-button').forEach(function(button) {
    button.addEventListener('click', changePlayerAmount);
});

function addSelectedButtons() {
    document.querySelectorAll('.player-select-button').forEach(function(button) {
    });
}

canvas.addEventListener('touchstart', function(e) {
    if(e.target.nodeName !== 'BUTTON') {
        e.preventDefault();
    }
    if(activeScreen !== 'gameScreen') {
        return;
    }
    if(e.touches[0].clientY <= canvas.height / 2) {
        p1DownPressed = true;
    } else {
        p1UpPressed = true;
    }
}, true);

canvas.addEventListener('touchend', function(e) {
    if(e.target.nodeName !== 'BUTTON') {
        e.preventDefault();
    }
    if(activeScreen !== 'gameScreen') {
        return;
    }
    p1UpPressed = false;
    p1DownPressed = false;
}, true);

canvas.addEventListener('mousedown', function(e) {
    if(e.target.nodeName !== 'BUTTON') {
        e.preventDefault();
    }
    if(activeScreen !== 'gameScreen') {
        return;
    }
    if(e.y <= canvas.height / 2) {
        p1DownPressed = true;
    } else {
        p1UpPressed = true;
    }
}, true);

canvas.addEventListener('mouseup', function(e) {
    if(e.target.nodeName !== 'BUTTON') {
        e.preventDefault();
    }
    if(activeScreen !== 'gameScreen') {
        return;
    }
    p1UpPressed = false;
    p1DownPressed = false;
}, true);

document.getElementById('playButton').addEventListener('click', function() {
    var el = document.getElementById('body');
    var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try {
        rfs.call(el);
    } catch(error) {
        console.log('no full screen');
    }
});

}());
