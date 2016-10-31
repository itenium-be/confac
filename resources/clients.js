import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/clients'
  });

  router.get('/', function *(next) {
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

  app.use(router.routes());
  app.use(router.allowedMethods());
}
