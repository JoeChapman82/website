(function() {
    var canvas = document.getElementById('demoCanvasTop');
    var ctx = canvas.getContext('2d');
    function renderBackground() {
        ctx.fillStyle = 'rgba(23, 122, 183, 1)';
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
    ctx.arc(140, 150, 75, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(350, 145, 75, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.arc(350, 155, 75, 0, Math.PI, false);
    ctx.fill();

    ctx.fillStyle = '#FECB2F';
    ctx.beginPath();
    ctx.arc(560, 150, 75, 0.20 * Math.PI, 1.80 * Math.PI);
    ctx.lineTo(560, 150);
    ctx.fill();
    ctx.beginPath();
    ctx.shadowBlur = null;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = 'black';
    ctx.arc(570, 110, 10, 0, 2 * Math.PI);
    ctx.fill();
})();

(function() {

    var canvas = document.getElementById('demoCanvas1');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 183, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(100, 150, 50, 0, 2 * Math.PI);
    ctx.fill();

})();

(function() {

    var canvas = document.getElementById('demoCanvas2');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 183, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(100, 150, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(300, 145, 50, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.arc(300, 155, 50, 0, Math.PI, false);
    ctx.fill();

})();

(function() {

    var canvas = document.getElementById('demoCanvas3');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 183, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(100, 150, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(300, 145, 50, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.arc(300, 155, 50, 0, Math.PI, false);
    ctx.fill();

    ctx.fillStyle = '#FECB2F';
    ctx.beginPath();
    ctx.arc(500, 150, 50, 0.20 * Math.PI, 1.80 * Math.PI);
    ctx.lineTo(500, 150);
    ctx.fill();


    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(510, 125, 7, 0, 2 * Math.PI);
    ctx.fill();

})();

(function() {

    var canvas = document.getElementById('demoCanvas4');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 183, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(100, 150, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(300, 145, 50, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.arc(300, 155, 50, 0, Math.PI, false);
    ctx.fill();

    ctx.fillStyle = '#FECB2F';
    ctx.beginPath();
    ctx.arc(500, 150, 50, degreesToRadians(30), degreesToRadians(330));
    ctx.lineTo(500, 150);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(510, 125, 7, 0, 2 * Math.PI);
    ctx.fill();

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

})();

(function() {

    var canvas = document.getElementById('demoCanvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(23, 122, 183, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(100, 150, 50, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(300, 145, 50, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = 'lightgreen';
    ctx.beginPath();
    ctx.arc(300, 155, 50, 0, Math.PI, false);
    ctx.fill();

    ctx.fillStyle = '#FECB2F';
    ctx.beginPath();
    ctx.arc(500, 150, 50, degreesToRadians(30), degreesToRadians(330));
    ctx.lineTo(500, 150);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(510, 125, 7, 0, 2 * Math.PI);
    ctx.fill();

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

})();
