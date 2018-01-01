(function() {
    var canvas = document.getElementById('demoCanvasTop');
    var ctx = canvas.getContext('2d');
    function renderBackground() {
        ctx.fillStyle = 'rgba(63, 192, 143, 1)';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
    }
    renderBackground();
    ctx.fillStyle = 'rgba(63, 192, 143, 1)';
    ctx.shadowColor = 'goldenrod';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.moveTo(350, 30);
    ctx.lineTo(130, 245);
    ctx.lineTo(570, 245);
    ctx.lineTo(350, 30);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(425, 150);
    ctx.lineTo(275, 150);
    ctx.lineTo(350, 225);
    ctx.lineTo(425, 150);
    ctx.fillStyle = 'rgba(99, 99, 99, 0.3)';
    ctx.fill();

    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'goldenrod';

    ctx.beginPath();
    ctx.moveTo(350, 37);
    ctx.lineTo(250, 137);
    ctx.lineTo(450, 137);
    var gradient = ctx.createRadialGradient(350, 97, 70, 350, 97, 0);
    gradient.addColorStop(0, 'goldenrod');
    gradient.addColorStop(1, 'yellow');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(450, 137);
    ctx.lineTo(350, 237);
    ctx.lineTo(550, 237);
    gradient = ctx.createRadialGradient(450, 197, 70, 450, 197, 0);
    gradient.addColorStop(0, 'goldenrod');
    gradient.addColorStop(1, 'yellow');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(250, 137);
    ctx.lineTo(150, 237);
    ctx.lineTo(350, 237);
    gradient = ctx.createRadialGradient(250, 197, 70, 250, 197, 0);
    gradient.addColorStop(0, 'goldenrod');
    gradient.addColorStop(1, 'yellow');
    ctx.fillStyle = gradient;
    ctx.fill();
})();

(function() {

    var canvas = document.getElementById('demoCanvas1');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(63, 83, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(50, 200);
    ctx.lineTo(150, 200);
    ctx.closePath();
    ctx.stroke();


})();

(function() {

    var canvas = document.getElementById('demoCanvas2');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(63, 83, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(50, 200);
    ctx.lineTo(150, 200);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(250, 200);
    ctx.lineTo(350, 200);
    ctx.fill();

})();

(function() {

    var canvas = document.getElementById('demoCanvas3');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(63, 83, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(50, 200);
    ctx.lineTo(150, 200);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(250, 200);
    ctx.lineTo(350, 200);
    ctx.fill();

    ctx.fillStyle = 'pink';
    renderTriangle(ctx, 500, 100, 450, 200, 550, 200);
    ctx.fill();

    function renderTriangle(ctx, x1, y1, x2, y2, x3, y3) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
    }

})();

(function() {

    var canvas = document.getElementById('demoCanvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(63, 83, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(50, 200);
    ctx.lineTo(150, 200);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(250, 200);
    ctx.lineTo(350, 200);
    ctx.fill();

    ctx.fillStyle = 'pink';
    renderTriangle(ctx, 500, 100, 450, 200, 550, 200);
    ctx.fill();

    function renderTriangle(ctx, x1, y1, x2, y2, x3, y3) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
    }

})();
