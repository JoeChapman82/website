const requireDir = require('require-dir');
const gamesContent = requireDir('../../content/tutorials/games', {recurse: true});
const canvasContent = requireDir('../../content/tutorials/canvas', {recurse: true});
const nodeContent = requireDir('../../content/tutorials/node', {recurse: true});

module.exports = {
    index: (req, res) => res.render('tutorials/index'),
    canvasIndex: (req, res) => res.render('tutorials/canvas/index'),
    canvasDrawingSquares: (req, res) => res.render('tutorials/canvas/drawing-squares', {content: canvasContent['drawing-squares']}),
    canvasDrawingCircles: (req, res) => res.render('tutorials/canvas/drawing-circles', {content: canvasContent['drawing-circles']}),
    canvasDrawingTriangles: (req, res) => res.render('tutorials/canvas/drawing-triangles', {content: canvasContent['drawing-triangles']}),
    canvasLoadingSpinner: (req, res) => res.render('tutorials/canvas/loading-spinner', {content: canvasContent['loading-spinner']}),
    canvasAudioVisualiser: (req, res) => res.render('tutorials/canvas/audio-visualiser', {content: canvasContent['audio-visualiser']}),
    canvasMatrixEffect: (req, res) => res.render('tutorials/canvas/matrix-effect', {content: canvasContent['matrix-effect']}),
    gamesIndex: (req, res) => res.render('tutorials/games/index'),
    gamesFpsCounter: (req, res) => res.render('tutorials/games/display-fps-counter', {content: gamesContent['display-fps-counter']}),
    gamesGameTimer: (req, res) => res.render('tutorials/games/game-timer', {content: gamesContent['game-timer']}),
    gamesKeepingScore: (req, res) => res.render('tutorials/games/keeping-score', {content: gamesContent['keeping-score']}),
    gamesMakePong: (req, res) => res.render('tutorials/games/make-pong', {content: gamesContent['make-pong']}),
    nodeIndex: (req, res) => res.render('tutorials/node/index'),
    nodeClusterMode: (req, res) => res.render('tutorials/node/cluster-mode', {content: nodeContent['cluster-mode']})
};
