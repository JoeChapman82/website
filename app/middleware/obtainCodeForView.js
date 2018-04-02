const requireDir = require('require-dir');
const canvasCode = requireDir('../content/code/tutorials/canvas/');
const prism = require('prismjs');
const codeString = require('../content/code/tutorials/canvas/audio-visualiser').full;
const prismHelper = require('../helpers/prismHelper');
for(let i in canvasCode) {
    for(let j in canvasCode[i]) {
        canvasCode[i][j].code = prismHelper(prism.highlight(canvasCode[i][j].code, prism.languages[canvasCode[i][j].type]), 1, 1);
    }
}

module.exports = {
    canvas: (req, res, next) => {
        let requiredCode = req.url.split('/').pop();
        res.locals.highlightedCode = canvasCode[requiredCode];
        next();
    }
};
