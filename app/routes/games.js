const gamesController = require('../controllers/gamesController');

module.exports = (games) => {
    games.get('/', gamesController.index);

    games.get('/classics/index', gamesController.classicsIndex);
    games.get('/classics/snake', gamesController.classicsSnake);
    games.get('/classics/pong', gamesController.classicsPong);
    games.get('/classics/asteroids', gamesController.classicsAsteroids);
    games.get('/classics/space-invaders', gamesController.classicsSpaceInvaders);

    games.get('/action/index', gamesController.actionIndex);

    games.get('/puzzle/index', gamesController.puzzleIndex);
    games.get('/puzzle/match-three', gamesController.puzzleMatchThree);
    games.get('/puzzle/sudoku', gamesController.puzzleSudoku);

    games.get('/adventure/index', gamesController.adventureIndex);

    games.get('/arcade/index', gamesController.arcadeIndex);
    games.get('/arcade/capitalism', gamesController.arcadeCapitalism);

    return games;
};
