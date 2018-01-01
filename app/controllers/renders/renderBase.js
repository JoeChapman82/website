module.exports = {
    index: (req, res) => res.render('index'),
    random: (req, res) => res.render('random'),
    siteMap: (req, res) => res.render('site-map'),
    cookiePolicy: (req, res) => res.render('cookie-policy'),
    privacyStatement: (req, res) => res.render('privacy-statement')
};
