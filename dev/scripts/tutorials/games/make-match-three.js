(function() {

var canvas = document.getElementById('matchThreeCanvasGrid');
var ctx = canvas.getContext('2d');
var bgCanvas = document.getElementById('matchThreeCanvas');
var bgCtx = bgCanvas.getContext('2d');
bgCtx.font = 'Bold 42px Arial Black';
var lastTime = 0;
var deltaTime = 0;
var animation;
var isPaused = false;
var width = canvas.width;
var height = canvas.height;
var worldUnits = 8;
var unit = 0;
var columns = [];
var isDragging = false;
var canvasRect = 0;
var ratioX;
var ratioY;
var picks = [];
var increment = 0;
var score = 0;
var baseScore = 50;
var multiplier = 1;
var isDemoMode = true;
var availableMove = false;
var mainGameTime = 60;
var mainGameTimer = 0;
var isShuffling = false;

// timers
var displayAvailableMoveTimer = 0;
var displayAvailableMoveTime = 5;
var cpuMoveTimer = 0;
var cpuMoveTime = 1;

// gems
var gem1 = new Image();
var gem2 = new Image();
var gem3 = new Image();
var gem4 = new Image();
var gem5 = new Image();
var gem6 = new Image();
var bgImg = new Image();
var imagePath = '/images/games/puzzle/match-three/';
var cellPadding = 0;

gem1.src = imagePath + 'blue-gems/blue_01.png';
gem2.src = imagePath + 'green-gems/green_02.png';
gem3.src = imagePath + 'pink-gems/pink_03.png';
gem4.src = imagePath + 'purple-gems/purple_04.png';
gem5.src = imagePath + 'red-gems/red_05.png';
gem6.src = imagePath + 'yellow-gems/yellow_06.png';
bgImg.src = imagePath + 'bg.png';
var gems = [gem1, gem2, gem3, gem4, gem5, gem6];
var colours = ['rgba(150, 150, 255, 0.4)', 'rgba(0, 255, 0, 0.4)', 'rgba(255, 192, 203, 0.6)', 'rgba(128, 0, 128, 0.4)', 'rgba(255, 0, 0, 0.4)', 'rgba(255, 255, 0, 0.4)'];

var recentMatches = [];
var recentMatchLifeSpan = 0.8;

var isSwitching = false;
var switchesMade = 0;
var isReverting = false;
var showShuffleMessage = false;

function init() {
    handleResize();
    createColumns();
    score = 0;
    mainGameTimer = mainGameTime;
}



function handleResize() {
    canvasRect = canvas.getBoundingClientRect();
    ratioX = canvasRect.width / width;
    ratioY = canvasRect.height / height;
    unit = ~~(width / worldUnits);
    cellPadding = unit / 7.5;
    increment = unit / 10;
    createColumns();
}

function inUnits(value) {
    return value * unit;
}

function createColumns() {
    columns = [];
    for(var i = 0; i < worldUnits; i++) {
        var disallowedXImage = false;
        columns[i] = [];
        for(var j = 0; j < worldUnits; j++) {
            var disallowedYImage = false; // check if the previous 2 colours are the same vertically
            if(i > 1 && columns[i - 1][j].img === columns[i - 2][j].img){
                disallowedXImage = columns[i - 1][j].img;
            }
            if(j > 1 && columns[i][j - 1].img === columns[i][j - 2].img){
                disallowedYImage = columns[i][j - 1].img; // check if the previous 2 colours are the same horizontally
            }
            var randomImage = randomNumber(0, gems.length);
            while((disallowedYImage !== false && randomImage === disallowedYImage) || (disallowedXImage !== false && randomImage === disallowedXImage)) {
                randomImage = randomNumber(0, gems.length); // if already two identical items, the third can't be the same or it would make a match
            }
            columns[i].push({x: inUnits(i), y: inUnits(j), img: randomImage});
        }
    }
}

function updateColumns() {
    if(isShuffling) {
        handleBoardShuffle();
        return;
    }
    var requiresMovement = false;
    for(var i = 0; i < columns.length; i++) {
        if(columns[i].length !== columns.length) { // if the column isn't full replace missing pieces
            var deficit = columns.length - columns[i].length;
            for(var k = 0; k < deficit; k++) {
                columns[i].unshift({x: inUnits(i), y: inUnits(-(k + 1)), img: randomNumber(0, gems.length)});
            }
        }
        for(var j = 0; j < columns[i].length; j++) {
            if(columns[i][j].x !== inUnits(i)) { // check if pieces are displaying in the correct x position
                columns[i][j].x += columns[i][j].x > inUnits(i) ? -increment : increment;
                columns[i][j].x = parseFloat(columns[i][j].x.toFixed(2));
                requiresMovement = true;
            }
            if(columns[i][j].y !== inUnits(j)) { // check if pieces are displaying in the correct y position
                columns[i][j].y += columns[i][j].y > inUnits(j) ? -increment : increment;
                columns[i][j].y = parseFloat(columns[i][j].y.toFixed(2));
                requiresMovement = true;
            }
        }
    }
    if(!requiresMovement) { // the grid is static
        var matches = findMatches();
        handlePlayerSwitches(matches);
        if(matches.length > 0) {
            removeMatches(matches);
        } else {
            multiplier = 1;
            if(!availableMove) {
                availableMove = findAvailableMoves();
            }
        }
    } else { // the grid still needs updating
        availableMove = false;
        displayAvailableMoveTimer = 0;
    }

}

function updateRecentMatches() {
    for(var i = recentMatches.length - 1; i >= 0; i--) {
        recentMatches[i].existedFor += deltaTime;
        if(recentMatches[i].existedFor >= recentMatchLifeSpan) {
            recentMatches.splice(i, 1);
        }
    }
}

function handlePlayerSwitches(matches) {
    if(!isSwitching) {
        return;
    }
    if(matches.length === 0 && switchesMade < 1) { // the switch needs reverting
        switchesMade++;
        picks.reverse();
        handleSwitch();
    } else { // there was a match or the switch has been reverted
        clearpicks();
    }
}

function renderColumns() {
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.textBaseline = 'middle';
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns[i].length; j++) {
            ctx.beginPath();
            if(availableMove !== false && availableMove.x === i && availableMove.y === j && displayAvailableMoveTimer > displayAvailableMoveTime) {
                renderSelectedElement(columns[i][j].x, columns[i][j].y, 'red');
            }
            if(picks.length === 1 && picks[0].x === i && picks[0].y === j) {
                renderSelectedElement(columns[i][j].x, columns[i][j].y, 'yellow');
            }
            ctx.drawImage(gems[columns[i][j].img], columns[i][j].x + cellPadding, columns[i][j].y + cellPadding, unit - (cellPadding * 2), unit - (cellPadding * 2));
            ctx.fill();
            ctx.stroke();
        }
    }
}

function renderRecentMatches() {
    for(var i = 0; i < recentMatches.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = recentMatches[i].colour;
        ctx.rect(recentMatches[i].x, recentMatches[i].y, unit, unit);
        ctx.fill();
    }
}

function renderSelectedElement(x, y, colour) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + unit / 5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + unit / 5);

    ctx.moveTo(x + unit, y);
    ctx.lineTo(x + unit - unit / 5, y);
    ctx.moveTo(x + unit, y);
    ctx.lineTo(x + unit, y + unit / 5);

    ctx.moveTo(x, y + unit);
    ctx.lineTo(x, y + unit - unit / 5);
    ctx.moveTo(x, y + unit);
    ctx.lineTo(x + unit / 5, y + unit);

    ctx.moveTo(x + unit, y + unit);
    ctx.lineTo(x + unit - unit / 5, y + unit);
    ctx.moveTo(x + unit, y + unit);
    ctx.lineTo(x + unit, y + unit - unit / 5);
    ctx.stroke();
    ctx.lineWidth = 1;
}

function renderGrid() {
    var colours = ['rgba(128, 128, 128, 0.95)', 'rgba(169, 169, 169, 0.95)'];
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns.length; j++) {
            ctx.fillStyle = !!(j + i & 1) ? colours[1] : colours[0];
            ctx.fillRect(inUnits(i), inUnits(j), unit, unit);
        }
    }
}

function renderBackground() {
    bgCtx.drawImage(bgImg, 0, 0, bgCanvas.width, bgCanvas.height);
}

function renderScore() {
    bgCtx.beginPath();
    bgCtx.fillStyle = 'rgba(169, 0, 0, 1)';
    bgCtx.textBaseline = 'hanging';
    bgCtx.textAlign = 'center';
    bgCtx.fillText('Score: ' + score,  bgCanvas.width / 2, 10);
}

function renderMainGameTimer() {
    var hue = 120 * (mainGameTimer / mainGameTime);
    var currentTimeWidth = (bgCanvas.width - 20) * (mainGameTimer / mainGameTime);
    bgCtx.fillStyle = 'rgba(188, 188, 188, 0.6)';
    bgCtx.beginPath();
    bgCtx.rect(10, bgCanvas.height - 50, bgCanvas.width - 20, 30);
    bgCtx.fill();

    bgCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    bgCtx.beginPath();
    bgCtx.rect(10, bgCanvas.height - 50, currentTimeWidth, 30);
    bgCtx.fill();

    bgCtx.beginPath();
    bgCtx.textAlign = 'center';
    bgCtx.textBaseline = 'bottom';
    bgCtx.fillText('Time: ' + mainGameTimer.toFixed(), bgCanvas.width / 2, bgCanvas.height - 50);
}

function setDeltaTime(time) {
    deltaTime = time - lastTime < 250 ? (time - lastTime) / 1000 : 0.0167;
    lastTime = time;
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
}

function randomNumber(min, max) {
    return ~~(Math.random() * (max - min)) + min;
}

function removeMatches(matches) {
    var alreadyRemoved = [];
    for(var i = 0; i < matches.length; i++) {
        if(alreadyRemoved.filter(findMatching).length === 0) {
            recentMatches.push({x: inUnits(matches[i].x), y: inUnits(matches[i].y), colour: colours[columns[matches[i].x][matches[i].y].img], existedFor: 0});
            columns[matches[i].x].splice(matches[i].y, 1); // remove from array
            alreadyRemoved.push({x: matches[i].x, y: matches[i].y}); // add to removed array
        }
    }

    function findMatching(el) {
        return el.x === matches[i].x && el.y === matches[i].y;
    }

    score += matches.length * baseScore * multiplier;
}

function findMatches() {
    var matches = [];
    matches = matches.concat(findVerticalMatches());
    matches = matches.concat(findHorizontalMatches());
    matches.sort(function(a, b) {
        return b.y < a.y ? -1 : b.y > a.y ? 1 : 0;
    });
    return matches;
}

function findVerticalMatches() {
    var matches = [];
        for(var i = 0; i < columns.length; i++) {
            var matchLength = 1;
            var squareToMatch = false;
            for(var j = 0; j < columns[i].length; j++) {
                matchLength = columns[i][j].img === squareToMatch ? ++matchLength : 1;
                squareToMatch = columns[i][j].img;
                if(matchLength === 3) {
                    matches.push({x: i, y: j - 2}, {x: i, y: j - 1}, {x: i, y: j});
                }
                if(matchLength === 4) {
                    matches.push({x: i, y: j});
                }
                if(matchLength === 5) {
                    matches.push({x: i, y: j});
                }
            }
        }
    return matches;
}

function findHorizontalMatches() {
    var matches = [];
    for(var i = 0; i < columns.length; i++) {
        var matchLength = 1;
        var squareToMatch = false;
        for(var j = 0; j < columns.length; j++) {
            matchLength = columns[j][i].img === squareToMatch ? ++matchLength : 1;
            squareToMatch = columns[j][i].img;
            if(matchLength === 3) {
                matches.push({x: j - 2, y: i}, {x: j - 1, y: i}, {x: j, y: i});
            }
            if(matchLength === 4) {
                matches.push({x: j, y: i});
            }
            if(matchLength === 5) {
                matches.push({x: j, y: i});
            }
        }
    }
    return matches;
}

function findAvailableMoves() {
    var locatedMatch = false;
    var loopIndex = 0;
    for(var i = randomNumber(0, columns.length); loopIndex < columns.length; i = (i + 1) % columns.length) {
        loopIndex++;
        for(var j = 0; j < columns.length; j++) {
            var temp = columns[i][j];
            var mods = [{x: i - 1, y: j, condition: i !== 0, direction: 'left'},
                        {x: i + 1, y: j, condition: i !== columns.length -1, direction: 'right'},
                        {x: i, y: j - 1, condition: j !== 0, direction: 'up'},
                        {x: i, y: j + 1, condition: j !== columns.length -1, direction: 'down'}];
            for(var k = 0; k < 4; k++) {
                if(mods[k].condition && !locatedMatch) {
                    columns[i][j] = columns[mods[k].x][mods[k].y];
                    columns[mods[k].x][mods[k].y] = temp;
                    matches = findMatches();
                    locatedMatch = matches.length > 0 &&
                        columns[matches[0].x][matches[0].y].img === temp.img &&
                        columns[matches[1].x][matches[1].y].img === temp.img &&
                        columns[matches[2].x][matches[2].y].img === temp.img;
                    columns[mods[k].x][mods[k].y] = columns[i][j];
                    columns[i][j] = temp;
                    if(locatedMatch) {
                        return {x: i, y: j, direction: mods[k].direction};
                    }
                }
            }
        }
    }
    if(!locatedMatch) {
        handleBoardShuffle();
        return false;
    }
}

function handleBoardShuffle() {
    isShuffling = true;
    showShuffleMessage = true;
    var hasCentred = true;
    var centerX = width / 2 - inUnits(0.5);
    var centerY = height / 2 - inUnits(0.5);
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns.length; j++) {
            if(columns[i][j].x > centerX + increment || columns[i][j].x < centerX - increment) {
                columns[i][j].x += columns[i][j].x > centerX ? -increment : increment;
                columns[i][j].x = parseFloat(columns[i][j].x.toFixed(2));
                hasCentred = false;
            }
            if(columns[i][j].y > centerY + increment || columns[i][j].y < centerY - increment) {
                columns[i][j].y += columns[i][j].y > centerY ? -increment : increment;
                columns[i][j].y = parseFloat(columns[i][j].y.toFixed(2));
                hasCentred = false;
            }
        }
    }
    if(hasCentred) {
        columns.forEach(function(column) {
            column.forEach(function(item) {
                item.img = randomNumber(0, gems.length);
            });
        });
        isPaused = true;
        setTimeout(function() {
            showShuffleMessage = false;
            isPaused = false;
            isShuffling = false;
            animation = requestAnimationFrame(main);
        }, 500);
    }
}

function renderShuffleMessage() {
    ctx.beginPath();
    ctx.font = 'Bold 42px Arial Black';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'hanging';
    ctx.fillText('No available moves', width / 2, 50);
    ctx.fill();
}

function manageTimers() {
    displayAvailableMoveTimer += deltaTime;
    mainGameTimer -= deltaTime;
    if(mainGameTimer < 0) {
        init();
    }
}

function clearpicks() {
    picks.length = 0;
    isSwitching = false;
    switchesMade = 0;
}

function handleSwitch() {
    var toSwitch = [columns[picks[0].x][picks[0].y], columns[picks[1].x][picks[1].y]];
    var canSwitch = Math.abs(picks[0].x - picks[1].x) + Math.abs(picks[0].y - picks[1].y) <= 1;
    if(canSwitch) {
        columns[picks[0].x][picks[0].y] = toSwitch[1];
        columns[picks[1].x][picks[1].y] = toSwitch[0];
        isSwitching = true;
    } else {
        picks.shift();
    }
}

function handleCpuInput() {
    cpuMoveTimer += deltaTime;
    if(cpuMoveTimer >= cpuMoveTime && availableMove) {
        cpuMoveTimer = 0;
        if(picks.length === 1) {
            picks[0] = {x: availableMove.x, y: availableMove.y};
            picks[1] = {
                x: availableMove.direction === 'left' ? availableMove.x - 1 : availableMove.direction === 'right' ? availableMove.x + 1 : availableMove.x,
                y: availableMove.direction === 'up' ? availableMove.y - 1 : availableMove.direction === 'down' ? availableMove.y + 1 : availableMove.y
            };
            handleSwitch();
        } else {
            picks[0] = {x: availableMove.x, y: availableMove.y};
        }
    }
}

function handleMouseDown(e) {
    isDragging = true;
    var x = ~~((e.x - canvasRect.x) / (unit * ratioX));
    var y = ~~((e.y - canvasRect.y) / (unit * ratioY));
    picks.push({x: x, y: y});
    return picks.length === 2 ? handleSwitch() : false;
}

function handleMouseUp(e) {
    if(isSwitching) {
        return;
    }
    isDragging = false;
    return picks.length === 2 ? handleSwitch() : false;
}

function handleMouseMove(e) {
    if(!isDragging || picks.length < 1) {
        return;
    }
    var x = ~~((e.x - canvasRect.x) / (unit * ratioX));
    var y = ~~((e.y - canvasRect.y) / (unit * ratioY));
    if(x !== picks[0].x || y !== picks[0].y) {
        picks[1] = {x: x, y: y};
        handleSwitch();
        isDragging = false;
    } else {
        picks.length = 1;
    }
}

// main method
function main(time) {
    setDeltaTime(time);
    manageTimers();
    clearCanvas();
    if(isDemoMode) {
        handleCpuInput();
    }
    updateColumns();
    updateRecentMatches();
    renderBackground();
    renderGrid();
    renderRecentMatches();
    renderColumns();
    renderScore();
    if(showShuffleMessage) {
        renderShuffleMessage();
    }
    renderMainGameTimer();
    if(!isPaused) {
        animation = requestAnimationFrame(main);
    }
}

init();
animation = requestAnimationFrame(main);

window.addEventListener('resize', handleResize);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseout', clearpicks);


}());
