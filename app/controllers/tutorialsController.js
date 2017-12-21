const renderTutorials = require('./renders/renderTutorials');

module.exports = {
    index: [renderTutorials.index],
    canvasIndex: [renderTutorials.canvasIndex],
    gamesIndex: [renderTutorials.gamesIndex],
    gamesFpsCounter: [renderTutorials.gamesFpsCounter]
};
