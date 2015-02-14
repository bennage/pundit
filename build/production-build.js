var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-6to5');
var sourcemaps = require('gulp-sourcemaps');
var compilerOptions = require('./6to5-options');
var assign = Object.assign || require('object.assign');
var minifyHTML = require('gulp-minify-html');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var stylus = require('gulp-stylus');

var paths = {
    'stylus-source' : '../stylus/styles.styl',
    'stylus-target' : '../server/public/styles',
    'client-source-js' : '../client/**/*.js',
    'client-source-html' : '../client/**/*.html',
    'client-target' : '../server/public/client',
    'client-sourceMap' : '/client'
};

gulp.task('stylus', function () {
    gulp.src(paths['stylus-source'])
        .pipe(stylus())
        .pipe(gulp.dest(paths['stylus-target']));
});

gulp.task('build-system', function () {
  return gulp.src(paths['client-source-js'])
    .pipe(plumber())
    .pipe(changed(paths['client-target'], {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: paths['client-sourceMap'] }))
    .pipe(gulp.dest(paths['client-target']));
});

gulp.task('build-html', function () {
    var opts = {comments:true,spare:true};

    return gulp.src(paths['client-source-html'])
        .pipe(changed(paths['client-target'], {extension: '.html'}))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(paths['client-target']));
});

gulp.task('default', function() {
  return runSequence(['build-system', 'build-html', 'stylus']);
});
