import koa from 'koa';
import koaRouter from 'koa-router';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';
import koaServe from 'koa-static';

import moment from 'moment';
import numeral from 'numeral';
numeral.language('nl', {
  delimiters: {thousands: '.', decimal: ','},
  currency: {symbol: '€'}
});
numeral.language('nl');

const app = koa();
app.use(koaCors());
app.use(koaBodyParser());
app.use(koaServe('./templates/'));

const router = koaRouter();

// router.get('/', function *(next) {
//   this.body = 'Hello World!';
// });

router.get('/api/clients', function *(next) {
  this.body = [{
    id: 1,
    name: '4D CAM BVBA',
    address: 'Beekveldstraat 67 bus1',
    city: '9300 Aalst',
    telephone: '054 / 80 45 03',
    btw: '0478.378.759',
    rate: {
      hourly: 50,
      description: 'Crm',
    }
  }, {
    id: 2,
    name: 'Nexios Consulting Group NV',
    address: 'Telecom Gardens – Medialaan 36',
    city: 'B-1800 Vilvoorde',
    btw: 'BE0478.895.136',
    rate: {
      hourly: 65,
      description: 'PitStop',
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
  bank: 'Belfius',
  iban: 'BE04 0689 0602 8931',
  bic: 'GKCCBEBB',
  telephone: '0476 / 40 35 02',
  email: 'woutervs@hotmail.com',
}

const locals = {
  formatDate: dateString => moment(dateString).format('DD/MM/YYYY'),
  numberFormat: number => numeral(number).format('0,0.00'),
};

const pug = require('pug');
// app.set('view engine', 'pug');
// app.set('views', './templates');
const compiledFunction = pug.compileFile('./templates/pongit.pug');

router.get('/api/invoice/create', function *(next) {
  //const params = this.request.body;
  const params = {"client":{"id":2,"name":"Nexios Consulting Group NV","address":"Telecom Gardens – Medialaan 36","city":"B-1800 Vilvoorde","btw":"BE0478.895.136","rate":{"hourly":65}},"number":11,"date":"2016-10-31T22:59:59.999Z","hours":24,"money":{"totalWithoutTax":1560,"taxPercentage":21,"totalTax":327.59999999999997,"total":1887.6}}
  //params.date = moment(params.date);

  this.body = compiledFunction(Object.assign({your: pongit}, locals, params, {origin: this.request.origin}));
});

app.use(router.routes());
app.listen(3001);
