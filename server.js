import koa from 'koa';
import koaRouter from 'koa-router';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';

const app = koa();
app.use(koaCors());
app.use(koaBodyParser());

const router = koaRouter();

router.get('/', function *(next) {
  this.body = 'Hello World!';
});

router.get('/api/clients', function *(next) {
  this.body = [{
    id: 1,
    name: '4D CAM BVBA',
    address: 'Beekveldstraat 67 bus1',
    city: '9300 Aalst',
    telephone: '054 / 80 45 03',
    btw: '0478.378.759',
    rate: {
      hourly: 50
    }
  }, {
    id: 2,
    name: 'Nexios Consulting Group NV',
    address: 'Telecom Gardens – Medialaan 36',
    city: 'B-1800 Vilvoorde',
    btw: 'BE0478.895.136',
    rate: {
      hourly: 65
    }
  }];
});

router.get('/api/config', function *(next) {
  this.body = {
    nextInvoiceNumber: 11,
    defaultClient: 2,
  };
});

const pongit = {
  name: 'pongit BVBA',
  address: 'Doolhofstraat 37',
  city: '9300 Aalst',
  btw: '0662.755.072',
  iban: 'BE04 0689 0602 8931',
  bic: 'GKCCBEBB',
  telephone: '0476 / 40 35 02',
  email: 'woutervs@hotmail.com',
}

const pug = require('pug');
const compiledFunction = pug.compileFile('./templates/pongit.pug');

router.post('/api/invoice/create', function *(next) {
  this.body = compiledFunction(Object.assign({pongit}, this.request.body));
});

app.use(router.routes());
app.listen(3001);
