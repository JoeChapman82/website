module.exports = {
    index: (req, res) => res.render('games/index'),
    classicsIndex: (req, res) => res.render('games/classics/index'),
    classicsSnake: (req, res) => res.render('games/classics/snake'),
    classicsPong: (req, res) => res.render('games/classics/pong'),
    classicsAsteroids: (req, res) => res.render('games/classics/asteroids'),
    classicsSpaceInvaders: (req, res) => res.render('games/classics/space-invaders'),
    actionIndex: (req, res) => res.render('games/action/index'),
    puzzleIndex: (req, res) => res.render('games/puzzle/index'),
    puzzleMatchThree: (req, res) => res.render('games/puzzle/match-three'),
    puzzleSudoku: (req, res) => res.render('games/puzzle/sudoku'),
    adventureIndex: (req, res) => res.render('games/adventure/index'),
    arcadeIndex: (req, res) => res.render('games/arcade/index'),
    arcadeCapitalism: (req, res) => res.render('games/arcade/capitalism')
};
