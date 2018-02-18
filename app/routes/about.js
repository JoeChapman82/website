const aboutController = require('../controllers/aboutController');

module.exports = (about) => {
    about.get('/', aboutController.index);
    about.get('/site', aboutController.site);
    about.get('/me', aboutController.me);
    about.get('/cv', aboutController.cv);
    about.post('/cv', aboutController.postCv);
    about.get('/site-map', aboutController.siteMap);
    about.get('/cookie-policy', aboutController.cookiePolicy);
    about.get('/privacy-statement', aboutController.privacyStatement);
    return about;
};
