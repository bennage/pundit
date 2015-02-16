var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync');
var paths = require('../paths');

gulp.task('stylus', function () {
    gulp.src(paths['stylus-source'])
        .pipe(stylus())
        .pipe(gulp.dest(paths['stylus-target']))
        .pipe(browserSync.reload({stream: true}));
});
