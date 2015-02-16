var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var paths = require('../paths');

gulp.task('clean', function() {
  return gulp.src(paths['client-target'])
    .pipe(vinylPaths(del));
});
