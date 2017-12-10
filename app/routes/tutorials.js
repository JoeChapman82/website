const tutorialsController = require('../controllers/tutorialsController');

module.exports = (tutorials) => {
    tutorials.get('/', tutorialsController.index);
    return tutorials;
};
