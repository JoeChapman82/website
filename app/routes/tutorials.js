const tutorialsController = require('../controllers/tutorialsController');

module.exports = (tutorials) => {
    tutorials.get('/', tutorialsController.index);
    tutorials.get('/canvas/index', tutorialsController.canvasIndex);
    tutorials.get('/canvas/drawing-squares', tutorialsController.canvasDrawingSquares);
    tutorials.get('/canvas/drawing-circles', tutorialsController.canvasDrawingCircles);
    tutorials.get('/canvas/drawing-triangles', tutorialsController.canvasDrawingTriangles);
    tutorials.get('/canvas/loading-spinner', tutorialsController.canvasLoadingSpinner);
    tutorials.get('/canvas/matrix-effect', tutorialsController.canvasMatrixEffect);
    tutorials.get('/games/index', tutorialsController.gamesIndex);
    tutorials.get('/games/display-fps-counter', tutorialsController.gamesFpsCounter);
    tutorials.get('/games/make-pong', tutorialsController.gamesMakePong);
    return tutorials;
};
