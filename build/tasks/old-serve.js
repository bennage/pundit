var gulp = require('gulp');
var browserSync = require('browser-sync');

// I'm only keeping this around until I understand `browser-sync` better
gulp.task('serve-old', ['build'], function(done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});
