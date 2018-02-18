const requireDir = require('require-dir');
const pdfTemplates = requireDir('../services/pdfGenerator/templates');
const renderAbout = require('../controllers/renders/renderAbout');

module.exports = (req, res, next) => {
    const template = req.body.template;
    if(typeof req.body.template === 'undefined' || req.body.template !== 'cv') {
        return renderAbout.cv(req, res);
    }

    res.setHeader('Content-disposition', `attachment; filename=joe_chapman_cv.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    pdfTemplates[template](res, req.body.aboutToggle);
};
