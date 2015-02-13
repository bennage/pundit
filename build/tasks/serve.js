var gulp = require('gulp');
var server = require('gulp-express');
var browserSync = require('browser-sync');
var paths = require('../paths');

gulp.task('serve', ['build'], function () {

    browserSync.init(null, {
        open: false,
        proxy: 'http://localhost:3000',
        port: 9000
    });

    var serverFile =  'server/bin/www';

    // start the server at the beginning of the task
    server.run({
        file:serverFile
    });

    // rebuild the client source when files change
    gulp.watch(['client/**/*.html'], ['build-html', browserSync.reload]);
    gulp.watch(['client/**/*.js'], ['build-system', browserSync.reload]);
    gulp.watch(['stylus/**/*.styl'], ['stylus']);

    // restart the server itself when backend code changes
    gulp.watch(
        ['server/*.js', 'server/routes/**/*.js'],
        function() {server.run({ file:serverFile }); }
        );
});
