(function() {
    var canvas = document.getElementById('demoCanvasTop');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var lastTime = 0;
    var totalTime = 0;
    var twoPi = Math.PI * 2;
    var spinnerParts = 16;
    var spinnerRadius = 50;
    var spinnerPartRadius = (twoPi * spinnerRadius / spinnerParts) / 2;

    function manageTime(time) {
        totalTime += (time - lastTime) / 1000;
        lastTime = time;
    }

    function renderBackground() {
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, width, height);
    }

    function renderSpinner() {
        var rotation = (totalTime * spinnerParts).toFixed() / spinnerParts;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation * twoPi);
        for (var i = 0; i < spinnerParts; i++) {
            ctx.beginPath();
            ctx.rotate(twoPi / spinnerParts);
            ctx.fillStyle = 'rgba(77, 77, 77,' + i / spinnerParts + ')';
            ctx.arc(spinnerRadius, 0, spinnerPartRadius, 0, twoPi);
            ctx.fill();
        }
        ctx.restore();
    }

    function main(time) {
        manageTime(time);
        ctx.clearRect(0, 0, width, height);
        renderBackground();
        renderSpinner();
        animation = requestAnimationFrame(main);
    }

    requestAnimationFrame(main);
})();



(function() {

    var canvas = document.getElementById('demoCanvas');
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var lastTime = 0;
    var totalTime = 0;
    var twoPi = Math.PI * 2;
    var spinnerParts = 16;
    var spinnerRadius = 50;
    var spinnerPartRadius = (twoPi * spinnerRadius / spinnerParts) / 2;

    function manageTime(time) {
        totalTime += (time - lastTime) / 1000;
        lastTime = time;
    }

    function renderBackground() {
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, width, height);
    }

    function renderSpinner() {
        var rotation = (totalTime * spinnerParts).toFixed() / spinnerParts;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(rotation * twoPi);
        for (var i = 0; i < spinnerParts; i++) {
            ctx.beginPath();
            ctx.rotate(twoPi / spinnerParts);
            ctx.fillStyle = 'rgba(77, 77, 77,' + i / spinnerParts + ')';
            ctx.arc(spinnerRadius, 0, spinnerPartRadius, 0, twoPi);
            ctx.fill();
        }
        ctx.restore();
    }

    function main(time) {
        manageTime(time);
        ctx.clearRect(0, 0, width, height);
        renderBackground();
        renderSpinner();
        animation = requestAnimationFrame(main);
    }

    requestAnimationFrame(main);


})();
