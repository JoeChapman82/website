(function() {

var canvas = document.getElementById('matchThreeCanvasMiddle');
var ctx = canvas.getContext('2d');
var topCanvas = document.getElementById('matchThreeCanvasTop');
var topCtx = topCanvas.getContext('2d');
var bottomCanvas = document.getElementById('matchThreeCanvasBottom');
var bottomCtx = bottomCanvas.getContext('2d');
var gameOverCanvas = document.getElementById('matchThreeGameOverCanvas');
var gameOverCtx = gameOverCanvas.getContext('2d');
topCtx.font = 'Bold 42px Arial Black';
bottomCtx.font = 'Bold 42px Arial Black';
gameOverCtx.font = 'Bold 72px Arial Black';
gameOverCtx.lineWidth = 8;
gameOverCtx.strokeStyle = 'hsl(0, 100%, 50%)';
gameOverCtx.fillStyle = 'hsl(0, 100%, 50%)';
gameOverCtx.textAlign = 'center';
gameOverCtx.textBaseline = 'hanging';
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
var isDemoMode = false;
var availableMove = false;
var mainGameTime = 60;
var mainGameTimer = 0;
var isShuffling = false;
var requiresMovement = false;
var selectionPermitted = false;

// timers
var displayAvailableMoveTimer = 0;
var displayAvailableMoveTime = 5;
var cpuMoveTimer = 0;
var cpuMoveTime = 1;

// gems
var gem1 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var gem2 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var gem3 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var gem4 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var gem5 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var gem6 = {normal: new Image(), horizontal: new Image(), vertical: new Image()};
var destroyerGem = new Image();
var bgImg = new Image();
var imagePath = '/images/games/puzzle/match-three/';
var cellPadding = 0;

gem1.normal.src = imagePath + 'blue-gems/blue_01.png';
gem1.horizontal.src = imagePath + 'blue-gems/blue_horizontal.png';
gem1.vertical.src = imagePath + 'blue-gems/blue_vertical.png';

gem2.normal.src = imagePath + 'green-gems/green_02.png';
gem2.horizontal.src = imagePath + 'green-gems/green_horizontal.png';
gem2.vertical.src = imagePath + 'green-gems/green_vertical.png';

gem3.normal.src = imagePath + 'pink-gems/pink_03.png';
gem3.horizontal.src = imagePath + 'pink-gems/pink_horizontal.png';
gem3.vertical.src = imagePath + 'pink-gems/pink_vertical.png';

gem4.normal.src = imagePath + 'purple-gems/purple_04.png';
gem4.horizontal.src = imagePath + 'purple-gems/purple_horizontal.png';
gem4.vertical.src = imagePath + 'purple-gems/purple_vertical.png';

gem5.normal.src = imagePath + 'red-gems/red_05.png';
gem5.horizontal.src = imagePath + 'red-gems/red_horizontal.png';
gem5.vertical.src = imagePath + 'red-gems/red_vertical.png';

gem6.normal.src = imagePath + 'yellow-gems/yellow_06.png';
gem6.horizontal.src = imagePath + 'yellow-gems/yellow_horizontal.png';
gem6.vertical.src = imagePath + 'yellow-gems/yellow_vertical.png';

destroyerGem.src = imagePath + 'multicolor-gems/mc_03.png';
bgImg.src = imagePath + 'bg.png';
var gems = [gem1, gem2, gem3, gem4, gem5, gem6];
var specialGems = [destroyerGem];
var colours = ['rgba(150, 150, 255, 0.4)', 'rgba(0, 255, 0, 0.4)', 'rgba(255, 192, 203, 0.6)', 'rgba(128, 0, 128, 0.4)', 'rgba(255, 0, 0, 0.4)', 'rgba(255, 255, 0, 0.4)'];

var recentMatches = [];
var recentMatchLifeSpan = 0.8;
var specialPositions = [];

var isSwitching = false;
var switchesMade = 0;
var isReverting = false;
var showShuffleMessage = false;
var availableShuffles = 3;
var availableExplodes = 1;
var secretCode = [];

var screens = {
    titleScreen: function() {return titleScreen();},
    loadingScreen: function() {return loadingScreen();},
    gameScreen: function() {return gameScreen();},
    settingsScreen: function() {return settingsScreen();},
    howToScreen: function() {return howToScreen();},
    pauseScreen: function() {return pauseScreen();},
    gameOverScreen: function() {return gameOverScreen();}
};

var activeScreen = 'titleScreen';

// Buttons
var pauseButton = document.getElementById('matchThreePauseButton');
var explodeButton = document.getElementById('matchThreeExplodeButton');
var shuffleButton = document.getElementById('matchThreeShuffleButton');
var playButton = document.getElementById('startGameButton');

function init() {
    handleResize();
    createColumns();
    selectionPermitted = true;
    availableMove = false;
    score = 0;
    availableShuffles = 3;
    availableExplodes = 1;
    shuffleButton.classList.remove('match-three-inactive-button');
    explodeButton.classList.remove('match-three-inactive-button');
    mainGameTimer = mainGameTime;
}



function handleResize() {
    canvasRect = canvas.getBoundingClientRect();
    ratioX = canvasRect.width / width;
    ratioY = canvasRect.height / height;
    unit = ~~(width / worldUnits);
    cellPadding = unit / 7.5;
    increment = unit / 10;
    availableMove = false;
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
    requiresMovement = false;
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
        var matches = findMatches(true);
        matches = handlePlayerSwitches(matches);
        if(matches.length > 0) {
            requiresMovement = true;
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
        return matches;
    }
    var specialMoves = handleSpecialMoves(matches);
    if(specialMoves.hadSpeciaMove) {
        clearpicks();
        return specialMoves.matches;
    }
    if(matches.length === 0 && switchesMade < 1) { // the switch needs reverting
        switchesMade++;
        picks.reverse();
        handleSwitch();
    } else { // there was a match or the switch has been reverted
        clearpicks();
    }
    return matches;
}

function handleSpecialMoves(matches) {
    // colourKiller moves
    if(columns[picks[0].x][picks[0].y].specialType === 'colourKiller' && columns[picks[1].x][picks[1].y].specialType === 'colourKiller') {
        matches = findAllGems();
        return {hadSpeciaMove: true, matches: matches};
    } else if(columns[picks[0].x][picks[0].y].specialType === 'colourKiller') {
        matches.push({x: picks[0].x, y: picks[0].y});
        matches = matches.concat(findAllMatchingColours(columns[picks[1].x][picks[1].y].img));
        return {hadSpeciaMove: true, matches: matches};
    } else if(columns[picks[1].x][picks[1].y].specialType === 'colourKiller') {
        matches.push({x: picks[1].x, y: picks[1].y});
        matches = matches.concat(findAllMatchingColours(columns[picks[0].x][picks[0].y].img));
        return {hadSpeciaMove: true, matches: matches};
    }
    return {hadSpeciaMove: false};
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
            var imageToRender;
            if(columns[i][j].isSpecial) {
                imageToRender = columns[i][j].specialImg !== undefined ? specialGems[columns[i][j].specialImg] : columns[i][j].specialType === 'vertical' ? gems[columns[i][j].img].vertical : gems[columns[i][j].img].horizontal;
            } else {
                imageToRender = gems[columns[i][j].img].normal;
            }
            ctx.drawImage(imageToRender, columns[i][j].x + cellPadding, columns[i][j].y + cellPadding, unit - (cellPadding * 2), unit - (cellPadding * 2));
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

function renderBorder() {
    topCtx.lineWidth = 8;
    bottomCtx.lineWidth = 8;
    var hue = mainGameTimer > 5 ? 60 : Math.abs(60 * (mainGameTimer - Math.floor(mainGameTimer) - 0.5) / 0.5);
    topCtx.strokeStyle = 'hsl(' + hue + ', 100%, 50%)';
    bottomCtx.strokeStyle = 'hsl(' + hue + ', 100%, 50%)';

    topCtx.beginPath();
    topCtx.moveTo(0, topCanvas.height);
    topCtx.lineTo(topCanvas.width, topCanvas.height);
    topCtx.stroke();

    bottomCtx.beginPath();
    bottomCtx.moveTo(0, 0);
    bottomCtx.lineTo(bottomCanvas.width, 0);
    bottomCtx.stroke();
}

function renderScore() {
    topCtx.beginPath();
    topCtx.fillStyle = 'rgba(169, 0, 0, 1)';
    topCtx.textBaseline = 'middle';
    topCtx.textAlign = 'center';
    topCtx.fillText('Score: ' + score,  topCanvas.width / 2, topCanvas.height / 2);
}

function renderMainGameTimer() {
    var hue = 120 * (mainGameTimer / mainGameTime);
    var currentTimeWidth = (bottomCanvas.width - 20) * (mainGameTimer / mainGameTime);
    bottomCtx.fillStyle = 'rgba(188, 188, 188, 0.6)';
    bottomCtx.beginPath();
    bottomCtx.rect(10, bottomCanvas.height - 50, bottomCanvas.width - 20, 30);
    bottomCtx.fill();

    bottomCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    bottomCtx.beginPath();
    bottomCtx.rect(10, bottomCanvas.height - 50, currentTimeWidth, 30);
    bottomCtx.fill();

    bottomCtx.beginPath();
    bottomCtx.textAlign = 'center';
    bottomCtx.textBaseline = 'bottom';
    bottomCtx.fillText('Time: ' + mainGameTimer.toFixed(), bottomCanvas.width / 2, bottomCanvas.height - 50);
}

function renderGameOver() {
    gameOverCtx.clearRect(0, 0, gameOverCanvas.width, gameOverCanvas.height);
    gameOverCtx.beginPath();
    gameOverCtx.moveTo(0, gameOverCanvas.height);
    gameOverCtx.lineTo(gameOverCanvas.width, gameOverCanvas.height);
    gameOverCtx.stroke();

    gameOverCtx.beginPath();
    gameOverCtx.moveTo(0, 0);
    gameOverCtx.lineTo(gameOverCanvas.width, 0);
    gameOverCtx.stroke();

    gameOverCtx.beginPath();
    gameOverCtx.fillText('GAME OVER', gameOverCanvas.width / 2, 50);
    gameOverCtx.fillText('Score: ' + score, gameOverCanvas.width / 2, 150);
    gameOverCtx.fill();
}

function setDeltaTime(time) {
    deltaTime = time - lastTime < 250 ? (time - lastTime) / 1000 : 0.0167;
    lastTime = time;
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
    bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height);
}

function randomNumber(min, max) {
    return ~~(Math.random() * (max - min)) + min;
}

function removeMatches(matches) {
    // first loop through the matches, find the specials and push to an array
    var additionalMatches = [];
    for(var j = 0; j < matches.length; j++) {
        if(columns[matches[j].x][matches[j].y].specialType === 'horizontal') {
            additionalMatches.push(findAllGemsInRow(matches[j].y, columns[matches[j].x][matches[j].y].img));
        }
        if(columns[matches[j].x][matches[j].y].specialType === 'vertical') {
            additionalMatches.push(findAllGemsInColumn(matches[j].x, columns[matches[j].x][matches[j].y].img));
        }
    }
    // loop over the array adding to the matches
    for(var k = 0; k < additionalMatches.length; k++) {
        matches = matches.concat(additionalMatches[k]);
    }
    // sort the array so the lowest removals are at the end of each column array to make splicing easier
    matches.sort(function(a, b) {
        return b.y < a.y ? -1 : b.y > a.y ? 1 : 0;
    });
    var alreadyRemoved = [];
    for(var i = 0; i < matches.length; i++) {
        if(alreadyRemoved.filter(findMatching).length === 0) {
            recentMatches.push({x: inUnits(matches[i].x), y: inUnits(matches[i].y), colour: colours[columns[matches[i].x][matches[i].y].img], existedFor: 0});
            if(matches[i].isSpecial) {
                columns[matches[i].x][matches[i].y].isSpecial = true;
                columns[matches[i].x][matches[i].y].specialType = matches[i].properties.specialType;
                if(typeof matches[i].properties.specialImg !== 'undefined') {
                    columns[matches[i].x][matches[i].y].specialImg = matches[i].properties.specialImg;
                    columns[matches[i].x][matches[i].y].img = 'x';
                }
            } else {
                columns[matches[i].x].splice(matches[i].y, 1); // remove from array
            }
            alreadyRemoved.push({x: matches[i].x, y: matches[i].y}); // add to removed array
        }
    }

    function findMatching(el) {
        return el.x === matches[i].x && el.y === matches[i].y;
    }
    score += matches.length * baseScore * multiplier;
}

function findMatches(toRemove) {
    specialPositions.length = 0;
    var matches = [];
    matches = matches.concat(findVerticalMatches(toRemove));
    matches = matches.concat(findHorizontalMatches(toRemove));
    return matches;
}

function findVerticalMatches(toRemove) {
    var matches = [];
        for(var i = 0; i < columns.length; i++) {
            var matchLength = 1;
            var squareToMatch = false;
            for(var j = 0; j < columns[i].length; j++) {
                matchLength = columns[i][j].img === squareToMatch && columns[i][j].img !== 'x' ? ++matchLength : 1;
                squareToMatch = columns[i][j].img;
                if(matchLength === 3) {
                    matches.push({x: i, y: j - 2}, {x: i, y: j - 1}, {x: i, y: j});
                }
                if(matchLength === 4) {
                    if(toRemove) {
                        matches[matches.length - 2].isSpecial = true;
                        matches[matches.length - 2].properties = {specialType: 'horizontal'};
                    }
                    matches.push({x: i, y: j});
                }
                if(matchLength === 5) {
                    if(toRemove) {
                        delete matches[matches.length - 3].isSpecial;
                        delete matches[matches.length - 3].properties;
                        matches[matches.length - 2].isSpecial = true;
                        matches[matches.length - 2].properties = {specialType: 'colourKiller', specialImg: 0};
                    }
                    matches.push({x: i, y: j});
                }
            }
        }
    return matches;
}

function findHorizontalMatches(toRemove) {
    var matches = [];
    for(var i = 0; i < columns.length; i++) {
        var matchLength = 1;
        var squareToMatch = false;
        for(var j = 0; j < columns.length; j++) {
            matchLength = columns[j][i].img === squareToMatch && columns[i][j].img !== 'x' ? ++matchLength : 1;
            squareToMatch = columns[j][i].img;
            if(matchLength === 3) {
                matches.push({x: j - 2, y: i}, {x: j - 1, y: i}, {x: j, y: i});
            }
            if(matchLength === 4) {
                if(toRemove) {
                    matches[matches.length - 2].isSpecial = true;
                    matches[matches.length - 2].properties = {specialType: 'vertical'};
                }
                matches.push({x: j, y: i});
            }
            if(matchLength === 5) {
                if(toRemove) {
                    delete matches[matches.length - 3].isSpecial;
                    delete matches[matches.length - 3].properties;
                    matches[matches.length - 2].isSpecial = true;
                    matches[matches.length - 2].properties = {specialType: 'colourKiller', specialImg: 0};
                }
                matches.push({x: j, y: i});
            }
        }
    }
    return matches;
}

function findAllMatchingColours(colour) {
    var matches = [];
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns.length; j++) {
            if(columns[i][j].img === colour) {
                matches.push({x: i, y: j});
            }
        }
    }
    return matches;
}

function findAllGems() {
    var matches = [];
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns.length; j++) {
            matches.push({x: i, y: j});
        }
    }
    return matches;
}

function findAllGemsInColumn(columnNum, colour) {
    var matches = [];
    for(var i = 0; i < columns[columnNum].length; i++) {
        columns[columnNum][i].img = colour;
        matches.push({x: columnNum, y: i});
    }
    return matches;
}

function findAllGemsInRow(rowNum, colour) {
    var matches = [];
    for(var i = 0; i < columns.length; i++) {
        columns[i][rowNum].img = colour;
        matches.push({x: i, y: rowNum});
    }
    return matches;
}

function findAllSpecials() {
    var specials = [];
    for(var i = 0; i < columns.length; i++) {
        for(var j = 0; j < columns[i].length; j++) {
            if(columns[i][j].isSpecial) {
                specials.push({x: i, y: j});
            }
        }
    }
    return specials;
}

function findAvailableMoves() {
    var locatedMatch = false;
    var loopIndex = 0;
    for(var i = randomNumber(0, columns.length); loopIndex < columns.length; i = (i + 1) % columns.length) {
        loopIndex++;
        for(var j = 0; j < columns.length; j++) {
            // if the gem we're dealing with is a special bomb type, we can use it and not search
            if(columns[i][j].specialType === 'colourKiller') {
                return {x: i, y: j, direction: i < columns.left ? 'right' : 'left'};
            }
            var temp = columns[i][j];
            var mods = [{x: i - 1, y: j, condition: i !== 0, direction: 'left'},
                        {x: i + 1, y: j, condition: i !== columns.length -1, direction: 'right'},
                        {x: i, y: j - 1, condition: j !== 0, direction: 'up'},
                        {x: i, y: j + 1, condition: j !== columns.length -1, direction: 'down'}];
            for(var k = 0; k < 4; k++) {
                if(mods[k].condition && !locatedMatch) {
                    columns[i][j] = columns[mods[k].x][mods[k].y];
                    columns[mods[k].x][mods[k].y] = temp;
                    matches = findMatches(false);
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

function manualShuffle() {
    if(!selectionPermitted) {
        return;
    }
    if(availableShuffles > 0 && !isShuffling) {
        availableShuffles--;
        if(availableShuffles === 0) {
            shuffleButton.classList.add('match-three-inactive-button');
        }
        handleBoardShuffle();
    }
}

function triggerSpecials() {
    if(!selectionPermitted) {
        return;
    }
    if(availableExplodes > 0) {
        availableExplodes--;
        if(availableExplodes === 0) {
            explodeButton.classList.add('match-three-inactive-button');
        }
        removeMatches(findAllSpecials());
    }
}

function renderShuffleMessage() {
    ctx.beginPath();
    ctx.font = 'Bold 42px Arial Black';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'hanging';
    ctx.fillText('Shuffling pieces', width / 2, 50);
    ctx.fill();
}

function manageTimers() {
    displayAvailableMoveTimer += deltaTime;
    mainGameTimer -= deltaTime;
    if(mainGameTimer < 0) {
        selectionPermitted = false;
        mainGameTimer = 0;
        if(!requiresMovement) {
            if(findAllSpecials().length === 0) {
                if(isDemoMode) {
                    init();
                } else {
                    activeScreen = 'gameOverScreen';
                    document.getElementById('gameScreen').classList.add('js-hidden');
                    document.getElementById('matchThreeGameOverScreen').classList.remove('js-hidden');
                }
            } else {
                removeMatches(findAllSpecials());
            }
        }
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
    if(!selectionPermitted) {
        return;
    }
    isDragging = true;
    var x = ~~((e.x - canvasRect.x) / (unit * ratioX));
    var y = ~~((e.y - canvasRect.y) / (unit * ratioY));
    picks.push({x: x, y: y});
    return picks.length === 2 ? handleSwitch() : false;
}

function handleTouchStart(e) {
    if(activeScreen !== 'gameScreen') {
        return;
    }
    e.preventDefault();
    isDragging = true;
    var x = ~~((e.touches[0].clientX - canvasRect.x) / (unit * ratioX));
    var y = ~~((e.touches[0].clientY - canvasRect.y) / (unit * ratioY));
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

function handleTouchEnd(e) {
    if(activeScreen !== 'gameScreen') {
        return;
    }
    e.preventDefault();
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

function handleTouchMove(e) {
    if(activeScreen !== 'gameScreen') {
        return;
    }
    e.preventDefault();
    if(!isDragging || picks.length < 1) {
        return;
    }
    var x = ~~((e.touches[0].clientX - canvasRect.x) / (unit * ratioX));
    var y = ~~((e.touches[0].clientY - canvasRect.y) / (unit * ratioY));
    if(x !== picks[0].x || y !== picks[0].y) {
        picks[1] = {x: x, y: y};
        handleSwitch();
        isDragging = false;
    } else {
        picks.length = 1;
    }
}

function handleKeyDown(e) {
    if(activeScreen !== 'titleScreen') {
        return;
    }
    secretCode.push(e.keyCode);
    secretCode.length = secretCode.length > 4 ? 4 : secretCode.length;
    if(secretCode.length === 4 && secretCode[0] === 68 && secretCode[1] === 69 && secretCode[2] === 77 && secretCode[3] === 79) {
        isDemoMode = true;
        document.getElementById('startGameButton').style.backgroundColor = 'red';
    }
}

function changeScreen() {
    document.getElementById(this.dataset.hide).classList.add('js-hidden');
    document.getElementById(this.dataset.show).classList.remove('js-hidden');
    activeScreen = this.dataset.screen;
    if(activeScreen === 'gameScreen') {
        init();
    }
}

function pause() {
    isPaused = !isPaused;
    animation = isPaused ? animation : requestAnimationFrame(main);
}


function titleScreen() {
    ctx.fillStyle = 'rgba(222, 222, 222, 0.1)';
    ctx.fillRect(0, 0, width, height);
}

function gameOverScreen() {
    renderGameOver();
    renderScore();
}

function gameScreen() {
    manageTimers();
    clearCanvas();
    if(isDemoMode) {
        handleCpuInput();
    }
    updateColumns();
    updateRecentMatches();
    renderGrid();
    renderRecentMatches();
    renderColumns();
    renderScore();
    renderBorder();
    if(showShuffleMessage) {
        renderShuffleMessage();
    }
    renderMainGameTimer();
}

// main method
function main(time) {
    setDeltaTime(time);
    screens[activeScreen]();
    if(!isPaused) {
        animation = requestAnimationFrame(main);
    }
}

init();
animation = requestAnimationFrame(main);

window.addEventListener('resize', handleResize);

// click listeners
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseout', clearpicks);

// touch listeners
canvas.addEventListener('touchstart', handleTouchStart, true);
canvas.addEventListener('touchmove', handleTouchMove, true);
canvas.addEventListener('touchend', handleTouchEnd, true);

document.addEventListener('keydown', handleKeyDown);

document.querySelectorAll('.change-screen-button').forEach(function(button) {
    button.addEventListener('click', changeScreen);
});

pauseButton.addEventListener('click', pause);
explodeButton.addEventListener('click', triggerSpecials);
shuffleButton.addEventListener('click', manualShuffle);

playButton.addEventListener('click', function() {
    var el = document.getElementById('fullScreenWrapper');
    var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    try {
        rfs.call(el);
    } catch(error) {
        console.log('no full screen');
    }
});


}());
