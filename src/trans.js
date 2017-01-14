const trans = {
  title: 'Facturen',
  nav: {
    config: 'Config',
    clients: 'Klanten',
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
    title: 'Instellingen',
    popupMessage: 'Instellingen bewaard',
    defaultClient: 'Standaard klant',
    company: {
      title: 'Jouw bedrijfsgegevens',
      name: 'Bedrijfsnaam',
      address: 'Straat',
      city: 'Stad',
      telephone: 'Telefoon nr',
      email: 'Email',
      iban: 'IBAN',
      bank: 'Naam bank',
      bic: 'BIC',
      btw: 'BTW',
      template: 'Html template',
      website: 'Website',
      slug: 'Bedrijfsnaam in de url',
    },
  },
  invoice: {
    fileName: 'Pdf bestandsnaam factuur',
    fileNamePlaceHolder: '{date:YYYY-MM-DD} {nr:4} {orderNr}',
    createNew: 'Nieuwe factuur',
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
    verifyActionTooltip: 'Factuur verifiëren<br>Openstaand voor {days} dagen',
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
    createNew: 'Nieuwe klant',
    name: 'Klant',
    contact: 'Contact',
    projectDesc: 'Omschrijving',
    hourlyRate: 'Uurprijs',
    deactivateTitle: 'Klant deactiveren',
    activateTitle: 'Klant activeren',
    showInactive: 'Inactieve klanten tonen',
    invoiceAmount: '{amount} facturen',
    timeTitle: 'Geïnvesteerd',
    hoursWorked: '{hours} uren',
    daysWorked: '{days} dagen',
    rate: {
      title: 'Tarief',
      desc: 'Standaard project',
      hoursInDay: 'Uren per dag',
    },
  },
  controls: {
    popupBlockerTitle: 'Mislukt!? Popup blocker misschien?',
    popupBlocker: 'Schakel de popupblocker voor deze pagina uit. Pdf preview is anders niet beschikbaar.',
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
