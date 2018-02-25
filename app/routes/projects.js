const projectsController = require('../controllers/projectsController');

module.exports = (projects) => {
    projects.get('/', projectsController.index);
    projects.get('/colour-converter', projectsController.colourConverter);
    return projects;
};
