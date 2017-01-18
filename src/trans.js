const trans = {
  title: 'Facturen',
  nav: {
    config: 'Config',
    clients: 'Klanten',
  },
  search: 'Zoeken',
  edit: 'Aanpassen',
  save: 'Bewaren',
  cancel: 'Annuleren',
  delete: 'Verwijderen',
  add: 'Toevoegen',
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
      contact: 'Contact persoon',
      contactEmail: 'Email contact persoon',
    },
  },
  invoice: {
    invoice: 'Factuur',
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
    orderNr: 'Bestelbon referentie',
    verifyAction: 'Factuur nu verifiëren',
    verifyActionTooltip: 'Factuur verifiëren<br>Openstaand voor {days} dagen',
    notVerifiedOnly: 'Toon enkel de niet geverifiëerde',
    isNotVerified: 'Deze factuur is nog niet geverifieerd!',
    isVerifiedConfirm: 'Factuur nu geverifieerd',
    isNotVerifiedConfirm: 'Factuur niet meer geverifieerd',
    downloadAttachment: '{type} downloaden',
    addLine: 'Factuurlijn toevoegen',
    attachments: 'Bijlagen',
    attachmentsAdd: 'Bijlage toevoegen',
    attachmentsDropzone: 'Drop hier een bestand of klik hier om een factuur bijlage op te laden',
    updatePdf: 'Pdf updaten',
    pdfTemplateNotFoundTitle: 'Pdf template niet gevonden!',
    pdfTemplateNotFound: 'De pdf template was niet gevonden (check Config)',
    search: {
      placeholder: 'Facturen filteren',
    }
  },
  attachment: {
    types: 'Bijlage types',
    typesPlaceholder: 'Komma separated string :)',
    type: 'Type bijlage',
    typeExists: 'Dit type bijlage bestaat reeds voor deze factuur.',
    toggleEditForm: 'Bijlagen verwijderen',
    deleteTitle: 'Bijlage verwijderen?',
    deletePopup: 'Deze bijlage uit de factuur gooien?',
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
    // browser
    popupBlockerTitle: 'Mislukt!? Popup blocker misschien?',
    popupBlocker: 'Schakel de popupblocker voor deze pagina uit. Pdf preview is anders niet beschikbaar.',

    // TODO: datepicker has some dutch labels in /controls/DatePicker.js
    today: 'Vandaag',

    // select
    noResultsText: 'Geen resultaten',
    clearFilterValueText: 'Filter verwijderen',
    clearValueText: 'Filter verwijderen',
    clearAllFiltersText: 'Alle filters verwijderen',
    clearAllText: 'Alle verwijderen',
    addFilterText: 'Filter "{value}" toevoegen?',
    addLabelText: '"{value}" toevoegen?',
    selectPlaceholder: 'Maak een keuze',
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
