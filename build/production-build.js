var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-6to5');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('./paths');
var compilerOptions = require('./6to5-options');
var assign = Object.assign || require('object.assign');
var minifyHTML = require('gulp-minify-html');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var gulp = require('gulp');
var stylus = require('gulp-stylus');

paths ={ root: '../client/',
  source: '../client/**/*.js',
  html: '../client/**/*.html',
  style: '../styles/**/*.css',
  output: '../server/public/' }

gulp.task('stylus', function () {
    gulp.src('../stylus/styles.styl')
        .pipe(stylus())
        .pipe(gulp.dest('../server/public/styles'));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(plumber())
    .pipe(changed('../server/public/', {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + paths.root }))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-html', function () {
    var opts = {comments:true,spare:true};

    return gulp.src(paths.html)
        .pipe(changed(paths.output, {extension: '.html'}))
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(paths.output));
});

gulp.task('default', function() {
  return runSequence(['build-system', 'build-html', 'stylus']);
});
