if(process.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const AWS = require('aws-sdk');
const cluster = require('cluster');
const express = require('express');
const https = require('https');
const fs = require('fs');
// routers
const tutorial = express.Router();
const games = express.Router();
const about = express.Router();
const apis = express.Router();
const project = express.Router();

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'production';
// middleware used for all routes
const bootstrap = require('./app/middleware/bootstrap');
// routes
const baseRoutes = require('./app/routes/base');
const apisRoutes = require('./app/routes/api');
const tutorialRoutes = require('./app/routes/tutorials');
const gamesRoutes = require('./app/routes/games');
const aboutRoutes = require('./app/routes/about');
const projectRoutes = require('./app/routes/projects');
const coverallRoutes = require('./app/routes/coverall');
const errorHandler = require('./app/middleware/errorHandler');

const options = {
    key: fs.readFileSync(path.join(__dirname, `app/etc/certs/${environment}.key`)),
    cert: fs.readFileSync(path.join(__dirname, `app/etc/certs/${environment}.crt`)),
};

AWS.config.region = process.env.REGION;
var app = express();
bootstrap(app);

app.use('/apis', apis);
app.use('/tutorials', tutorial);
app.use('/games', games);
app.use('/about', about);
app.use('/projects', project);

baseRoutes(app);
apisRoutes(apis);
tutorialRoutes(tutorial);
gamesRoutes(games);
aboutRoutes(about);
projectRoutes(project);

coverallRoutes(app);

app.use(errorHandler);

https.createServer(options, app).listen(port, () => {
    console.log(`server listening on port ${port} in ${process.env.NODE_ENV} mode`);
});
