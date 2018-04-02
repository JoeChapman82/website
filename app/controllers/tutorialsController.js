const renderTutorials = require('./renders/renderTutorials');
const obtainCodeForView = require('../middleware/obtainCodeForView');

module.exports = {
    index: [renderTutorials.index],
    canvasIndex: [renderTutorials.canvasIndex],
    canvasDrawingSquares: [renderTutorials.canvasDrawingSquares],
    canvasDrawingCircles: [renderTutorials.canvasDrawingCircles],
    canvasDrawingTriangles: [renderTutorials.canvasDrawingTriangles],
    canvasLoadingSpinner: [renderTutorials.canvasLoadingSpinner],
    canvasAudioVisualiser: [obtainCodeForView.canvas, renderTutorials.canvasAudioVisualiser],
    canvasMatrixEffect: [renderTutorials.canvasMatrixEffect],
    gamesIndex: [renderTutorials.gamesIndex],
    gamesFpsCounter: [renderTutorials.gamesFpsCounter],
    gamesGameTimer: [renderTutorials.gamesGameTimer],
    gamesKeepingScore: [renderTutorials.gamesKeepingScore],
    gamesMakePong: [renderTutorials.gamesMakePong],
    nodeIndex: [renderTutorials.nodeIndex],
    nodeClusterMode: [renderTutorials.nodeClusterMode]

};
