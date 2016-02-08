const gulp = require('gulp');

gulp.task('default', () => {
    gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./public/css'));
});