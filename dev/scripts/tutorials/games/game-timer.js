(function() {
    var canvas = document.getElementById('demoCanvas2');
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    var padding = 40;
    var lastTime = 0;
    var deltaTime = 0;
    var gameTime = 10;
    var gameTimer = 0;
    var animation;

    ctx.font = '6vmin Impact';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    function setDeltaTime(time) {
        var frameTime = (time - lastTime) / 1000;
        deltaTime = frameTime < 0.1 ? frameTime : 0.016;
        lastTime = time;
    }

    function updateGameTimer() {
        gameTimer -= deltaTime;
        if(gameTimer <= 0) {
            gameTimer = gameTime;
        }
    }

    function renderGameTimer() {
        var hue = 120 * (gameTimer / gameTime);
        var currentTimeWidth = (width - padding) * (gameTimer / gameTime);
        ctx.fillStyle = 'rgba(188, 188, 188, 0.6)';
        ctx.beginPath();
        ctx.rect(padding / 2, height - 50, width - padding, 30);
        ctx.fill();

        ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        ctx.beginPath();
        ctx.rect(padding / 2, height - 50, currentTimeWidth, 30);
        ctx.fill();

        ctx.beginPath();
        ctx.fillText('Time: ' + gameTimer.toFixed(), width / 2, height - 50);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function main(time) {
        setDeltaTime(time);
        clearCanvas();
        updateGameTimer();
        renderGameTimer();
        animation = requestAnimationFrame(main);
    }

    gameTimer = gameTime;
    animation = requestAnimationFrame(main);
}());

(function() {
    var canvas = document.getElementById('demoCanvas');
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    var padding = 40;
    var lastTime = 0;
    var deltaTime = 0;
    var gameTime = 10;
    var gameTimer = 0;
    var animation;

    ctx.font = '6vmin Impact';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    function setDeltaTime(time) {
        var frameTime = (time - lastTime) / 1000;
        deltaTime = frameTime < 0.1 ? frameTime : 0.016;
        lastTime = time;
    }

    function updateGameTimer() {
        gameTimer -= deltaTime;
        if(gameTimer <= 0) {
            gameTimer = gameTime;
        }
    }

    function renderGameTimer() {
        var hue = 120 * (gameTimer / gameTime);
        var currentTimeWidth = (width - padding) * (gameTimer / gameTime);
        ctx.fillStyle = 'rgba(188, 188, 188, 0.6)';
        ctx.beginPath();
        ctx.rect(padding / 2, height - 50, width - padding, 30);
        ctx.fill();

        ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        ctx.beginPath();
        ctx.rect(padding / 2, height - 50, currentTimeWidth, 30);
        ctx.fill();

        ctx.beginPath();
        ctx.fillText('Time: ' + gameTimer.toFixed(), width / 2, height - 50);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function main(time) {
        setDeltaTime(time);
        clearCanvas();
        updateGameTimer();
        renderGameTimer();
        animation = requestAnimationFrame(main);
    }

    gameTimer = gameTime;
    animation = requestAnimationFrame(main);
}());
