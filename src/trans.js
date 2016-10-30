const trans = {
  title: 'Facturatie',
  nav: {
    create: 'Nieuwe factuur',
  },
  invoice: {
    client: 'Klant',
    number: 'Factuurnummer',
    date: 'Factuurdatum',

  },
  consultant: {

  },
  controls: {
    dateTimeToday: 'Vandaag',
  }
};

export default function(key, params) {
  var str;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => o[i], trans);
  }

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('${}') !== -1) {
    return str.replace('${}', params);

  } else if (typeof params === 'object') {
    Object.keys(params).forEach(function(paramKey) {
      str = str.replace('${' + paramKey + '}', params[paramKey]);
    });
  }

  return str;
};
