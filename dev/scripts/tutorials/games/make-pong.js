(function() {
var canvas = document.getElementById('displayCanvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.font = 'bold 48px Arial Black';
var animation;
var lastTime = 0;
var deltaTime = 0;
var worldWidth = 16;
var worldHeight = 9;
var horizontalUnit = canvas.width / worldWidth;
var verticalUnit = canvas.height / worldHeight;
var players = [];
var ball;
var invisiball;
var borderWidth = 10;
var winScore = 10;

var Ball = function(x, y, vx, vy, invisible) {
    this.x = x || canvas.width / 2;
    this.y = y || canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.vx = vx || (Math.random() > 0.5 ? 4 : -4);
    this.vy = vy || (Math.random() > 0.5 ? 4 : -4);
    this.vyMax = 8;
    this.invisible = invisible || false;
};

Ball.prototype.update = function() {
    var hit = false;
    if(this.invisible) {
        this.x += this.x < players[1].x - this.width ? this.vx * horizontalUnit * (deltaTime * 1.5) : 0;
        this.y += this.x < players[1].x - this.width ? this.vy * verticalUnit * (deltaTime * 1.5) : 0;
        this.vy = this.y > borderWidth && this.y + this.height < canvas.height - borderWidth ? this.vy : -this.vy;
        return;
    }
    if(isColliding(this, players[0])) {
        this.vy = calculateReturnTrajectory(players[0]);
        this.x = players[0].x + players[0].width;
        hit = true;
        invisiball = new Ball(this.x, this.y, -this.vx, this.vy, true);
    } else if(isColliding(this, players[1])) {
        this.vy = calculateReturnTrajectory(players[1]);
        this.x = players[1].x - ball.width;
        hit = true;
        invisiball = undefined;
    }
    if(this.x <= borderWidth) {
        players[1].score++;
        return players[1].score < winScore ? reset() : init();
    } else if(this.x + this.width >= canvas.width - borderWidth) {
        players[0].score++;
        return players[0].score < winScore ? reset() : init();
    }
    this.vx = hit ? -this.vx : this.vx;
    this.vy = this.y > borderWidth && this.y + this.height < canvas.height - borderWidth ? this.vy : -this.vy;
    this.x += this.vx * horizontalUnit * deltaTime;
    this.y += this.vy * verticalUnit * deltaTime;
    this.y = this.y < borderWidth ? borderWidth : this.y + this.height < canvas.height - borderWidth ? this.y : canvas.height - borderWidth - this.height;
};

var Player = function(courtSide, isHuman) {
    this.courtSide = courtSide;
    this.x = courtSide === 'left' ? 10 : canvas.width - 30;
    this.y = canvas.height / 2;
    this.vy = 4;
    this.width = 15;
    this.height = 80;
    this.upPressed = false;
    this.downPressed = false;
    this.isHuman = isHuman;
    this.score = 0;
};

Player.prototype.update = function() {
    var center = this.y + this.width / 2;
    var increment = this.vy * verticalUnit * deltaTime;
    if(this.isHuman) {
        this.y += this.upPressed ? -increment : this.downPressed ? increment : 0;
    } else {
        if(this.courtSide === 'right' && ball.vx > 0 || ball.vx < 0 && this.courtSide === 'left') {
            this.y += invisiball ? (invisiball.y >= center ? increment : -increment) : (ball.y >= center ? increment : -increment);
        }
    }
    this.y = this.y < borderWidth ? borderWidth : this.y + this.height < canvas.height - borderWidth ? this.y : canvas.height - borderWidth - this.height;
};

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000 <= 0.5 ? (time - lastTime) / 1000 : 0.167;
    lastTime = time;
}

function calculateReturnTrajectory(paddle) {
    var paddleCenter = paddle.y + (paddle.height / 2);
    var ballCenter = ball.y + (ball.height / 2);
    var difference = paddleCenter - ballCenter;
    var trajectory = Math.abs(difference) / (paddle.height / 2) * ball.vyMax;
    return difference <= 0 ? trajectory : -trajectory;
}

function isColliding(ob1, ob2) {
    return ob2.x + ob2.width >= ob1.x && ob2.x <= ob1.x + ob1.width && ob2.y + ob2.height >= ob1.y && ob2.y <= ob1.y + ob1.height;
}

function renderRect(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
}

function renderCentralLine() {
    for(var i = 0; i <= worldHeight; i++) {
        renderRect(canvas.width / 2 - 8, i * verticalUnit + 6, 16, verticalUnit / 1.75);
    }
}

function renderBorder() {
    renderRect(0, 0, canvas.width, borderWidth);
    renderRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
}

function renderScore() {
    ctx.textBaseline = 'hanging';
    ctx.textAlign = 'end';
    ctx.fillText(players[0].score, canvas.width / 2 - borderWidth, borderWidth);
    ctx.textAlign = 'start';
    ctx.fillText(players[1].score, canvas.width / 2 + borderWidth, borderWidth);
    ctx.textBaseline = 'alphabetic';
}

function init() {
    players.length = 0;
    ball = new Ball();
    players.push(new Player('left', false), new Player('right', false));
}

function reset() {
    ball = new Ball();
    invisiball = undefined;
}

function main(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDeltaTime(time);
    renderCentralLine();
    renderBorder();
    renderScore();
    ball.update();
    renderRect(ball.x, ball.y, ball.width, ball.height);
    players.forEach(function(player) {
        player.update();
        renderRect(player.x, player.y, player.width, player.height);
    });
    if(invisiball) {
        invisiball.update();
    }
    requestAnimationFrame(main);
}

init();
animation = requestAnimationFrame(main);

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 38) {
        players[0].upPressed = true;
    } else if(e.keyCode === 40) {
        players[0].downPressed = true;
    }
});

document.addEventListener('keyup', function(e) {
    if(e.keyCode === 38) {
        players[0].upPressed = false;
    } else if(e.keyCode === 40) {
        players[0].downPressed = false;
    }
});

})();


//display canvas 2
(function() {
    var canvas = document.getElementById('displayCanvas2');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = 'bold 48px Arial Black';
    var animation;
    var lastTime = 0;
    var deltaTime = 0;
    var worldWidth = 16;
    var worldHeight = 9;
    var horizontalUnit = canvas.width / worldWidth;
    var verticalUnit = canvas.height / worldHeight;
    var players = [];
    var ball;
    var invisiball;
    var borderWidth = 10;
    var winScore = 10;

    var Ball = function(x, y, vx, vy, invisible) {
        this.x = x || canvas.width / 2;
        this.y = y || canvas.height / 2;
        this.width = 20;
        this.height = 20;
        this.vx = vx || (Math.random() > 0.5 ? 4 : -4);
        this.vy = vy || (Math.random() > 0.5 ? 4 : -4);
        this.vyMax = 8;
        this.invisible = invisible || false;
    };

    var Player = function(courtSide, isHuman) {
        this.courtSide = courtSide;
        this.x = courtSide === 'left' ?  10  : canvas.width - 30;
        this.y = canvas.height / 2;
        this.width = 15;
        this.height = 80;
        this.vy = 4;
        this.upPressed = false;
        this.downPressed = false;
        this.isHuman = isHuman;
        this.score = 0;
    };

    function setDeltaTime(time) {
        deltaTime = (time - lastTime) / 1000 <= 0.5 ? (time - lastTime) / 1000 : 0.167;
        lastTime = time;
    }

    function calculateReturnTrajectory(player) {
        var paddleCenter = player.y + (player.height / 2);
        var ballCenter = ball.y + (ball.height / 2);
        var difference = playerCenter - ballCenter;
        var trajectory = Math.abs(difference) / (paddle.height / 2) * ball.vyMax;
        return difference <= 0 ? trajectory : -trajectory;
    }

    function isColliding(ob1, ob2) {
        return ob2.x + ob2.width >= ob1.x && ob2.x <= ob1.x + ob1.width && ob2.y + ob2.height >= ob1.y && ob2.y <= ob1.y + ob1.height;
    }

    function renderRect(x, y, width, height) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fill();
    }

    function renderCentralLine() {
        for(var i = 0; i <= worldHeight; i++) {
            renderRect(canvas.width / 2 - 8, i * verticalUnit + 6, 16, verticalUnit / 1.75);
        }
    }

    function renderBorder() {
        renderRect(0, 0, canvas.width, borderWidth);
        renderRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
    }

    function renderScore() {
        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'end';
        ctx.fillText(players[0].score, canvas.width / 2 - borderWidth, borderWidth);
        ctx.textAlign = 'start';
        ctx.fillText(players[1].score, canvas.width / 2 + borderWidth, borderWidth);
    }

    function init() {
        players.length = 0;
        ball = new Ball();
        players.push(new Player('left', false), new Player('right', false));
    }

    function reset() {
        ball = new Ball();
    }

    init();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCentralLine();
    renderBorder();
    renderScore();
    renderRect(ball.x, ball.y, ball.width, ball.height);
    players.forEach(function(player) {
        renderRect(player.x, player.y, player.width, player.height);
    });

})();

// display canvas 3
(function() {
var canvas = document.getElementById('displayCanvas3');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.font = 'bold 48px Arial Black';
var animation;
var lastTime = 0;
var deltaTime = 0;
var worldWidth = 16;
var worldHeight = 9;
var horizontalUnit = canvas.width / worldWidth;
var verticalUnit = canvas.height / worldHeight;
var players = [];
var ball;
var invisiball;
var borderWidth = 10;
var winScore = 10;

var Ball = function(x, y, vx, vy, invisible) {
    this.x = x || canvas.width / 2;
    this.y = y || canvas.height / 2;
    this.width = 20;
    this.height = 20;
    this.vx = vx || (Math.random() > 0.5 ? 4 : -4);
    this.vy = vy || (Math.random() > 0.5 ? 4 : -4);
    this.vyMax = 8;
    this.invisible = invisible || false;
};

Ball.prototype.update = function() {
    var hit = false;
    if(this.invisible) {
        this.x += this.x < players[1].x - this.width ? this.vx * horizontalUnit * (deltaTime * 1.5) : 0;
        this.y += this.x < players[1].x - this.width ? this.vy * verticalUnit * (deltaTime * 1.5) : 0;
        this.vy = this.y > borderWidth && this.y + this.height < canvas.height - borderWidth ? this.vy : -this.vy;
        return;
    }
    if(isColliding(this, players[0])) {
        this.vy = calculateReturnTrajectory(players[0]);
        this.x = players[0].x + players[0].width;
        hit = true;
        invisiball = new Ball(this.x, this.y, -this.vx, this.vy, true);
    } else if(isColliding(this, players[1])) {
        this.vy = calculateReturnTrajectory(players[1]);
        this.x = players[1].x - ball.width;
        hit = true;
        invisiball = undefined;
    }
    if(this.x <= borderWidth) {
        players[1].score++;
        return players[1].score < winScore ? reset() : init();
    } else if(this.x + this.width >= canvas.width - borderWidth) {
        players[0].score++;
        return players[0].score < winScore ? reset() : init();
    }
    this.vx = hit ? -this.vx : this.vx;
    this.vy = this.y > borderWidth && this.y + this.height < canvas.height - borderWidth ? this.vy : -this.vy;
    this.x += this.vx * horizontalUnit * deltaTime;
    this.y += this.vy * verticalUnit * deltaTime;
    this.y = this.y < borderWidth ? borderWidth : this.y + this.height < canvas.height - borderWidth ? this.y : canvas.height - borderWidth - this.height;
};

var Player = function(courtSide, isHuman) {
    this.courtSide = courtSide;
    this.x = courtSide === 'left' ? 10 : canvas.width - 30;
    this.y = canvas.height / 2;
    this.vy = 4;
    this.width = 15;
    this.height = 80;
    this.upPressed = false;
    this.downPressed = false;
    this.isHuman = isHuman;
    this.score = 0;
};

Player.prototype.update = function() {
    var center = this.y + this.width / 2;
    var increment = this.vy * verticalUnit * deltaTime;
    if(this.isHuman) {
        this.y += this.upPressed ? -increment : this.downPressed ? increment : 0;
    } else {
        if(this.courtSide === 'right' && ball.vx > 0 || ball.vx < 0 && this.courtSide === 'left') {
            this.y += invisiball ? (invisiball.y >= center ? increment : -increment) : (ball.y >= center ? increment : -increment);
        }
    }
    this.y = this.y < borderWidth ? borderWidth : this.y + this.height < canvas.height - borderWidth ? this.y : canvas.height - borderWidth - this.height;
};

function setDeltaTime(time) {
    deltaTime = (time - lastTime) / 1000 <= 0.5 ? (time - lastTime) / 1000 : 0.167;
    lastTime = time;
}

function calculateReturnTrajectory(paddle) {
    var paddleCenter = paddle.y + (paddle.height / 2);
    var ballCenter = ball.y + (ball.height / 2);
    var difference = paddleCenter - ballCenter;
    var trajectory = Math.abs(difference) / (paddle.height / 2) * ball.vyMax;
    return difference <= 0 ? trajectory : -trajectory;
}

function isColliding(ob1, ob2) {
    return ob2.x + ob2.width >= ob1.x && ob2.x <= ob1.x + ob1.width && ob2.y + ob2.height >= ob1.y && ob2.y <= ob1.y + ob1.height;
}

function renderRect(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
}

function renderBackground() {
    ctx.fillStyle = 'rgba(22, 22, 22, 1)';
    renderRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
}

function renderCentralLine() {
    for(var i = 0; i <= worldHeight; i++) {
        renderRect(canvas.width / 2 - 8, i * verticalUnit + 6, 16, verticalUnit / 1.75);
    }
}

function renderBorder() {
    renderRect(0, 0, canvas.width, borderWidth);
    renderRect(0, canvas.height - borderWidth, canvas.width, borderWidth);
}

function renderScore() {
    ctx.textBaseline = 'hanging';
    ctx.textAlign = 'end';
    ctx.fillText(players[0].score, canvas.width / 2 - borderWidth, borderWidth);
    ctx.textAlign = 'start';
    ctx.fillText(players[1].score, canvas.width / 2 + borderWidth, borderWidth);
    ctx.textBaseline = 'alphabetic';
}

function init() {
    players.length = 0;
    ball = new Ball();
    players.push(new Player('left', false), new Player('right', false));
}

function reset() {
    ball = new Ball();
    invisiball = undefined;
}

function main(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDeltaTime(time);
    renderBackground();
    renderCentralLine();
    renderBorder();
    renderScore();
    ball.update();
    renderRect(ball.x, ball.y, ball.width, ball.height);
    players.forEach(function(player) {
        player.update();
        renderRect(player.x, player.y, player.width, player.height);
    });
    if(invisiball) {
        invisiball.update();
    }
    requestAnimationFrame(main);
}

init();
animation = requestAnimationFrame(main);

document.addEventListener('keydown', function(e) {
    if(e.keyCode === 38) {
        players[0].upPressed = true;
    } else if(e.keyCode === 40) {
        players[0].downPressed = true;
    }
});

document.addEventListener('keyup', function(e) {
    if(e.keyCode === 38) {
        players[0].upPressed = false;
    } else if(e.keyCode === 40) {
        players[0].downPressed = false;
    }
});

})();
