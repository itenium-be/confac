/* eslint-disable max-len */
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
    project: 'Project',
    props: {},
  },
  projectMonth: {
    title: 'Project maanden',
    listTitle: 'Project maanden',
    createNew: false,
    props: {
      project: 'Project',
      consultant: 'Consultant',
      timesheet: 'Timesheet',
      timesheetCheck: 'SDWorx',
      inbound: 'Ontvangen factuur',
      outbound: 'Verstuurde factuur',
    }
  },
  users: {
    title: 'Gebruikers',
    listTitle: 'Gebruikers',
    createNew: 'Nieuwe gebruiker',
    props: {
      email: 'Email',
      name: 'Naam',
      firstName: 'Voornaam',
      alias: 'Alias',
      roles: 'Rollen',
    },
  },
  roles: {
    title: 'Rollen',
    listTitle: 'Rollen',
    createNew: 'Nieuwe rol',
    props: {
      name: 'Naam',
      claims: 'Claims',
    },
  },
};


export const trans = {
  title: 'Facturen',
  taxRequest: 'btw in aanvraag',
  loadingApp: 'Bezig met laden applicatie...',
  nav: {
    monthlyInvoicing: 'Facturatie',
    invoices: 'Facturen',
    quotations: 'Offertes',
    clients: 'Klanten',
    projects: 'Projecten',
    config: 'Config',
  },
  titles: {
    config: 'Configuratie',
    clientList: 'Klanten',
    clientNew: 'Nieuwe klant',
    projectList: 'Projecten',
    projectEdit: '{consultant} @ {client}',
    projectNew: 'Nieuw project',
    projectMonthsList: 'Maandelijkse facturatie',
    invoiceList: 'Facturen',
    invoiceNew: 'Nieuwe factuur',
    quotationNew: 'Nieuwe offerte',
    quotationList: 'Offertes',
    consultantList: 'Consultants',
    consultantEdit: '{name}',
    consultantNew: 'Nieuwe consultant',
    usersList: 'Gebruikers & Rollen',
    userEdit: '{name}',
    userNew: 'Nieuwe gebruiker',
    admin: 'Beheer applicatie',
    roleNew: 'Nieuwe rol',
    roleEdit: 'Rollen',
    projectMonthNew: 'Nieuwe eenmalige maandelijkse facturatie',
    projectMonthEdit: '{consultantName} @ {clientName}',
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
  createdOn: 'Aangemaakt op {date} om {hour}',
  createdBy: ' door {name}',
  modifiedOn: 'Laatst gewijzigd op {date} om {hour}',
  modifiedBy: ' door {name}',
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
    perType: {
      hourly: 'uur',
      daily: 'dag',
      km: 'km',
      items: 'product',
      other: 'ander',
      section: 'sectie',
    },
  },
  feature: {
    showInactive: 'Toon inactieve',
    deactivateTitle: 'Deactiveren',
    activateTitle: 'Activeren',
  },
  config: {
    invoiceTitle: 'Standaard factuurinstellingen',
    popupMessage: 'Instellingen bewaard',
    language: 'Taal communicatie',
    defaultClient: 'Standaard klant',
    defaultInvoiceLines: 'Standaard factuurlijn(en)',
    defaultInvoiceDateStrategy: 'Standaard factuurdatum',
    attachmentTypes: 'Standaard factuurbijlage(n)',
    invoicePayDays: 'Betalingstermijn (kalenderdagen)',
    invoiceFileName: 'Standaard factuur bestandsnaam',
    invoiceReplacements: {
      title: 'Factuur substituties',
      nr: 'Factuurnummer',
      nrX: 'Factuurnummer prefixed met 0 tot X getallen',
      date: 'Factuurdatum met FORMAT: jaar=YYYY, maand=MM, dag=DD (MomentJS)',
      dateShort: 'Factuurdatum',
      orderNr: 'Bestelbon nummer',
      clientName: 'Naam klant',
      consultantName: 'Naam consultant',
      projectMonth: 'Project maand (MomentJS)',
      projectMonthShort: 'Project maand',
    },
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
      template: 'Html template (facturen)',
      templateQuotation: 'Html template (offertes)',
    },
    email: {
      title: 'Factuur emails',
      subject: 'Standaard onderwerp',
      body: 'Standaard email',
      from: 'Emails versturen vanuit',
      cc: 'Standaard CC',
      bcc: 'Standaard BCC',
      attachments: 'Standaard extra email bijlagen',
    },
    emailSignature: 'Standaard email signature',
    emailReminder: 'Email factuur herinnering',
    emailReminderCc: 'Herinnering CC',
    emailReminderBcc: 'Herinnering BCC',
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
    consultant: 'Consultant',
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
    partner: 'Onderaannemer',
    partnerNew: 'Nieuwe klant',
    clientEditModal: 'Open details in modal',
    number: 'Factuurnummer',
    numberShort: 'Nr',
    discount: 'Korting',
    consultant: 'Consultant',
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
    downloadInvoice: '"{fileName}" downloaden',
    addLine: 'Factuurlijn toevoegen',
    attachments: 'Bijlagen',
    attachmentsAdd: 'Bijlage toevoegen',
    attachmentsDropzone: 'Drop hier een bestand of klik hier om een factuur bijlage op te laden',
    attachmentsProposed: '{type} opladen',
    attachmentViewTooltip: '{type} bekijken',
    pdfTemplateNotFoundTitle: 'Pdf template niet gevonden!',
    pdfTemplateNotFound: 'De pdf template was niet gevonden (check Config)',
    search: {
      placeholder: 'Lijst filteren',
    },
    badRequest: {
      nrExists: 'Nr {nr} kan niet gemaakt worden omdat nr {lastNr} reeds bestaat',
      dateAfterExists: 'Factuur op {date} kan niet gemaakt worden om dat nr {lastNr} op {lastDate} gemaakt is',
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
    upload: 'Voeg een bestand toe',
    noneUploaded: 'Er zijn nog geen bijlages toegevoegd.',
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
    language: 'Taal communicatie',
    notes: 'Notitie',
    telephone: 'Telefoon nr',
    contact: 'Contact gegevens',
    projectDesc: 'Omschrijving',
    deactivateTitle: 'Klant deactiveren',
    activateTitle: 'Klant activeren',
    timeTitle: 'Geïnvesteerd',
    daysWorked: '{days} dagen',
    title: 'Standaard factuurwaarden',
    hoursInDay: 'Uren per dag',
    defaultInvoiceLines: 'Standaard factuurlijn(en)',
    defaultChangingOrderNr: 'Het bestelbon nr wijzigt voor elke factuur',
    defaultInvoiceDateStrategy: 'Standaard factuurdatum',
    invoiceFileName: 'Standaard factuur bestandsnaam',
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
    externals: 'Externen',
    managers: 'Managers',
    createNew: 'Nieuwe consultant',
    openEditModal: 'Open details in modal',
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
    consultantId: 'Consultant',
    consultantType: 'Type',
    startDate: 'Start datum',
    endDate: 'Eind datum',
    partner: {
      clientId: 'Onderaannemer',
      tariff: 'Tarief',
      rateType: 'Eenheid',
      ref: 'Referentie',
    },
    client: {
      clientId: 'Klant',
      tariff: 'Klant tarief',
      rateType: 'Eenheid',
      ref: 'Referentie',
      advancedInvoicing: 'Specifieke facturatiedetails instellen',
    },
    projectMonthConfig: {
      titleConfig: 'Maandelijkse facturatie',
      timesheetCheck: 'Timesheets: SDWorx rapport check',
      inboundInvoice: 'Heeft inkomende factuur',
      changingOrderNr: 'Het bestelbon nr wijzigt voor elke factuur',
    },
    copy: {
      buttonText: 'Verlenging',
      modalTitle: 'Verlenging Project',
      startDate: 'Start datum',
      endDate: 'Eind datum',
    },
  },
  projectMonth: {
    createProjects: {
      title: 'Projectopvolging: maand toevoegen',
      selectMonth: 'Selecteer de maand waarvoor de projecten aangemaakt moeten worden',
      noNewRecordsTitle: 'Niets toe te voegen',
      noNewRecordsLabel: 'Alle actieve projecten zijn reeds gelinkt aan deze maand',
      newRecordsTitle: 'Facturatie voor volgende projecten wordt aangemaakt',
    },
    consultant: 'Consultant',
    title: 'Projecten maand',
    listTitle: '{month} {year}',
    footer: {
      forecast: 'Forecast excl. btw',
      projecten: '{projects} projecten',
      workDays: '{count} werkdagen in {month}',
    },
    deleteConfirm: {
      title: 'Verwijderen bevestigen',
      content: 'Deze record wordt zondermeer hard gedelete. Ik hoop dat je weet wat je aan het doen bent!',
      toastr: 'Project maand record verwijderd',
    },
    props: {
      month: 'Maand',
      projectId: 'Project',
      verified: 'Geverifiëerd',
      orderNr: 'Bestelbon nr',
      note: 'Notitie',
      timesheet: {
        title: 'Timesheet consultant',
        timesheet: 'Dagen op de getekende timesheet',
        check: 'Dagen op het SDWorx rapport',
        note: 'Notities',
        validated: 'Gevalideerd',
      },
      inbound: {
        title: 'Ontvangen factuur van onderaannemer',
        nr: 'Hun factuur nr',
        dateReceived: 'Hun factuur ontvangen op',
        status: 'Status',
      },
    },
    list: {
      openList: 'Tonen',
      closeList: 'Verbergen',
      verifiedBadge: '{verified} / {total} facturen geverifiëerd',
      allVerifiedBadge: 'Alle facturen betaald',
      timesheetPending: '{timesheetPendingCount} Pending',
      timesheetOk: 'OK!',
      inboundAllPaid: 'Alle betaald',
    },
    statusTrue: 'Gevalideerd: Timesheet, ontvangen factuur en verstuurde factuur zijn gevalideerd',
    statusFalse: 'Niet gevalideerd: Er is nog iets niet in orde!',
    linkLabel: 'Ga naar details',
    timesheetdaily: 'Dagen',
    timesheethourly: 'Uren ',
    timesheetCheck: 'SDWorx',
    timesheetCheckDownloadTooltip: 'SDWorx timesheet bekijken',
    timesheetNote: 'Notitie Timesheet {name}',
    timesheetUpload: 'Timesheet uploaden',
    timesheetExpiration: 'loopt af {daysLeft}',
    inboundInvoiceNr: 'Nr',
    inboundDateReceived: 'Ontvangen op',
    inboundUpload: 'Binnenkomende factuur opladen',
    inboundNew: 'Nieuw: Factuur nog niet behandeld',
    inboundPaid: 'Betaald: Factuur is betaald',
    inboundValidated: 'Gevalideerd: Timesheet en bedrag zijn gecontroleerd',
    outboundCreateInvoice: 'Factuur maken',
    outboundCreateInvoiceTitle: 'Totaal excl: {totalWithoutTax}. Totaal incl: {total}',
    note: 'Facturatie perikelen',
    addNote: 'Commentaar toevoegen',
    forceVerified: 'Forceer afgehandeld zonder een factuur op te maken',
    validateTimesheet: 'Timesheet valideren',
    validateTimesheetDisabled: 'Timesheet kan pas gevalideerd worden als de twee getallen overeenkomen (consultants),<br>er een getal ingevuld is (externen) of er een commentaar is toegevoegd',
    unvalidateTimesheet: 'Timesheet invalideren',
    viewTimesheet: 'Timesheet bekijken: {fileName}',
    viewInboundInvoice: 'Ontvangen factuur bekijken: {fileName}',
    linkToDetails: 'Ga naar project',
    sdWorxTimesheetUpload: 'SDWorx timesheet opladen',
    selectLabel: 'Project maand',
    markup: 'Markup',
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

    clipboard: {
      success: 'Copied {text}!',
      failure: 'Copy failed',
    },
  },
  email: {
    title: 'Factuur emailen',
    prepareEmail: 'Email voorbereiden',
    prepareEmailReminder: 'Email herinnering',
    to: 'Naar',
    toPlaceholder: 'Email adressen met ; scheiden',
    cc: 'CC',
    bcc: 'BCC',
    subject: 'Onderwerp',
    send: 'Versturen',
    attachments: 'Bijlagen',
    sent: 'Email verstuurd',
    lastEmail: 'Laatst verstuurd op {at} - {daysAgo}',
    lastEmailDaysAgo: 'Laatste email {daysAgo}.',
    notMailed: 'Mail nog niet verstuurd',
  },
  user: {
    login: 'Sign in with Google',
    logout: 'Logout of Google',
    loginError: 'Inloggen mislukt',
    users: 'Gebruikers',
    createNew: 'Nieuwe gebruiker',
    props: {
      email: 'Email',
      name: 'Naam',
      firstName: 'Voornaam',
      alias: 'Alias',
      roles: 'Rollen',
      active: 'Actief',
    },
  },
  role: {
    createNew: 'Nieuwe rol',
    listTitle: 'Rollen',
    props: {
      name: 'Naam',
      claims: 'Claims',
    },
  },
  admin: {
    title: 'Administrator Configuratie',
    users: 'Beheer gebruikers',
  },
};

export default function (key: string, params?: object): string {
  if (!key) {
    return 'UNDEFINED KEY';
  }

  let str: any;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => {
      if (!o || !o[i]) {
        console.error(`trans.ts: Could not find '${key}' on`, o); // eslint-disable-line
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
