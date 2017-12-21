const tutorialsController = require('../controllers/tutorialsController');

module.exports = (tutorials) => {
    tutorials.get('/', tutorialsController.index);
    tutorials.get('/canvas/index', tutorialsController.canvasIndex);
    tutorials.get('/games/index', tutorialsController.gamesIndex);
    tutorials.get('/games/display-fps-counter', tutorialsController.gamesFpsCounter);
    return tutorials;
};
