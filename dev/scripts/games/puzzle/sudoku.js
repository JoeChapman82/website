(function() {
    'use strict';
    var grid = [[],[],[],[],[],[],[],[],[]];
    var removeableEntries = [];
    var removals = {x: '', y: '', number: '', opX: '', opY: '', opNumber: ''};
    var gridSize = 9;
    var validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var numberButtons = document.querySelectorAll('.sudoku-number-button');
    var difficultyButtons = document.querySelectorAll('.sudoku-difficulty-button');
    var validationTypeButtons = document.querySelectorAll('.sudoku-validation-type-button');
    var startNewGameButton = document.getElementById('startNewGameButton');
    var cellElements = document.querySelectorAll('.sudoku-number-wrapper');
    var playButton = document.getElementById('sudokuPlayButton');
    var startPage = document.getElementById('sudokuStartPage');
    var currentNumber = 1;
    var isComplete;
    var solution;
    var startTime = Date.now();
    var completionTime = 0;
    var difficulties = {
        easy: 40,
        medium: 50,
        hard: 63
    };
    var validationTypes = {
        entry: handleEntryValidation,
        completion: handleCompletionValidation
    };
    var currentValidationType = validationTypes.entry;
    var currentDifficulty = difficulties.easy;

    function initGrid() {
        for(var i = 0; i < gridSize; i++) {
            for(var j = 0; j < gridSize; j++) {
                grid[i][j] = {candidates: setGroup(), number: '', numsToSkip: [], isClue: false};
            }
        }
    }

    function setGroup() {
        var candidates = validNumbers.slice(0);
        var group = [];
        for(var i = 0; i < gridSize; i++) {
            var number = candidates[randomInt(0, candidates.length - 1)];
            group.push(number);
            candidates.splice(candidates.indexOf(number), 1);
        }
        return group;
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setGrid(y, x) {
        var number = setNumber(x, y, grid[y][x].candidates, 0);
        if(number !== false) {
            grid[y][x].number = number;
            x++;
            if(x === gridSize) {
                x = 0;
                y++;
                if(y === gridSize) {
                    return;
                }
            }
            return setGrid(y, x);
        } else {
            if(x === 0 && y === 0) {
                return;
            }
            var newX = x === 0 ? gridSize - 1 : x - 1;
            var newY = x === 0 ? y - 1 : y;
            grid[newY][newX].numsToSkip.push(grid[newY][newX].number);
            grid[newY][newX].number = '';
            grid[y][x].numsToSkip = [];
            return setGrid(newY, newX);
        }
    }

    function setNumber(x, y, candidates, attempt) {
        var numsToSkip = grid[y][x].numsToSkip;
        for(var i = 0; i < candidates.length; i++) {
            if(numsToSkip.indexOf(candidates[i]) === -1 && isValidEntry(x, y, candidates[i])) {
                return candidates[i];
            }
        }
        return false;
    }

    function resetTestNumbers() {
        for(var i = 0; i < gridSize; i++) {
            for(var j = 0; j < gridSize; j++) {
                if(!grid[i][j].isClue) {
                    grid[i][j].number = '';
                }
            }
        }
    }

    function resetSolutionInGrid() {
        var k = 0;
        for(var i = 0; i < gridSize; i++) {
            for(var j = 0; j < gridSize; j++) {
                grid[i][j].number = solution[k];
                k++;
            }
        }
    }

    function removeSymetricEntries() {
        removals.y = randomInt(0, validNumbers.length - 1);
        if(removeableEntries[removals.y].length === 0) {
            removals.y = '';
            return removeSymetricEntries();
        }
        removals.x = removeableEntries[removals.y][randomInt(0, removeableEntries[removals.y].length - 1)];
        removals.opY = (gridSize - 1) - removals.y;
        if(removeableEntries[removals.opY].length === 0) {
            removals.opY = '';
            removals.y = '';
            removals.x = '';
            return removeSymetricEntries();
        }
        removals.opX = (gridSize - 1) - removals.x;
        grid[removals.y][removals.x].isClue = false;
        grid[removals.opY][removals.opX].isClue = false;
        removals.number = grid[removals.y][removals.x].number;
        removals.opNumber = grid[removals.opY][removals.opX].number;
        removeableEntries[removals.y].splice(removeableEntries[removals.y].indexOf(removals.x), 1);
        removeableEntries[removals.opY].splice(removeableEntries[removals.opY].indexOf(removals.opX), 1);
        return true;
    }

    function reinputRemovedEntries() {
        grid[removals.y][removals.x].number = removals.number;
        grid[removals.opY][removals.opX].number = removals.opNumber;
        grid[removals.y][removals.x].isClue = true;
        grid[removals.opY][removals.opX].isClue = true;
    }

    function removeEntries(toRemove) {
        removeSymetricEntries();
        resetTestNumbers();
        var solutionCount = findSolutionCount(create2dGridArray());
        if(solutionCount === 1) {
            toRemove -= 2;
            if(toRemove > 0 && countPossibleRemovals() > 2) {
                return removeEntries(toRemove);
            }
        } else {
            reinputRemovedEntries();
            if(countPossibleRemovals() > 2) {
                return removeEntries(toRemove);
            }
        }
    }

    function create2dGridArray() {
        var gridArray = [];
        for(var i = 0; i < gridSize; i++) {
            gridArray[i] = [];
            for(var j = 0; j < gridSize; j++) {
                gridArray[i][j] = grid[i][j].number;
            }
        }
        return gridArray;
    }


    function countPossibleRemovals() {
        var count = 0;
        for(var i = 0; i < gridSize; i++) {
            count += removeableEntries[i].length;
        }
        return count;
    }

    function dancingLinksCover(cell) {
          cell.right.left = cell.left;
          cell.left.right = cell.right;
          for (var i = cell.down; i != cell; i = i.down) {
              for (var j = i.right; j != i; j = j.right) {
                  j.down.up = j.up;
                  j.up.down = j.down;
                  j.column.size--;
              }
          }
      }

      function dancingLinksUncover(cell) {
          for (var i = cell.up; i != cell; i = i.up) {
              for (var j = i.left; j != i; j = j.left) {
                  j.column.size++;
                  j.down.up = j;
                  j.up.down = j;
              }
          }
          cell.right.left = cell;
          cell.left.right = cell;
      }

      function dancingLinksSearch(head, solution, solutions, cellNumber) {
          var maxsolutions = 2;
          if(head.right === head) {
              solutions.push(solution.slice(0));
              if (solutions.length >= maxsolutions) {
                  return solutions;
              }
              return null;
          }
          var c = null;
          var s = 99999;
          for (var j = head.right; j !== head; j = j.right) {
              if (j.size === 0) {
                  return null;
              }
              if (j.size < s) {
                  s = j.size;
                  c = j;
              }
          }
          dancingLinksCover(c);
          for (var r = c.down; r !== c; r = r.down) {
              solution[cellNumber] = r.row;
              for (j = r.right; j !== r; j = j.right) {
                  dancingLinksCover(j.column);
              }
              s = dancingLinksSearch(head, solution, solutions, cellNumber + 1);
              if (s != null) {
                  return s;
              }
              for (j = r.left; j !== r; j = j.left) {
                  dancingLinksUncover(j.column);
              }
          }
          dancingLinksUncover(c);
          return null;
      }

      function dancingLinksSolve(matrix) {
          var skip = 0;
          var columns = [];
          columns.length = matrix[0].length;
          for (var l = 0; l < columns.length; l++) {
              columns[l] = {};
          }
          for (var i = 0; i < columns.length; i++) {
              columns[i].index = i;
              columns[i].up = columns[i];
              columns[i].down = columns[i];
              if (i >= skip) {
                  if (i - 1 >= skip) {
                      columns[i].left = columns[i-1];
                  }
                  if (i + 1 < columns.length) {
                      columns[i].right = columns[i+1];
                  }
              } else {
                  columns[i].left = columns[i];
                  columns[i].right = columns[i];
              }
              columns[i].size = 0;
          }
          for (var j = 0; j < matrix.length; j++) {
              var last = null;
              for (var k = 0; k < matrix[j].length; k++) {
                  if (matrix[j][k]) {
                      var node = {};
                      node.row = j;
                      node.column = columns[k];
                      node.up = columns[k].up;
                      node.down = columns[k];
                      if (last) {
                          node.left = last;
                          node.right = last.right;
                          last.right.left = node;
                          last.right = node;
                      } else {
                          node.left = node;
                          node.right = node;
                      }
                      columns[k].up.down = node;
                      columns[k].up = node;
                      columns[k].size++;
                      last = node;
                  }
              }
          }
          var head = {};
          head.right = columns[skip];
          head.left = columns[columns.length-1];
          columns[skip].left = head;
          columns[columns.length - 1].right = head;
          var solutions = [];
          dancingLinksSearch(head, [], solutions, 0);
          return solutions;
      }

      function createDancingLinksMatrix(grid) {
          var matrix = [];
          var matrixRow;
          for (var i = 0; i < 9; i++) {
              for (var j = 0; j < 9; j++) {
                  var g = grid[i][j] - 1;
                  if (g >= 0) {
                      matrixRow = [];
                      matrixRow.length = 324;
                      matrixRow[i * 9 + j] = 1;
                      matrixRow[9 * 9 + i * 9 + g] = 1;
                      matrixRow[9 * 9 * 2 + j * 9 + g] = 1;
                      matrixRow[9 * 9 * 3 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + g] = 1;
                      matrix.push(matrixRow);
                  } else {
                      for (var n = 0; n < 9; n++) {
                          matrixRow = [];
                          matrixRow.length = 324;
                          matrixRow[i * 9 + j] = 1;
                          matrixRow[9 * 9 + i * 9 + n] = 1;
                          matrixRow[9 * 9 * 2 + j * 9 + n] = 1;
                          matrixRow[9 * 9 * 3 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + n] = 1;
                          matrix.push(matrixRow);
                      }
                  }
              }
          }
          return matrix;
      }

      function findSolutionCount(gridArray) {
          var solutions = dancingLinksSolve(createDancingLinksMatrix(gridArray));
          return solutions.length;
      }

    function setRemoveableEntries() {
        for(var i = 0; i < gridSize; i++) {
            removeableEntries[i] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        }
    }

    function setAllCluesTrue() {
        for(var i = 0; i < gridSize; i++) {
            for(var j = 0; j < gridSize; j++) {
                grid[i][j].isClue = true;
            }
        }
    }

    function createSolutionString() {
        var solutionString = '';
        for(var i = 0; i < gridSize; i++) {
            for(var j = 0; j < gridSize; j++) {
                solutionString += grid[i][j].number.toString();
            }
        }
        return solutionString;
    }

    function isValidEntry(x, y, number) {
        if(!isValidX(x, y, number)) {
            return false;
        }
        if(!isValidY(x, y, number)) {
            return false;
        }
        if(!isValidGroup(x, y, number)) {
            return false;
        }
        return true;
    }

    function isValidX(x, y, number) {
        for(var i = 0; i < gridSize; i++) {
            if(grid[y][i].number === number && i !== x) {
                return false;
            }
        }
        return true;
    }

    function isValidY(x, y, number) {
        for(var i = 0; i < gridSize; i++) {
            if(grid[i][x].number === number && i !== y) {
                return false;
            }
        }
        return true;
    }

    function isValidGroup(x, y, number) {
        var groupXStart = Math.floor(x / 3) * 3;
        var groupYStart = Math.floor(y / 3) * 3;
        for(var i = groupYStart; i < groupYStart + 3; i++) {
            for(var j = groupXStart; j < groupXStart + 3; j++) {
                if(grid[i][j].number === number) {
                    return false;
                }
            }
        }
        return true;
    }

    function linkElements() {
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                var element = document.getElementById('sudoku-' + i + '-' + j);
                element.classList.remove('sudoku-user-entry');
                if(grid[i][j].isClue) {
                    element.innerText = grid[i][j].number.toString();
                } else {
                    element.innerText = '\xa0';
                    element.classList.add('sudoku-user-entry');
                }
            }
        }
    }

    function setup(difficulty) {
        isComplete = false;
        initGrid();
        setGrid(0, 0);
        setAllCluesTrue();
        solution = createSolutionString();
        setRemoveableEntries();
        removeEntries(difficulty);
        resetSolutionInGrid();
        linkElements();
        startTime = Date.now();
    }

    setup(currentDifficulty);

    // event handlers for user actions
    numberButtons.forEach(function(numberButton) {
        numberButton.addEventListener('click', setCurrentNumber);
    });

    difficultyButtons.forEach(function(difficultyButton) {
        difficultyButton.addEventListener('click', changeDifficulty);
    });

    validationTypeButtons.forEach(function(validationTypeButton) {
        validationTypeButton.addEventListener('click', changeValidationMethod);
    });

    cellElements.forEach(function(cell) {
        cell.addEventListener('click', handleUserEntry);
    });

    startNewGameButton.addEventListener('click', startNewGame);

    playButton.addEventListener('click', attemptFullScreen);

    function attemptFullScreen() {
        var el = document.getElementById('fullScreenWrapper');
        var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        startPage.classList.add('sudoku-hidden');
        try {
            rfs.call(el);
        } catch(error) {
            console.log('no full screen');
        }
    }

    function handleUserEntry() {
        var cell = document.getElementById(this.dataset.cell);
        if(cell.classList.contains('sudoku-user-entry')) {
            cell.innerText = currentNumber !== 'x' ? currentNumber : '\xa0';
            currentValidationType(cell);
            checkForCompletion();
        }
    }

    function handleCompletionValidation(element) {
        if(!isComplete) {
            return;
        }
    }

    function handleEntryValidation(element) {
        var y = element.id.split('-')[1];
        var x = element.id.split('-')[2];
        element.parentNode.classList.remove('sudoku-user-error-single');
        clearDisplayedErrors();
        validateUserRow(x, y, element);
        validateUserColumn(x, y, element);
        validateUserBlock(x, y, element);
    }

    function validateUserRow(x, y, element) {
        var row = document.querySelectorAll('span[id^="sudoku-' + y + '"]');
        displayUserErrors(row, validateUserCells(row, element));
    }

    function validateUserColumn(x, y, element) {
        var column = document.querySelectorAll('span[id$="-' + x + '"]');
        displayUserErrors(column, validateUserCells(column, element));
    }

    function validateUserBlock(x, y, element) {
        var nodeList = [];
        var groupXStart = Math.floor(x / 3) * 3;
        var groupYStart = Math.floor(y / 3) * 3;
        for(var i = groupYStart; i < groupYStart + 3; i++) {
            for(var j = groupXStart; j < groupXStart + 3; j++) {
                nodeList.push(document.getElementById('sudoku-' + i + '-' + j));
            }
        }
        displayUserErrors(nodeList, validateUserCells(nodeList, element));
    }

    function validateUserCells(cells, element) {
        var isValid = true;
        if(element.innerText != '\xa0') {
            cells.forEach(function(cell) {
                if(cell.id !== element.id && cell.innerText === element.innerText) {
                    isValid = false;
                }
            });
        }
        if(!isValid) {
            element.parentNode.classList.add('sudoku-user-error-single');
        }
        return isValid;
    }

    function clearAllUserErrors() {
        cellElements.forEach(function(cell) {
            cell.classList.remove('sudoku-user-error-single');
            cell.classList.remove('sudoku-user-error');
        });
    }

    function displayUserErrors(cells, isValid) {
        if(isValid) {
            return;
        }
        cells.forEach(function(cell) {
            if(!isValid) {
                cell.parentNode.classList.add('sudoku-user-error');
            } else {
                cell.parentNode.classList.remove('sudoku-user-error');
            }
        });
    }

    function clearDisplayedErrors() {
        cellElements.forEach(function(cell) {
            cell.classList.remove('sudoku-user-error');
        });
    }

    function checkForCompletion() {
        var hasErrors = false;
        for(var i = 0; i < cellElements.length; i++) {
            var cell = document.getElementById(cellElements[i].dataset.cell);
            if(cell.innerText === '\xa0') {
                return false;
            }
        }
        for(var j = 0; j < gridSize; j++) {
            for(var k = 0; k < gridSize; k++) {
                if(document.getElementById('sudoku-' + j + '-' + k).innerText !== grid[j][k].number) {
                    document.getElementById('sudoku-' + j + '-' + k).parentNode.classList.add('sudoku-user-error-single');
                    hasErrors = true;
                }
            }
        }
        if(!hasErrors) {
            isComplete = true;
            completionTime = Math.floor((Date.now() - startTime) / 1000);
            playVictoryAnimation();
        }
    }

    function setCurrentNumber() {
        currentNumber = this.dataset.number;
        numberButtons.forEach(function(button) {
            button.classList.remove('sudoku-selected-button');
        });
        this.classList.add('sudoku-selected-button');
    }

    function startNewGame() {
        clearAllUserErrors();
        setup(currentDifficulty);
    }

    function changeDifficulty() {
        clearAllUserErrors();
        difficultyButtons.forEach(function(button) {
            button.classList.remove('sudoku-selected-button');
        });
        this.classList.add('sudoku-selected-button');
        setup(difficulties[this.dataset.difficulty]);
    }

    function changeValidationMethod() {
        clearAllUserErrors();
        validationTypeButtons.forEach(function(button) {
            button.classList.remove('sudoku-selected-button');
        });
        this.classList.add('sudoku-selected-button');
        currentValidationType = validationTypes[this.dataset.method];
    }

    function playVictoryAnimation() {
        var canvas = document.getElementById('sudokuWinCanvas');
        canvas.classList.remove('sudoku-hidden');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var particles = [];
        var rockets = [];
        var maxParticles = 400;
        var firworksToFire = 5;
        var animationLoop;
        var frameCount = 0;
        var framesToRun = 420;

        function launchFirework(x) {
            var rocket = new Firework(x);
            rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
            rocket.vel.y = Math.random() * -3 - 4;
            rocket.vel.x = Math.random() * 6 - 3;
            rocket.size = 8;
            rocket.shrink = 0.999;
            rocket.gravity = 0.01;
            rockets.push(rocket);
        }

        function renderVictoryMessage() {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.font = '60px Arial';
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
            ctx.font = '30px Arial';
            ctx.fillText('Time: ' + completionTime + ' seconds', canvas.width / 2, canvas.height / 2 + 50);
        }

        function animation() {
            frameCount++;
            renderVictoryMessage();
            if(frameCount % 45 === 0 && firworksToFire > 0) {
                launchFirework(canvas.width / 2);
                firworksToFire--;
            }
            renderParticles();
            if(frameCount < framesToRun) {
                requestAnimationFrame(animation);
            } else {
                particles = [];
                rockets = [];
                animationLoop = undefined;
                canvas.classList.add('sudoku-hidden');
            }
        }

        function renderParticles() {
            var existingFireworks = [];
            var existingParticles = [];
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < rockets.length; i++) {
                rockets[i].update();
                rockets[i].render(ctx);
                var distance = Math.sqrt(Math.pow((canvas.width / 2) - rockets[i].pos.x, 2) + Math.pow((canvas.height / 2) - rockets[i].pos.y, 2));
                var randomChance = rockets[i].pos.y < (canvas.height * 2 / 3) ? (Math.random() * 100 <= 1) : false;
                if (rockets[i].pos.y < canvas.height / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
                    rockets[i].explode();
                } else {
                    existingFireworks.push(rockets[i]);
                }
            }
            rockets = existingFireworks;
            for (var j = 0; j < particles.length; j++) {
                particles[j].update();
                if (particles[j].alpha >= 0.1 && particles[j].size >= 1) {
                    particles[j].render(ctx);
                    existingParticles.push(particles[j]);
                }
            }
            particles = existingParticles;
            while (particles.length > maxParticles) {
                particles.shift();
            }
        }

        function Particle(pos) {
            this.pos = {x: pos ? pos.x : 0, y: pos ? pos.y : 0};
            this.vel = {x: 0, y: 0};
            this.shrink = 0.97;
            this.size = 2;
            this.resistance = 1;
            this.gravity = 0;
            this.flick = false;
            this.alpha = 1;
            this.fade = 0;
            this.color = 0;
        }

        Particle.prototype.update = function() {
            this.vel.x *= this.resistance;
            this.vel.y *= this.resistance;
            this.vel.y += this.gravity;
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            this.size *= this.shrink;
            this.alpha -= this.fade;
        };

        Particle.prototype.render = function(c) {
            if(this.alpha <= 0.1 && this.size <= 1) {
                return;
            }
            c.save();
            c.globalCompositeOperation = 'lighter';
            var gradient = c.createRadialGradient(this.pos.x, this.pos.y, 0.1, this.pos.x, this.pos.y, this.size / 2);
            gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");
            c.fillStyle = gradient;
            c.beginPath();
            c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
            c.closePath();
            c.fill();
            c.restore();
        };

        function Firework(x) {
            Particle.apply(this, [{x: x, y: canvas.height}]);
            this.explosionColor = 0;
        }

        Firework.prototype = new Particle();
        Firework.prototype.constructor = Firework;
        Firework.prototype.explode = function() {
            var count = Math.random() * 10 + 80;
            for (var i = 0; i < count; i++) {
                var particle = new Particle(this.pos);
                var angle = Math.random() * Math.PI * 2;
                var speed = Math.cos(Math.random() * Math.PI / 2) * 15;
                particle.vel.x = Math.cos(angle) * speed;
                particle.vel.y = Math.sin(angle) * speed;
                particle.size = 10;
                particle.gravity = 0.2;
                particle.resistance = 0.92;
                particle.shrink = Math.random() * 0.05 + 0.93;
                particle.flick = true;
                particle.color = this.explosionColor;
                particles.push(particle);
            }
        };

        Firework.prototype.render = function(c) {
            if (this.alpha <= 0.1 && this.size <= 1) {
                return;
            }
            c.save();
            c.globalCompositeOperation = 'lighter';
            var gradient = c.createRadialGradient(this.pos.x, this.pos.y, 0.1, this.pos.x, this.pos.y, this.size / 2);
            gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
            gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");
            c.fillStyle = gradient;
            c.beginPath();
            c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
            c.closePath();
            c.fill();
            c.restore();
        };

        animationLoop = requestAnimationFrame(animation);
    }

})();
