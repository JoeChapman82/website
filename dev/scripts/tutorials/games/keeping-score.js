(function() {
    var canvas = document.getElementById('demoCanvas2');
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    var score = 0;
    var displayScore = 0;
    var scoreIncrement = 5;
    var animation;

    ctx.font = '6vmin Impact';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    function updateScore() {
        if(displayScore < score) {
            displayScore += scoreIncrement;
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function renderBackground() {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'rgba(23, 92, 153, 1)';
        ctx.fill();
    }

    function renderScore() {
        ctx.fillStyle = 'rgba(255, 44, 44, 0.8)';
        ctx.beginPath();
        ctx.fillText('Score: ' + displayScore, width / 2, height - 20);
    }

    function main(time) {
        clearCanvas();
        renderBackground();
        updateScore();
        renderScore();
        animation = requestAnimationFrame(main);
    }

    animation = requestAnimationFrame(main);

    document.getElementById('increaseScoreButton').addEventListener('click', function() {
        score += 100;
    });

}());

(function() {
    var canvas = document.getElementById('demoCanvas');
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    var score = 0;
    var displayScore = 0;
    var scoreIncrement = 5;
    var animation;

    ctx.font = '6vmin Impact';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    function updateScore() {
        if(displayScore < score) {
            displayScore += scoreIncrement;
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    function renderBackground() {
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = 'rgba(23, 72, 123, 1)';
        ctx.fill();
    }

    function renderScore() {
        ctx.fillStyle = 'rgba(255, 44, 44, 1)';
        ctx.beginPath();
        ctx.fillText('Score: ' + displayScore, width / 2, height - 20);
    }

    function main(time) {
        clearCanvas();
        renderBackground();
        updateScore();
        renderScore();
        animation = requestAnimationFrame(main);
    }

    animation = requestAnimationFrame(main);

    document.getElementById('increaseScoreButton2').addEventListener('click', function() {
        score += 100;
    });
}());
