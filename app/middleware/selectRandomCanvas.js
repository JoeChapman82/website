const canvases = require('../config/randomCanvases');
const randomInt = require('../helpers/randomInt');

module.exports = (req, res, next) => {
    const chosenCanvas = canvases[randomInt(0, canvases.length - 1)];
    for(let key in chosenCanvas) {
        res.locals[key] = chosenCanvas[key];
    }
    console.log(res.locals);
    next();
};
