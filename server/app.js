require('6to5-core/register');

var logger = require('winston');

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

var auth = require('./auth'),
    routes = require('./routes/index'),
    comments = require('./routes/comments')
    users = require('./routes/users');

var store = require('./configuredStore');

// configure express
var app = express();

// we're not using a view engine, but
// express complains if these are missing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

logger.remove(logger.transports.Console);

if (app.get('env') == 'development') {

    // only log to console in a dev environment
    logger.add(logger.transports.Console, {
        colorize: true,
        prettyPrint: true
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/jspm_packages/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../jspm_packages/', req.params[0]));
});

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

// initializing the store might take
// some time, though practically not
// more than a few seconds
store.initialize('pundit');

module.exports = app;
