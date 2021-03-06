const nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const express = require('express');

const config = require('../config/main');
const defineActiveView = require('./defineActiveView');
const getCurrentYear = require('./getCurrentYear');

module.exports = (app) => {

    app.set('trust proxy', 1);
    app.use(helmet());
    // dealt with by nginx now
    app.use(favicon(path.join(__dirname, '../static/images/', 'favicon.ico')));
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

    app.use(csrf({cookie: {maxAge: config.csrfLifespan, httpOnly: true, signed: true, secure: true}}));

    app.use((req, res, next) => {
        res.locals._csrf = req.csrfToken();
        next();
    });

    app.use(getCurrentYear);

    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        } else {
            res.clearCookie('_csrf');
            return next(err);
        }

    });

    app.use(defineActiveView);

    return app;
};
