const trans = {
  title: 'Facturen',
  nav: {
    create: 'Nieuwe factuur',
    config: 'Config',
  },
  search: 'Zoeken',
  edit: 'Aanpassen',
  save: 'Bewaren',
  delete: 'Verwijderen',
  no: 'Nee',
  toastrSuccessTitle: 'Mucho succes',
  toastrFailureTitle: 'Oh noes!',
  toastrFailure: 'Boem! Crash! Kapot!',
  toastrConfirm: 'Wijzigingen bewaard',
  config: {
    popupMessage: 'Instellingen bewaard',
    defaultClient: 'Standaard klant',
    nextInvoiceNumber: 'Volgend factuurnummer',
  },
  invoice: {
    invoices: 'Facturen',
    client: 'Klant',
    number: 'Factuurnummer',
    numberShort: 'Nr',
    deleteTitle: 'Factuur verwijderen',
    deletePopup: 'Factuur {number} ({client}) permanent verwijderen?',
    deleteConfirm: 'Factuur verwijderd',
    createConfirm: 'Factuur aangemaakt',
    date: 'Factuurdatum',
    hours: 'Totaal uren',
    hoursShort: 'Uren',
    days: 'Dagen',
    create: 'Maak factuur',
    preview: 'Preview',
    totalTitle: 'Factuurtotaal',
    subtotal: 'Subtotaal',
    subtotalLong: 'Subtotaal (zonder btw)',
    taxtotalShort: 'Btw',
    taxtotal: 'BTW {}%',
    total: 'Totaal',
    orderNr: 'Bestelbon nr',
    verifyAction: 'Factuur verifiëren',
    notVerifiedOnly: 'Toon enkel de niet geverifiëerde',
    isNotVerified: 'Factuur nog niet geverifieerd!',
    isVerifiedConfirm: 'Factuur nu geverifieerd',
    isNotVerifiedConfirm: 'Factuur niet meer geverifieerd',
    downloadAttachment: 'Invoice {type} downloaden',
    addLine: 'Factuurlijn toevoegen',
    attachments: 'Bijlagen',
    attachmentsAdd: 'Bijlage toevoegen',
    attachmentsDropzone: 'Drop hier bestanden of klik hier om factuur bijlagen op te laden',
    updatePdf: 'Pdf updaten',
  },
  client: {
    projectDesc: 'Omschrijving',
    hourlyRate: 'Uurprijs',
  },
  controls: {
    dateTimeToday: 'Vandaag',
    noResultsText: 'Geen resultaten',
    clearValueText: 'Filter verwijderen',
    clearAllText: 'Alle filters verwijderen',
    addLabelText: 'Filter "{value}" toevoegen?',
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
