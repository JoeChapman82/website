module.exports = (app) => {
    app.get('/', (req, res) => res.status(200).send('Api routes'));
    return app;
};
