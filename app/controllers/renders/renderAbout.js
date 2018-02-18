const requireDir = require('require-dir');
const aboutContent = requireDir('../../content/about', {recurse: true});

module.exports = {
    index: (req, res) => res.render('about/index'),
    site: (req ,res) => res.render('about/site', {content: aboutContent.site}),
    me: (req ,res) => res.render('about/me', {content: aboutContent.me}),
    cv: (req ,res) => res.render('about/cv', {content: aboutContent.cv}),
    siteMap: (req, res) => res.render('about/site-map'),
    cookiePolicy: (req, res) => res.render('about/cookie-policy'),
    privacyStatement: (req, res) => res.render('about/privacy-statement'),
};
