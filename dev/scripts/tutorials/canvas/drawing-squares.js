(function() {
    var canvas = document.getElementById('demoCanvasTop');
    var ctx = canvas.getContext('2d');
    function renderBackground() {
        ctx.fillStyle = 'rgba(23, 122, 143, 1)';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
    }
    renderBackground();
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 15;
    ctx.shadowOffsetY = 15;
    ctx.strokeStyle = 'grey';

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.fillRect(65, 75, 150, 150);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.rect(275, 75, 150, 150);
    ctx.fill();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.rect(485, 75, 150, 150);
    ctx.fill();
})();

(function() {

    var canvas = document.getElementById('demoCanvas1');
    var ctx = canvas.getContext('2d');
    ctx.strokeRect(50, 100, 100, 100);

})();

(function() {

    var canvas = document.getElementById('demoCanvas2');
    var ctx = canvas.getContext('2d');
    ctx.strokeRect(50, 100, 100, 100);
    ctx.fillRect(250, 100, 100, 100);

})();

(function() {

    var canvas = document.getElementById('demoCanvas3');
    var ctx = canvas.getContext('2d');
    ctx.strokeRect(50, 100, 100, 100);

    ctx.fillRect(250, 100, 100, 100);

    ctx.beginPath();
    ctx.strokeStyle ='green';
    ctx.fillStyle ='red';
    ctx.rect(450, 25, 100, 100);
    ctx.moveTo(500, 125);
    ctx.lineTo(500, 175);
    ctx.rect(450, 175, 100, 100);
    ctx.fill();
    ctx.stroke();

})();

(function() {

    var canvas = document.getElementById('demoCanvas4');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle ='black';
    ctx.fillStyle ='black';

    ctx.strokeRect(50, 100, 100, 100);

    ctx.fillRect(250, 100, 100, 100);

    ctx.beginPath();
    ctx.strokeStyle ='green';
    ctx.fillStyle ='red';
    ctx.rect(450, 25, 100, 100);
    ctx.moveTo(500, 125);
    ctx.lineTo(500, 175);
    ctx.rect(450, 175, 100, 100);
    ctx.fill();
    ctx.stroke();

})();

(function() {

    var canvas = document.getElementById('demoCanvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 143, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle ='black';
    ctx.fillStyle ='black';

    ctx.strokeRect(50, 100, 100, 100);

    ctx.fillRect(250, 100, 100, 100);

    ctx.beginPath();
    ctx.strokeStyle ='green';
    ctx.fillStyle ='red';
    ctx.rect(450, 25, 100, 100);
    ctx.moveTo(500, 125);
    ctx.lineTo(500, 175);
    ctx.rect(450, 175, 100, 100);
    ctx.fill();
    ctx.stroke();

})();
