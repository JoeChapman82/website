(function() {
    // firefox sucks at canvas text rendering - so use single columns with a static font size
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var charSets = [];
    var chars = 'アイウエオガギグゲゴサザジズゼゾダヂツデドナニヌネノハバパヒビピフブプベホボポマミムメモヨリヰヲヸヹヺ'.split('');
    var fontSize = 18;
    var minFontSize = 10;
    var lastTime = 0;
    var minFadeRate = 0.02;
    var fadeRates = [0.02, 0.025, 0.03, 0.05];
    var whiteChars = 1;
    var maxCharAmount = Math.ceil(1 / minFadeRate + whiteChars);
    var columns = isFirefox ? Math.ceil(canvas.width / fontSize) : Math.ceil(canvas.width / fontSize) * 2;
    var backgroundColour = 'rgba(0, 0, 0, 1)';
    var charPrimaryColours = ['rgba(255, 255, 255, 1)', 'rgba(215, 215, 215, 1)', 'rgba(175, 175, 175, 1)', 'rgba(135, 135, 135, 1)'];
    var charSecondaryColours = ['rgba(123, 250, 126, 1)', 'rgba(83, 210, 86, 1)', 'rgba(43, 170, 46, 1)', 'rgba(3, 130, 6, 1)'];
    var rate = 5;
    var maxSpeed = 5;
    ctx.font = '16px arial';

    window.addEventListener('resize', function() {
        cancelAnimationFrame(animation);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.ceil(canvas.width / fontSize);
        init();
        animation = requestAnimationFrame(main);
    });

    function init() {
        for(var i = 0; i < columns; i++) {
            charSets[i] = buildCharSet();
        }
    }
    function convertHex(hex){
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
    }

    function convertRgba(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    function setOpacity(rgba, opacity) {
        var colourParts = rgba.split(',');
        colourParts[3] = opacity + ')';
        return colourParts.toString();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function buildCharSet() {
        var selectedColour = getRandomInt(0, charPrimaryColours.length);
        return {
            position: getRandomInt(-100, canvas.height / fontSize * 0.66),
            chars: [randomChar()],
            size: getRandomInt(minFontSize, fontSize),
            speed: getRandomInt(4, 10),
            primaryColour: charPrimaryColours[selectedColour],
            secondaryColour: charSecondaryColours[selectedColour],
            fadeRate: fadeRates[getRandomInt(0, fadeRates.length)]
            };
    }

    function randomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function updateMatix() {
        for(var i = 0; i < charSets.length; i++) {
            if(animation % charSets[i].speed === 0) {
                charSets[i].chars.unshift(randomChar());
                charSets[i].chars.length = Math.min(charSets[i].chars.length, maxCharAmount);
                charSets[i].position++;
                if(charSets[i].position * charSets[i].size > (canvas.height + charSets[i].size / charSets[i].fadeRate)) {
                    charSets[i] = buildCharSet();
                } else {
                    charSets[i].chars.forEach(function(char, index) {
                        charSets[i].chars[index] = getRandomInt(0, 100) > 97 ? randomChar() : char;
                    });
                }
            }
        }
    }

    function renderMatrix() {
        ctx.fillStyle = backgroundColour;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        charSets.forEach(function(charSet, index) {
            var opacity = 1;
            var textPosition = charSet.position;
            for(var i = 0; i < charSet.chars.length; i++) {
                if(textPosition >= 0 && textPosition < canvas.height + fontSize) {
                    if(!isFirefox) {
                        ctx.font = charSet.size + 'px arial';
                        ctx.fillStyle = i > whiteChars - 1 ? setOpacity(charSet.secondaryColour, opacity) : setOpacity(charSet.primaryColour, (opacity - (i * charSet.fadeRate * 8)));
                        ctx.fillText(charSet.chars[i], Math.floor(index / 2) * fontSize, textPosition * fontSize);
                    } else {
                        ctx.fillStyle = i > whiteChars - 1 ? setOpacity(charSet.secondaryColour, opacity) : setOpacity(charSet.primaryColour, (opacity - (i * charSet.fadeRate * 8)));
                        ctx.fillText(charSet.chars[i], index * fontSize, textPosition * fontSize);
                    }
                }
                textPosition -= 1;
                opacity -= charSet.fadeRate;
            }
        });
    }

    function main(time) {
        console.log((time - lastTime) / 1000);
        lastTime = time;
            updateMatix();
        if (animation % 2 === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderMatrix();
        }

        animation = requestAnimationFrame(main);
    }

    init();
    animation = requestAnimationFrame(main);
})();
