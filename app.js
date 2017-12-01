if(process.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const AWS = require('aws-sdk');
const cluster = require('cluster');
const express = require('express');
const https = require('https');
const fs = require('fs');
const tutorial = express.Router();
const api = express.Router();

const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'production';

const bootstrap = require('./app/middleware/bootstrap');
const baseRoutes = require('./app/routes/base');
const apiRoutes = require('./app/routes/api');
const tutorialRoutes = require('./app/routes/tutorials');
const coverallRoutes = require('./app/routes/coverall');
const errorHandler = require('./app/middleware/errorHandler');

const options = {
  key: fs.readFileSync(path.join(__dirname, `app/etc/certs/${environment}.key`)),
  cert: fs.readFileSync(path.join(__dirname, `app/etc/certs/${environment}.crt`)),
};

AWS.config.region = process.env.REGION;
var app = express();
bootstrap(app);

app.use('/api', api);
app.use('/tutorials', tutorial);

baseRoutes(app);
apiRoutes(api);
tutorialRoutes(tutorial);
coverallRoutes(app);

app.use(errorHandler);

https.createServer(options, app).listen(port, () => {
    console.log(`server listening on port ${port} in ${process.env.NODE_ENV} mode`);
});
