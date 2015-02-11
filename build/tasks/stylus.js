var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('stylus', function () {
    gulp.src('./stylus/styles.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./server/public/styles'));
});
