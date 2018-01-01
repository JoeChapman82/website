const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const pump = require('pump');
const concat = require('gulp-concat');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const jscs = require('gulp-jscs');
const plumber = require('gulp-plumber');
// const uglifycss = require('gulp-uglifycss');

const gulpConfig = {
    paths: {
        scss: `${__dirname}/dev/scss/**/*.scss`,
        scssDest: `${__dirname}/app/static/css`,
        js: `${__dirname}/dev/scripts/**/*.js`,
        jsDest: `${__dirname}/app/static/scripts`,
        nunjucks: `${__dirname}/app/views/**/*.njk`,
        content: `${__dirname}/app/content/**/*.json`,
    }
};


// minifies and compiles sass files from development to app (main.scss imports sass files from govuk node_modules)
gulp.task('sass', () => {
    try {
        return gulp.src(gulpConfig.paths.scss)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(gulp.dest(gulpConfig.paths.scssDest))
            .pipe(browserSync.reload({
            stream: true
            }));
    }
    catch(error) {
        console.log(error);
    }
});

gulp.task('uglyjs', function() {
    return gulp.src(gulpConfig.paths.js)
        .pipe(plumber())
        .pipe(changed(gulpConfig.paths.jsDest))
        .pipe(jscs())
        .pipe(uglify())
        .pipe(gulp.dest(gulpConfig.paths.jsDest))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// refreshes on njk file change
gulp.task('nunjucks', () => {
    browserSync.reload();
});

// watch all scss and js files, run required tasks, refresh browser
gulp.task('watch', ['sass'], () =>{
  gulp.watch(gulpConfig.paths.scss, {interval: 1000, mode: 'poll'}, ['sass']);
  gulp.watch(gulpConfig.paths.js, {interval: 1000, mode: 'poll'}, ['uglyjs']);
  gulp.watch(gulpConfig.paths.nunjucks, {interval: 1000, mode: 'poll'}, ['nunjucks']);
  gulp.watch(gulpConfig.paths.content, {interval: 1500, mode: 'poll'}, ["nunjucks"]);
});

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'https://localhost:3000',
        port: 3001,
        reloadDelay: 1000,
        ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
    },
    open: false,
    https: {
    key: './app/etc/certs/local.key',
    cert: './app/etc/certs/local.crt'
}
    });
});

gulp.task('server', () => {
    nodemon({
        script: 'app.js',
        ext: 'json js',
    }).on('quit', function() {
        process.exit(0);
    });
});

gulp.task('default', (done) => {
    runSequence('watch', 'sass', 'uglyjs', 'server', 'browserSync', done);
});
