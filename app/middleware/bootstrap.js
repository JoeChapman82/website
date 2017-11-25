const nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const express = require('express');

module.exports = (app) => {

    app.set('trust proxy', 1);
    app.use(helmet());
    // app.use(favicon(path.join(__dirname, '../assets/images/', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, '../static/')));

    // Set nunjucks as templating engine and set default path for templates
    app.set('view engine', 'njk');

    let nunjucksEnv = nunjucks.configure(path.join(__dirname, '../views/'), {
        autoescape: true,
        express: app,
        noCache: true,
        watch: true
    });

    app.use(cookieParser(process.env.COOKIE_SECRET));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded( {extended : false} ));

    return app;
};
