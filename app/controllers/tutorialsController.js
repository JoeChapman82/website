const renderTutorials = require('./renders/renderTutorials');

module.exports = {
    index: [renderTutorials.index],
    canvasIndex: [renderTutorials.canvasIndex],
    canvasDrawingSquares: [renderTutorials.canvasDrawingSquares],
    canvasDrawingCircles: [renderTutorials.canvasDrawingCircles],
    canvasDrawingTriangles: [renderTutorials.canvasDrawingTriangles],
    canvasLoadingSpinner: [renderTutorials.canvasLoadingSpinner],
    canvasMatrixEffect: [renderTutorials.canvasMatrixEffect],
    gamesIndex: [renderTutorials.gamesIndex],
    gamesFpsCounter: [renderTutorials.gamesFpsCounter],
    gamesMakePong: [renderTutorials.gamesMakePong]
};
