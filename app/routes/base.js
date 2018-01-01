const baseController = require('../controllers/baseController');

module.exports = (app) => {
    app.get('/', baseController.index);
    app.get('/random', baseController.random);
    app.get('/site-map', baseController.siteMap);
    app.get('/cookie-policy', baseController.cookiePolicy);
    app.get('/privacy-statement', baseController.privacyStatement);
    return app;
};
