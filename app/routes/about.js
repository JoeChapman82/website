const aboutController = require('../controllers/aboutController');

module.exports = (about) => {
    about.get('/', aboutController.index);
    about.get('/site', aboutController.site);
    about.get('/me', aboutController.me);
    about.get('/cv', aboutController.cv);
    return about;
};
