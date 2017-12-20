const gamesController = require('../controllers/gamesController');

module.exports = (games) => {
    games.get('/', gamesController.index);

    games.get('/classics', gamesController.classicsIndex);
    games.get('/classics/snake', gamesController.classicsSnake);

    games.get('/action', gamesController.actionIndex);
    return games;
};
