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
  notes: 'Notitie',
  extraFields: 'Extra velden',
  rates: {
    type: 'Eenheid',
    value: 'Aantal',
    rate: 'Eenheidsprijs',
    types: {
      hourly: 'Uren',
      daily: 'Dagen',
      km: 'Km',
      items: 'Producten',
      other: 'Ander',
    },
  },
  config: {
    invoiceTitle: 'Standaard factuurinstellingen',
    settingsTitle: 'Andere instellingen',
    groupByMonth: 'Groepeer facturen per maand',
    popupMessage: 'Instellingen bewaard',
    defaultClient: 'Standaard klant',
    showOrderNr: 'Bestelbon nummer tonen', // in invoice list
    defaultTax: 'Standaard btw',
    defaultInvoiceLineType: 'Standaard factuurlijn eenheid',
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
      other: 'Ander',
      template: 'Html template',
      website: 'Website',
      slug: 'Bedrijfsnaam in de url',
      contact: 'Contact persoon',
      contactEmail: 'Email contact persoon',
    },
    extraFields: {
      title: 'Eigen velden',
      open: 'Extra velden toevoegen',
      config: 'Extra config velden',
      client: 'Extra klant velden',
      clientInvoice: 'Extra factuur velden',
    },
  },
  invoice: {
    invoice: 'Factuur',
    createTitle: 'Nieuwe factuur maken',
    editTitle: 'Factuur details',
    fileName: 'Pdf bestandsnaam factuur',
    fileNamePlaceHolder: '{date:YYYY-MM-DD} {nr:4} {orderNr}',
    createNew: 'Nieuwe factuur',
    invoices: 'Facturen',
    invoicesOne: '1 factuur',
    client: 'Klant',
    number: 'Factuurnummer',
    numberShort: 'Nr',
    deleteTitle: 'Factuur verwijderen',
    deletePopup: 'Factuur {number} ({client}) permanent verwijderen?',
    deleteConfirm: 'Factuur verwijderd',
    createConfirm: 'Factuur aangemaakt',
    date: 'Factuurdatum',
    hours: 'Totaal uren',
    days: 'Dagen',
    create: 'Maak factuur',
    preview: 'Preview',
    totalTitle: 'Factuurtotaal',
    subtotal: 'Subtotaal',
    subtotalLong: 'Subtotaal (zonder btw)',
    taxtotalShort: 'Btw',
    taxtotal: 'BTW',
    total: 'Totaal',
    orderNr: 'Bestelbon referentie',
    orderNrShort: 'Bestelbon ref',
    verifyAction: 'Factuur nu verifiëren',
    verifyActionTooltip: 'Factuur verifiëren<br>Openstaand voor {days} dagen',
    notVerifiedOnly: 'Enkel niet geverifiëerde?',
    groupByMonth: 'Groepeer per maand',
    isVerified: 'Deze factuur is geverifieerd!',
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
    },
    editExtraFields: 'Extra velden bewerken',
  },
  attachment: {
    types: 'Bijlage types',
    type: 'Type bijlage',
    typeExists: 'Dit type bijlage bestaat reeds voor deze factuur.',
    toggleEditForm: 'Bijlagen verwijderen',
    deleteTitle: 'Bijlage verwijderen?',
    deletePopup: 'Deze bijlage uit de factuur gooien?',
  },
  client: {
    createNew: 'Nieuwe klant',
    name: 'Klant',
    contact: 'Contact gegevens',
    projectDesc: 'Omschrijving',
    deactivateTitle: 'Klant deactiveren',
    activateTitle: 'Klant activeren',
    showInactive: 'Inactieve klanten tonen',
    invoiceAmount: '{amount} facturen',
    timeTitle: 'Geïnvesteerd',
    daysWorked: '{days} dagen',
    rate: {
      title: 'Standaard factuurwaarden',
      desc: 'Standaard omschrijving',
      hoursInDay: 'Uren per dag',
      defaultPrice: 'Standaard prijs',
    },
    extraInvoiceFields: 'Extra factuur velden',
    extraFields: 'Extra klant velden',
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

    propertiesPlaceholder: 'Geef extra veldnamen in',
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
