const renderGames = require('./renders/renderGames');

module.exports = {
    index: [renderGames.index],
    classicsIndex: [renderGames.classicsIndex],
    classicsSnake: [renderGames.classicsSnake],
    classicsPong: [renderGames.classicsPong],
    classicsAsteroids: [renderGames.classicsAsteroids],
    classicsSpaceInvaders: [renderGames.classicsSpaceInvaders],
    actionIndex: [renderGames.actionIndex],
    puzzleIndex: [renderGames.puzzleIndex],
    puzzleMatchThree: [renderGames.puzzleMatchThree],
    puzzleSudoku: [renderGames.puzzleSudoku],
    adventureIndex: [renderGames.adventureIndex],
    arcadeIndex: [renderGames.arcadeIndex],
    arcadeCapitalism: [renderGames.arcadeCapitalism]

};
