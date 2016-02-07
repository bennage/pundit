var koa = require('koa');
var app = koa();

console.log('starting');

// trust proxy
app.proxy = true;

// sessions
var session = require('koa-generic-session');
app.keys = ['your-session-secret'];
app.use(session());

// body parser
var bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// append view renderer
var views = require('koa-render');
app.use(views('./views', {
    map: { html: 'handlebars' },
    cache: false
}));

// routes
var Router = require('koa-router');
var routes = new Router();

routes.get('/', function* () {
    this.body = yield this.render('app');
});

app.use(routes.middleware());

app.listen(3000);