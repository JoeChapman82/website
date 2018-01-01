(function() {
    "use strict";
    var canvas = document.getElementById('demoCanvasTop');
    var ctx = canvas.getContext('2d');
    var animation;
    var canvas2 = document.getElementById('demoCanvas');
    var ctx2 = canvas2.getContext('2d');
    var charSets = [];
    var chars = 'アイウエオガギグゲゴサザジズゼゾダヂツデドナニヌネノハバパヒビピフブプベホボポマミムメモヨリヰヲヸヹヺ'.split('');
    var fontSize = 16;
    var lastTime = 0;
    var fadeRate = 0.03;
    var whiteChars = 2;
    var maxCharAmount = Math.ceil(1 / fadeRate + whiteChars);
    var columns = Math.ceil(canvas.width / fontSize);
    ctx.font = fontSize + 'px arial';
    ctx2.font = fontSize + 'px arial';

    function init() {
        for(var i = 0; i < columns; i++) {
            charSets[i] = buildCharSet();
        }
    }

    function buildCharSet() {
        return {position: -Math.random() * 100, chars: [randomChar()]};
    }

    function randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function updateMatix() {
        for(var i = 0; i < charSets.length; i++) {
            charSets[i].chars.unshift(randomChar());
            charSets[i].chars.length = Math.min(charSets[i].chars.length, maxCharAmount);
            charSets[i].position++;
            if(charSets[i].position * fontSize > (canvas.height + fontSize / fadeRate)) {
                charSets[i] = buildCharSet();
            } else {
                charSets[i].chars.forEach(function(char, index) {
                    charSets[i].chars[index] = Math.random() > 0.98 ? randomChar() : char;
                });
            }
        }
    }

    function renderMatrix(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        charSets.forEach(function(charSet, index) {
            var opacity = 1;
            var textPosition = charSet.position;
            for(var i = 0; i < charSet.chars.length; i++) {
                if(textPosition >= 0 && textPosition < canvas.height + fontSize) {
                    ctx.fillStyle = i > whiteChars - 1 ? 'rgba(123, 250, 126, ' + opacity + ')' : 'rgba(255, 255, 255, ' + (opacity - (i * fadeRate * 8)) + ')';
                    ctx.fillText(charSet.chars[i], index * fontSize, textPosition * fontSize);
                }
                textPosition -= 1;
                opacity -= fadeRate;
            }
        });
    }

    function main(time) {
        if(animation % 5 === 0) {
            updateMatix();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderMatrix(ctx);
        renderMatrix(ctx2);
        animation = requestAnimationFrame(main);
    }

    init();
    animation = requestAnimationFrame(main);

})();
