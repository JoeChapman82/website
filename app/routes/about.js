const aboutController = require('../controllers/aboutController');

module.exports = (about) => {
    about.get('/', aboutController.index);
    return about;
};
