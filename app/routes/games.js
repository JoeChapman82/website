const gamesController = require('../controllers/gamesController');

module.exports = (games) => {
    games.get('/', gamesController.index);
    return games;
};
