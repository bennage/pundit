var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync');

gulp.task('stylus', function () {
    gulp.src('./stylus/styles.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./server/public/styles'))
        .pipe(browserSync.reload({stream: true}));
});
