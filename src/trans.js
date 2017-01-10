const trans = {
  title: 'Facturen',
  nav: {
    create: 'Nieuwe factuur',
    config: 'Config',
  },
  save: 'Bewaren',
  delete: 'Verwijderen',
  no: 'Nee',
  config: {
    defaultClient: 'Standaard klant',
    nextInvoiceNumber: 'Volgend factuurnummer',
  },
  invoice: {
    client: 'Klant',
    number: 'Factuurnummer',
    numberShort: 'Nr',
    deleteTitle: 'Factuur verwijderen',
    deletePopup: 'Factuur {number} ({client}) permanent verwijderen?',
    date: 'Factuurdatum',
    hours: 'Totaal uren',
    create: 'Maak factuur',
    preview: 'Preview',
    totalTitle: 'Factuurtotaal',
    subtotal: 'Subtotaal',
    taxtotal: 'BTW {}%',
    total: 'Totaal',
  },
  client: {
    projectDesc: 'Omschrijving',
    hourlyRate: 'Uurprijs',
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

  if (str.indexOf('{}') !== -1) {
    return str.replace('{}', params);

  } else if (typeof params === 'object') {
    Object.keys(params).forEach(function(paramKey) {
      str = str.replace('{' + paramKey + '}', params[paramKey]);
    });
  }

  return str;
}
