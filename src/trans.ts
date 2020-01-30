// TODO: delete all translations in trans that have moved to features
export const features = {
  consultant: {
    title: 'Consultants',
    listTitle: 'Consultants',
    createNew: 'Nieuwe consultant',
    props: {
      _id: 'Id',
      name: 'Naam',
      firstName: 'Voornaam',
      slug: 'Naam in de url',
      type: 'Type',
      email: 'E-mail',
      telephone: 'Telefoon nr',
      createdOn: 'Aangemaakt op',
      active: 'Actief',
    },
  },
  invoice: {
    title: 'Facturen',
    listTitle: 'Facturen',
    createNew: 'Nieuwe factuur',
    props: {},
  },
  client: {
    title: 'Klanten',
    listTitle: 'Klanten',
    createNew: 'Nieuwe klant',
    props: {},
  },
  project: {
    title: 'Projecten',
    listTitle: 'Projecten',
    createNew: 'Nieuw project',
    props: {},
  },
};


export const trans = {
  title: 'Facturen',
  taxRequest: 'btw in aanvraag',
  nav: {
    config: 'Config',
    clients: 'Klanten',
    quotations: 'Offertes',
    projects: 'Projecten',
  },
  search: 'Zoeken',
  edit: 'Aanpassen',
  save: 'Bewaren',
  cancel: 'Annuleren',
  delete: 'Verwijderen',
  add: 'Toevoegen',
  no: 'Nee',
  close: 'Sluiten',
  view: 'Details',
  toastrSuccessTitle: 'Mucho succes',
  toastrFailureTitle: 'Oh noes!',
  toastrFailure: 'Boem! Crash! Kapot!',
  toastrConfirm: 'Wijzigingen bewaard',
  notes: 'Notitie',
  extraFields: 'Extra velden',
  createdOn: 'Aangemaakt op:',
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
      section: 'Sectie',
    },
  },
  feature: {
    showInactive: 'Toon inactieve',
    deactivateTitle: 'Deactiveren',
    activateTitle: 'Activeren',
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
    defaultInvoiceDateStrategy: 'Standaard factuurdatum',
    attachmentTypes: 'Standaard factuurbijlage(n)',
    invoicePayDays: 'Betalingstermijn (kalenderdagen)',
    template: 'Html template (facturen)',
    templateQuotation: 'Html template (offertes)',
    invoiceFileName: 'Standaard factuur bestandsnaam',
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
      rpr: 'Rechtspersonenregister',
      other: 'Ander',
      templateLoadError: 'Html factuur templates konden niet geladen worden',
      website: 'Website',
      slug: 'Bedrijfsnaam in de url',
      contact: 'Contact persoon',
      contactEmail: 'Email contact persoon',
      notes: 'Notitie',
    },
    extraFields: {
      title: 'Eigen velden',
      open: 'Extra velden tonen',
      config: 'Extra config velden',
      client: 'Extra klant velden',
      clientInvoice: 'Extra factuur velden',
    },
    email: {
      title: 'Factuur emails',
      subject: 'Standaard onderwerp',
      body: 'Standaard email',
      from: 'Emails versturen vanuit',
      bcc: 'Standaard BCC',
      attachments: 'Standaard extra email bijlagen',
    },
    emailSignature: 'Standaard email signature',
    emailReminder: 'Email factuur herinnering',
  },
  quotation: {
    title: 'Offertes',
    pdfName: 'Offerte',
    createNew: 'Nieuwe offerte',
    date: 'Offertedatum',
    orderNrShort: 'Bestelbon ref',
    editTitle: 'Offerte details',
    createTitle: 'Nieuwe offerte',
    number: 'Offertenummer',
    fileName: 'Pdf bestandsnaam offerte',
    addLine: 'Offertelijn toevoegen',
    create: 'Maak offerte',
    amount: 'offertes',
    amountOne: '1 offerte',
    deleteTitle: 'Offerte verwijderen',
    deletePopup: 'Offerte {number} ({client}) permanent verwijderen?',
    deleteConfirm: 'Offerte verwijderd',
    createConfirm: 'Offerte aangemaakt',
    viewPdf: 'Pdf offerte bekijken',
  },
  invoice: {
    invoice: 'Factuur',
    pdfName: 'Factuur',
    createTitle: 'Nieuwe factuur maken',
    editTitle: 'Factuur details',
    fileName: 'Pdf bestandsnaam factuur',
    fileNamePlaceHolder: '{date:YYYY-MM-DD} {nr:4} {orderNr}',
    createNew: 'Nieuwe factuur',
    amount: 'Facturen',
    amountOne: '1 factuur',
    client: 'Klant',
    clientNew: 'Nieuwe klant',
    clientEditModal: 'Open details in modal',
    number: 'Factuurnummer',
    numberShort: 'Nr',
    discount: 'Korting',
    discountPlaceholder: 'Geef een vaste korting (vb 250) of een percentage (vb 10%)',
    deleteTitle: 'Factuur verwijderen',
    deletePopup: 'Factuur {number} ({client}) permanent verwijderen?',
    deleteConfirm: 'Factuur verwijderd',
    createConfirm: 'Factuur aangemaakt',
    date: 'Factuurdatum',
    dateStrategies: {
      'prev-month-last-day': 'Laatste dag vorige maand',
      today: 'Vandaag',
    },
    hours: 'Totaal uren',
    days: 'Dagen',
    create: 'Maak factuur',
    preview: 'Preview',
    viewPdf: 'Pdf factuur bekijken',
    totalTitle: 'Totaal',
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
    notVerifiedFor: '{days} dagen openstaand.',
    isVerifiedConfirm: 'Factuur nu geverifieerd',
    isNotVerifiedConfirm: 'Factuur niet meer geverifieerd',
    downloadAttachment: '{type} downloaden',
    downloadInvoice: 'Factuur downloaden',
    addLine: 'Factuurlijn toevoegen',
    attachments: 'Bijlagen',
    attachmentsAdd: 'Bijlage toevoegen',
    attachmentsDropzone: 'Drop hier een bestand of klik hier om een factuur bijlage op te laden',
    attachmentsProposed: '{type} opladen',
    pdfTemplateNotFoundTitle: 'Pdf template niet gevonden!',
    pdfTemplateNotFound: 'De pdf template was niet gevonden (check Config)',
    search: {
      placeholder: 'Lijst filteren',
    },
    editExtraFields: 'Extra velden bewerken',
    badRequest: {
      nrExists: 'Nr {nr} kan niet gemaakt worden omdat nr {lastNr} reeds bestaat',
      dateAfterExists: 'Op {date} kan niet gemaakt worden om dat nr {lastNr} op {lastDate} gemaakt is',
    },
    listAdvancedFilters: 'Meer filters',
    listDownloadZip: 'Alle in de lijst zichtbare facturen downloaden (zip)',
    listDownloadExcel: 'Alle in de lijst zichtbare Facturen exporteren als Excel rapport (csv)',
  },
  attachment: {
    types: 'Bijlage types',
    type: 'Type bijlage',
    typeExists: 'Dit type bijlage bestaat reeds voor dit document.',
    toggleEditForm: 'Bijlagen verwijderen',
    deleteTitle: 'Bijlage verwijderen?',
    deletePopup: 'De bijlage verwijderen?',
  },
  client: {
    createNew: 'Nieuwe klant',
    btwPlaceholder: 'BTW nummer',
    createNewBtwPlaceholder: 'BTW nummer nieuwe klant',
    createNewButton: 'Klant aanmaken',
    name: 'Klant',
    btw: 'BTW',
    address: 'Straat',
    city: 'Stad',
    slug: 'Bedrijfsnaam in de url',
    contactEmail: 'Email contact persoon',
    notes: 'Notitie',
    telephone: 'Telefoon nr',
    contact: 'Contact gegevens',
    projectDesc: 'Omschrijving',
    deactivateTitle: 'Klant deactiveren',
    activateTitle: 'Klant activeren',
    timeTitle: 'Geïnvesteerd',
    daysWorked: '{days} dagen',
    title: 'Standaard factuurwaarden',
    rate: {
      description: 'Standaard omschrijving',
      hoursInDay: 'Uren per dag',
      value: 'Standaard prijs',
      type: 'Standaard factuurlijn eenheid',
    },
    defaultExtraInvoiceFields: 'Extra factuur velden',
    defaultInvoiceDateStrategy: 'Standaard factuurdatum',
    invoiceFileName: 'Standaard factuur bestandsnaam',
    extraFields: 'Extra klant velden',
    viewDetails: 'Ga naar detail scherm',
    email: {
      to: 'Naar',
      toPlaceholder: 'Email adressen met ; scheiden',
      cc: 'CC',
      bcc: 'BCC',
      subject: 'Onderwerp',
      attachments: 'Vereiste email bijlage(n)',
      combineAttachments: 'Stuur alle bijlagen als 1 pdf',
    },
  },
  consultant: {
    title: 'Consultants',
    createNew: 'Nieuwe consultant',
    types: {
      manager: 'Manager',
      consultant: 'Consultant',
      freelancer: 'Freelancer',
      externalConsultant: 'Externe consultant',
    },
    props: {
      _id: 'Id',
      name: 'Naam',
      firstName: 'Voornaam',
      slug: 'Naam in de url',
      type: 'Type',
      email: 'E-mail',
      telephone: 'Telefoon nr',
      createdOn: 'Aangemaakt op',
      active: 'Actief',
    },
  },
  project: {
    project: 'Project',
    createNew: 'Nieuw project',
    newMonth: 'Maand toevoegen',
    month: 'Maand',
    newConsultant: 'Nieuwe consultant',
    showInactiveProjects: 'Toon inactieve projecten',
    consultant: 'Consultant',
    consultantType: 'Type',
    startDate: 'Start datum',
    endDate: 'Eind datum',
    partner: {
      clientId: 'Partner',
      tariff: 'Partner tarief',
      rateType: 'Rate type',
      ref: 'Referentie',
    },
    client: {
      clientId: 'Klant',
      tariff: 'Klant tarief',
      rateType: 'Rate type',
      ref: 'Referentie',
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
    noOptionsMessage: 'Geen keuzes',
    addFilterText: 'Filter "{value}" toevoegen?',
    addLabelText: '"{value}" toevoegen?',
    selectPlaceholder: 'Maak een keuze',

    propertiesPlaceholder: 'Geef extra veldnamen in',
  },
  email: {
    title: 'Factuur emailen',
    prepareEmail: 'Email voorbereiden',
    to: 'Naar',
    toPlaceholder: 'Email adressen met ; scheiden',
    cc: 'CC',
    bcc: 'BCC',
    subject: 'Onderwerp',
    send: 'Versturen',
    attachments: 'Bijlagen',
    sent: 'Email verstuurd',
    lastEmail: 'Laatst verstuurd op {at}',
    lastEmailDaysAgo: 'Laatste email {daysAgo}.',
    notMailed: 'Mail nog niet verstuurd',
  },
};

export default function (key: string, params?: object): string {
  // console.log('uhoh', key);

  let str: any;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => {
      if (!o[i]) {
        console.log(`trans.ts: Could not find '${key}' on`, o); // eslint-disable-line
        return key;
      }
      return o[i];
    }, trans);
  }

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('{}') !== -1) {
    return str.replace('{}', params);
  }
  if (typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(`{${paramKey}}`, params[paramKey]);
    });
  }

  return str;
}
