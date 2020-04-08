const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');

const webpush = require('web-push');

const app = new Koa();
const router = new Router();

app.use(json());
app.use(bodyParser());

app.listen(1087, () => {
  console.log('\nExample app running on http://127.0.0.1:8085\n');
});