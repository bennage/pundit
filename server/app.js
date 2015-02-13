require('6to5/register');

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

var logger = require('./logger');
var auth = require('./auth');

var routes = require('./routes/index'),
    comments = require('./routes/comments')
    users = require('./routes/users');

var store = require('./configuredStore');

var app = express();

// NOTE: We're not using a view engine, but Express complains if these are missing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (app.get('env') == 'development') {
    logger.log('starting browser-sync');
    var browserSync = require('browser-sync');
    var bs = browserSync.init([], {});
    app.use(require('connect-browser-sync')(bs));

    // for debugging the source client js
    app.use('/client/:file', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../client/', req.params.file));
    });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(session( { secret: 'bennage', resave: false, saveUninitialized: false }));
app.use(auth(app));

app.use('/', routes);
app.use('/user', users);
app.use('/comments', comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

store.initialize();

module.exports = app;
