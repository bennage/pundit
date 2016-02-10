const gulp = require('gulp');
const modernizr = require('modernizr');
const stream = require('stream');

gulp.task('default', () => {

    gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./public/css'));

    // modernizr.build({}, (result) => {
    //     var s = new stream.Readable();
    //     // s._read = function noop() { }; // redundant? see update below
    //     s.push(result);
    //     s.push(null);
    //     s.pipe(gulp.dest('./public/js/modernizr.js'));
    // });
});