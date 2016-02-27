import * as koa from 'koa';
import { review } from './src/review';
import { navigation } from './src/navigation';

const app = new koa();

console.log('starting');

// trust proxy
app.proxy = true;

// sessions
const session = require('koa-generic-session');
app.keys = ['your-session-secret'];
app.use(session());

// body parser
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// append view renderer
const views = require('koa-render');
app.use(views('./views', {
    map: { html: 'handlebars' },
    cache: false
}));

// routes
const Router = require('koa-router');
const routes = new Router();

routes.get('/', navigation);

routes.get('/review/:content', function* () {
    var ctx = <koa.Context>this;
    const id = this.params.content;
    const html = yield review(id);
    this.body = yield this.render('app', { id: id, html: html });
});

app.use(routes.middleware());

// static files
const send = require('koa-send');
app.use(function* () {
    yield send(this, this.path, { root: __dirname + '/public' });
});

app.listen(3000);