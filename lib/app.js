var fs = require('fs'),
    x = require('express'),
    stylus = require('stylus'),
    path = require('path');

var auth = require('./auth'),
    config = require('./config'),
    context = require('./context'),
    convert = require('./convert')(),
    github = require('./github')(),
    routes = require('./routes'),
    table = require('./table'),
    viewhelpers = require('./viewhelpers');

var app = module.exports = x.createServer();

__dirname = __dirname + '/..';

app.configure('development', function() {
    app.use(x.logger('tiny'));
    app.use(x.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(x.bodyParser());
    app.use(x.methodOverride());
    app.use(x.favicon());
    app.use(x.cookieParser());
    app.use(x.session({
        secret: 'bennage'
    }));
    app.use(stylus.middleware({
        src: __dirname + '/public'
    }));
    app.use(x['static'](__dirname + '/public'));
    app.use(auth.configure(app));
    app.use(context);
    app.use(add_sha);
    app.use(app.router);
});

app.configure('production', function() {
    app.use(x.errorHandler({
        showStack: true,
        dumpExceptions: true
    }));
});

function add_sha(req, res, next) {
    req.sha = table.data().sha;
    next();
}

table.initialize(function(err) {
    if (!table.data().sha) {
        initialize(function() {
            console.log('initialized');
        });
    }
});

function initialize(callback) {

    var src = path.join('./source'),
        tgt = path.join('./pages');

    github(config.source.repo, src, config.source.ignore, function(err, sha) {

        console.log('downloading complete: ' + sha);

        var imageRoot = 'https://raw.github.com' + config.source.repo + sha + '/';

        convert(src, tgt, imageRoot, function(err, files) {

            //todo: this feels pretty wierd
            table.update({
                sha: sha,
                files: files
            }, callback);

        });
    });
}

viewhelpers.initialize(app);

app.get('/', routes.index);

app.get('/update', function(req, res) {
    // only an admin perform this task
    if (!req.context.user || req.context.user.__pundit_role__ !== 'admin') {
        res.send(403);
    } else {
        initialize(function() {
            res.redirect('/index');
        });
    }
});

app.get('/reset', function(req, res) {});

app.get('/export', routes['export']);
app.post('/comment/:file', routes.saveComment);
app.post('/comment/handle/:file/:commentId', routes.handleComment);
app.post('/comment/delete/:file/:commentId', routes.deleteComment);
app.get('/comments/:file', routes.getComments);
app.get('/documents', routes.getDocuments);
app.get('/document/:file', routes.getDocument);
app.get('/:file', routes.index);

app.redirect('login', '/');
