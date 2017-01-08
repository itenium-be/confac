import Router from 'koa-router';
import { locals } from '../pug-helpers.js';

export default function register(app) {
  // app.set('view engine', 'pug');
  // app.set('views', './templates');
  const router = new Router({
    prefix: '/api/invoices'
  });

  const pug = require('pug');
  const pdf = require('html-pdf');
  const Readable = require('stream').Readable;


  router.post('/preview', function *(next) {
    const params = this.request.body;
    const compiledFunction = pug.compileFile('./templates/' + params.your.template);
    const html = compiledFunction(Object.assign({}, locals, params, {origin: this.request.origin}));

    yield new Promise((resolve, reject) => {
      pdf.create(html).toStream((err, stream) => {
        if (err) {
          reject();
        }

        var outStream = this.body = new Readable();
        stream.on('readable', function() {
          const d = stream.read();
          outStream.push(d ? d.toString('base64') : null);
        });
        stream.on('end', function() {
          resolve();
        });
      });
    });
  });



  router.post('/create', function *(next) {
    const params = this.request.body;
    const compiledFunction = pug.compileFile('./templates/' + params.your.template);
    const html = compiledFunction(Object.assign({}, locals, params, {origin: this.request.origin}));

    yield new Promise((resolve, reject) => {
      pdf.create(html).toStream((err, stream) => {
        if (err) {
          reject();
        }

        var outStream = this.body = new Readable();
        stream.on('readable', function() {
          const d = stream.read();
          outStream.push(d ? d.toString('base64') : null);
        });
        stream.on('end', function() {
          resolve();
        });
      });
    });
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
