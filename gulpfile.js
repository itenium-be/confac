'use strict';

// Generate html templates on file save
// To start a static http server:
// $ npm run serve

var src = './templates/';
var dest = './dist/';


var gulp = require('gulp');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var locals = require('./src/pug-helpers.js').locals;

gulp.task('pug', function() {
  gulp.src(src + '*.pug')
  .pipe(plumber())
  .pipe(pug({
    locals: Object.assign(getSomeInvoice(), locals, {origin: './'}),
    pretty: true
  }))
  .pipe(gulp.dest(dest));
});

gulp.task('copyres', function() {
  gulp.src([src + '*.*']).pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
  gulp.watch(src + '**/*', ['pug']);
  gulp.watch(['./res/**/*.*'], ['copyres']);
});

gulp.task('build', ['copyres', 'pug']);
gulp.task('default', ['build', 'watch']);



function getSomeInvoice() {
  return {
    _id: '587a818925a0542c50040d2c',
    number: 18,
    client: {
      _id: '587a678885fcd847588cf087',
      active: true,
      name: 'Apple',
      address: '1 Infinite Loop',
      city: 'Cupertino, CA 95014',
      telephone: '(408) 996–1010',
      btw: '',
      invoiceFileName: '{date:YYYY-MM} {nr:4} - ',
      rate: {
        type: 'hourly',
        hoursInDay: 8,
        value: 100,
        description: 'osx²'
      }
    },
    your: {
      template: 'example-1.pug',
      name: 'pongit BVBA',
      address: 'Doolhofstraat 37',
      city: '9300 Aalst',
      btw: '0662.755.072',
      bank: 'Belfius',
      iban: 'BE04 0689 0602 8931',
      bic: 'GKCCBEBB',
      telephone: '0476 / 40 35 02',
      email: 'woutervs@hotmail.com',
      website: 'www.pongit.be'
    },
    date: '2016-12-31T22:59:59.999Z',
    orderNr: 'ytjtyj',
    verified: true,
    lines: [
      {
        type: 'hourly',
        desc: 'osx²',
        value: 10,
        rate: 100
      },
      {
        type: 'hourly',
        desc: 'yuplaa',
        value: 1,
        rate: 50
      }
    ],
    money: {
      totalValue: 11,
      totalWithoutTax: 1050,
      taxPercentage: 21,
      totalTax: 220.5,
      total: 1270.5
    }
  };
}