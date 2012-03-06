var x = require('express'),
    viewHelper = require('./viewHelper'),
    routes = require('./routes'),
    app = module.exports = x.createServer();

function context(req, res, next) {

    var session, auth;

    // if we already have the context, next
    if (req.context && req.context.user) {
        return next();
    }

    session = req.session;
    req.context = {};

    // if there's not session or auth, then set an empty context
    if (!session || !(session.auth && session.auth.loggedIn)) {
        return next();
    }

    req.context.user = session.auth.github.user;
    req.context.accessToken = session.auth.github.accessToken;
    // github.init(req.context.accessToken);
    next();
}

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
    app.use(require('stylus').middleware({
        src: __dirname + '/public'
    }));
    app.use(x['static'](__dirname + '/public'));
    app.use(require('./auth').configure(app));
    app.use(context);
    app.use(app.router);
});

app.configure('production', function() {
    app.use(x.errorHandler({
        showStack: true,
        dumpExceptions: true
    }));
});

viewHelper.initialize(app);

var fs = require('fs');
var markdown = require("markdown").markdown;
var files = fs.readdirSync('./source');

files.forEach(function(file) {
    var input = fs.readFileSync('./source/' + file, 'utf8');
    var output = markdown.toHTML(input);
    fs.writeFileSync('./source/' + file.replace('.markdown', '.html'), output);
});

app.get('/', routes.index);
app.post('/comment/:file', routes.saveComment);
app.get('/comments/:file', routes.getComments);
app.get('/documents', routes.getDocuments);
app.get('/document/:file', routes.getDocument);
app.get('/:file', routes.index);

app.redirect('login', '/');