import Router from 'koa-router';
import { locals } from '../pug-helpers.js';

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

export default function register(app) {
  // app.set('view engine', 'pug');
  // app.set('views', './templates');
  const router = new Router({
    prefix: '/api/invoices'
  });

  const pug = require('pug');
  const compiledFunction = pug.compileFile('./templates/pongit.pug');

  const fs = require('fs');
  const pdf = require('html-pdf');

  router.post('/create', function *(next) {
    const params = this.request.body;
    //const params = {"client":{"id":2,"name":"Nexios Consulting Group NV","address":"Telecom Gardens – Medialaan 36","city":"B-1800 Vilvoorde","btw":"BE0478.895.136","rate":{"hourly":65}},"number":11,"date":"2016-10-31T22:59:59.999Z","hours":24,"money":{"totalWithoutTax":1560,"taxPercentage":21,"totalTax":327.59999999999997,"total":1887.6}}

    const html = compiledFunction(Object.assign({your: pongit}, locals, params, {origin: this.request.origin}));
    // this.body = html;
    const options = {format: 'A4'};

    yield new Promise((resolve, reject) => {
      pdf.create(html).toStream((err, stream) => {
        //stream.pipe(fs.createWriteStream('./foo.pdf'));
        this.body = stream;
        resolve();
      });
    });
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
