var gulp = require('gulp');
var server = require('gulp-express');
var browserSync = require('browser-sync');
var paths = require('../paths');

gulp.task('serve', ['build'], function () {
    // Start the server at the beginning of the task
    server.run({
        file: 'server/bin/www'
    });

    // Restart the server when file changes
    gulp.watch(['client/**/*.html'], ['build-html', browserSync.reload, server.notify]);
    gulp.watch(['client/**/*.js'], ['build-system', browserSync.reload, server.notify]);
    gulp.watch(['stylus/**/*.styl'], ['stylus', browserSync.reload, server.notify]);

    // gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    // //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);
    // //Event object won't pass down to gulp.watch's callback if there's more than one of them.
    // //So the correct way to use server.notify is as following:
    // gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
    //     gulp.run('styles:css');
    //     server.notify(event);
    //     //pipe support is added for server.notify since v0.1.5,
    //     //see https://github.com/gimm/gulp-express#servernotifyevent
    // });
    //
    // gulp.watch(['app/scripts/**/*.js'], ['jshint']);

    // TODO: I think that something is wrong here...
    // you'll if you edit app while serving
    gulp.watch(['server/app.js', 'server/routes/**/*.js'], [server.run]);
});
