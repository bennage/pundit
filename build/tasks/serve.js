var gulp = require('gulp');
var server = require('gulp-express');
var browserSync = require('browser-sync');
var paths = require('../paths');

gulp.task('serve', ['build'], function () {

    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 9000
    });

    var serverFile =  'server/bin/www';

    // start the server at the beginning of the task
    server.run({
        file:serverFile
    });

    // rebuild the client source when files change
    gulp.watch(['client/**/*.html'], ['build-html', browserSync.reload]);
    gulp.watch(['client/**/*.js'], ['build-system']);
    gulp.watch(['stylus/**/*.styl'], ['stylus']);
    // TODO: add back `browserSync.reload, server.notify` to the above

    // restart the server itself when backend code changes
    gulp.watch(
        ['server/app.js', 'server/routes/**/*.js'],
        function() {server.run({ file:serverFile }); }
        );
});
