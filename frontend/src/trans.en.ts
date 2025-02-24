/* eslint-disable max-len */
// TODO: delete all translations in trans that have moved to features
export const features = {
  consultant: {
    title: 'Consultants',
    listTitle: 'Consultants',
    createNew: 'New consultant',
    props: {
      _id: 'Id',
      name: 'Name',
      firstName: 'First name',
      slug: 'Name in url',
      type: 'Type',
      email: 'Email',
      telephone: 'Telephone nr',
      createdOn: 'Created on',
      active: 'Active',
      accountingCode: 'Accounting code'
    },
  },
  invoice: {
    title: 'Invoices',
    listTitle: 'Invoices',
    createNew: 'New invoice',
    props: {},
  },
  client: {
    title: 'Clients',
    listTitle: 'Clients',
    createNew: 'New client',
    props: {},
  },
  project: {
    title: 'Projects',
    listTitle: 'Projects',
    createNew: 'New project',
    project: 'Project',
    props: {},
  },
  projectMonth: {
    title: 'Project months',
    listTitle: 'Project months',
    createNew: false,
    props: {
      project: 'Project',
      consultant: 'Consultant',
      timesheet: 'Timesheet',
      timesheetCheck: 'Check',
      inbound: 'Inbound invoice',
      outbound: 'Outbound invoice',
    },
  },
  users: {
    title: 'Users',
    listTitle: 'Users',
    createNew: 'New user',
    props: {
      email: 'Email',
      name: 'Name',
      firstName: 'First name',
      alias: 'Alias',
      roles: 'Roles',
    },
  },
  roles: {
    title: 'Roles',
    listTitle: 'Roles',
    createNew: 'New role',
    props: {
      name: 'Name',
      claims: 'Claims',
    },
  },
  comments: {
    title: 'Comments',
    listTitle: '',
    createNew: 'Add new Comment',
    props: {
      user: 'User',
      text: 'Comment'
    }
  }
};


export const trans = {
  title: 'Invoices',
  taxRequest: 'btw in aanvraag',
  loadingApp: 'Loading application...',
  dataLoad: {
    monthsLoaded: '{months} months in memory',
    loadMore: 'Load more data',
    loadNextMonths: 'Load next {months} months',
  },
  nav: {
    monthlyInvoicing: 'Invoicing',
    invoices: 'Invoices',
    quotations: 'Quotations',
    clients: 'Clients',
    projects: 'Projects',
    config: 'Config',
    home: 'Home'
  },
  titles: {
    config: 'Config',
    clientList: 'Clients',
    clientNew: 'New client',
    clientEdit: 'Client {name}',
    projectList: 'Projects',
    projectEdit: '{consultant} @ {client}',
    projectNew: 'New project',
    projectMonthsList: 'Monthly invoicing',
    invoiceList: 'Invoices',
    invoiceNew: 'New invoice',
    quotationNew: 'New quotation',
    quotationList: 'Quotations',
    consultantList: 'Consultants',
    consultantEdit: '{name}',
    consultantNew: 'NEw consultant',
    usersList: 'Users & Roles',
    userEdit: '{name}',
    userNew: 'New user',
    admin: 'Application config',
    roleNew: 'New role',
    roleEdit: 'Roles',
    projectMonthNew: 'New monthly invoicing',
    projectMonthEdit: '{consultantName} @ {clientName}',
  },
  search: 'Search',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  add: 'Add',
  no: 'No',
  close: 'Close',
  view: 'Details',
  toastrSuccessTitle: 'Mucho succes',
  toastrFailureTitle: 'Oh noes!',
  toastrFailure: 'Boem! Crash! Kaput!',
  toastrConfirm: 'Changes saved',
  notes: 'Notes',
  createdOn: 'Created on {date} at {hour}',
  createdBy: ' by {name}',
  modifiedOn: 'Last changed on {date} at {hour}',
  modifiedBy: ' by {name}',
  rates: {
    type: 'Unit',
    value: 'Amount',
    rate: 'Rate',
    types: {
      hourly: 'Hours',
      daily: 'Days',
      km: 'Km',
      items: 'Products',
      other: 'Other',
      section: 'Section',
    },
    perType: {
      hourly: 'hour',
      daily: 'day',
      km: 'km',
      items: 'product',
      other: 'other',
      section: 'section',
    },
  },
  feature: {
    showInactive: 'Show inactive',
    deactivateTitle: 'Deactivate',
    activateTitle: 'Activate',
  },
  config: {
    invoiceTitle: 'Default invoice settings',
    popupMessage: 'Settings saved',
    language: 'Communication language',
    defaultClient: 'Default client',
    defaultInvoiceLines: 'Default invoice line(sn)',
    defaultInvoiceDateStrategy: 'Default invoice date',
    attachmentTypes: 'Default attachment(s)',
    invoicePayDays: 'Payment terms (calendar days)',
    invoiceFileName: 'Default invoice filename',
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
      clearButton: 'Clear'
    },
    company: {
      title: 'Your company',
      name: 'Company name',
      address: 'Street',
      city: 'City',
      postalCode: 'Postal code',
      telephone: 'Phone nr',
      email: 'Email',
      iban: 'IBAN',
      bank: 'Bank name',
      bic: 'BIC',
      btw: 'Tax',
      rpr: 'RPR',
      other: 'Other',
      templateLoadError: 'Html invoice templates could not be loaded',
      website: 'Website',
      slug: 'Company name in tje url',
      contact: 'Contact person',
      contactEmail: 'Email contact person',
      notes: 'Notes',
      template: 'Html template (invoices)',
      templateQuotation: 'Html template (quotations)',
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
    emailInvoiceOnly: 'Email adres waarnaar enkel de factuur pdf gestuurd wordt',
    emailTermsAndConditions: "'Algemene Voorwaarden' opladen",
    termsAndConditions: 'Algemene Voorwaarden',
    audit: 'Audit',
    otherTitle: 'Other settings',
    initialMonthLoad: 'Initial months loaded at startup',
  },
  audit: {
    openFullAuditModel: 'Open full audit',
    fullAudit: 'Full audit',
    noLogs: 'No audit available',
    modifiedOn: 'On {date} at {hour}',
    change: {
      field: 'Field',
      old: 'Previous value',
      new: 'New value',
    },
  },
  quotation: {
    title: 'Quotations',
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
    invoice: 'Invoice',
    pdfName: 'Invoice',
    createTitle: 'New invoice',
    editTitle: 'Invoice details',
    fileName: 'Pdf filename invocie',
    fileNamePlaceHolder: '{date:YYYY-MM-DD} {nr:4} {orderNr}',
    createNew: 'New invoice',
    amount: 'Invoices',
    amountOne: '1 invoice',
    client: 'Client',
    clientNew: 'New client',
    partner: 'Partner',
    partnerNew: 'New client',
    endCustomer: 'End customer',
    endCustomerNew: 'New client',
    clientEditModal: 'Open details in modal',
    number: 'Invoice nr',
    numberShort: 'Nr',
    discount: 'Discount',
    consultant: 'Consultant',
    toggleProjectMonth: 'Switchen tussen "Project maand kiezen" en "Manueel datum en consultant kiezen"',
    discountPlaceholder: 'Vaste korting (vb 250)/een percentage (vb 10%)',
    deleteTitle: 'Delete invoice',
    deletePopup: 'Delete invoice {number} ({client}) permanently?',
    deleteConfirm: 'Invoice deleted',
    createConfirm: 'Invoice created',
    date: 'Invoice date',
    dateStrategies: {
      'prev-month-last-day': 'Last day last month',
      today: 'Today',
      'new-month-from-22th': 'New month from the 22th'
    },
    hours: 'Total hours',
    days: 'Days',
    period: 'Period',
    create: 'Create invoice',
    preview: 'Preview',
    viewPdf: 'View invoice Pdf',
    totalTitle: 'Total',
    subtotal: 'Subtotal',
    subtotalLong: 'Subtotal (no tax)',
    taxtotalShort: 'Tax',
    taxtotal: 'Tax',
    total: 'Total',
    orderNr: 'Order ref',
    orderNrShort: 'Order ref',
    verifyAction: 'Unverify',
    verifyActionTooltip: 'Verify invoice<br>Unpaid for {days} days',
    notVerifiedOnly: 'Unverified only?',
    groupByMonth: 'Group per month',
    isVerified: 'Invoice is verified!',
    isNotVerified: 'Invoice is not yet verified!',
    notVerifiedFor: '{days} days unpaid.',
    isVerifiedConfirm: 'Verify invoice',
    isNotVerifiedConfirm: 'Unverify invoice',
    downloadAttachment: 'Download {type}',
    downloadInvoice: 'Download "{fileName}"',
    addLine: 'Add invoice line',
    attachments: 'Attachments',
    attachmentsAdd: 'Add attachment',
    attachmentsDropzone: 'Drop a file or click here to upload an invoice attachment',
    attachmentsProposed: 'Upload {type}',
    attachmentViewTooltip: 'View {type}',
    pdfTemplateNotFoundTitle: 'Pdf template niet gevonden!',
    pdfTemplateNotFound: 'The pdf template could not be found (check Config)',
    search: {
      placeholder: 'Filter list',
      withoutPayPeriod: 'Without period',
      withoutConsultant: 'Without consultant',
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
  contract: {
    notes: 'Contract notitie',
    ok: 'Contracten getekend',
    nok: 'Contracten nog NIET getekend',
    status: {
      NoContract: 'Geen',
      Sent: 'Verstuurd',
      Verified: 'Geverifieerd',
      WeSigned: 'Getekend (wij)',
      TheySigned: 'Getekend (zij)',
      BothSigned: 'Getekend (beide)',
      NotNeeded: 'Niet nodig',
    }
  },
  client: {
    createNew: 'New client',
    btwPlaceholder: 'Tax number',
    createNewBtwPlaceholder: 'Tax number new client',
    createNewButton: 'Create client',
    alreadyExists: 'Client with tax nr {btw} already exists',
    name: 'Client',
    types: "Type(s)",
    btw: 'Tax',
    address: 'Street & Nr',
    city: 'City',
    postalCode: 'Postal code',
    country: 'Country',
    slug: 'Name in the url',
    contactEmail: 'Email contact person',
    language: 'Communication language',
    notes: 'Notes',
    comments: 'Comments',
    telephone: 'Telephone nr',
    contact: 'Contact details',
    projectDesc: 'Description',
    deactivateTitle: 'Deactivate client',
    activateTitle: 'Activate client',
    timeTitle: 'Invested',
    daysWorked: '{days} days',
    title: 'Standaard factuurwaarden',
    hoursInDay: 'Uren per dag',
    defaultInvoiceLines: 'Standaard factuurlijn(en)',
    defaultChangingOrderNr: 'Het bestelbon nr wijzigt voor elke factuur',
    defaultInvoiceDateStrategy: 'Standaard factuurdatum',
    invoiceFileName: 'Standaard factuur bestandsnaam',
    viewDetails: 'Go to detail screen',
    frameworkAgreement: {
      title: 'Raamcontract',
      contract: 'Status raamcontract',
      notes: 'Notes',
    },
    clienttypes: {
      partner: 'Partner',
      client: 'Client',
      endCustomer: 'End customer'
    },
    createNewModal: {
      partner: 'New partner',
      client: 'New client',
      endCustomer: 'new end customer'
    },
    email: {
      to: 'To',
      toPlaceholder: 'Separate email addresses with ;',
      cc: 'CC',
      bcc: 'BCC',
      subject: 'Subject',
      attachments: 'Required attachment(s)',
      combineAttachments: 'Send all attachments as one pdf',
    },
  },
  consultant: {
    title: 'Consultants',
    externals: 'Externals',
    managers: 'Managers',
    createNew: 'New consultant',
    alreadyExists: 'Consultant with this email already exists',
    openEditModal: 'Open details in modal',
    viewDetails: 'Go to details',
    types: {
      manager: 'Manager',
      consultant: 'Consultant',
      freelancer: 'Freelancer',
      externalConsultant: 'External consultant',
    },
    props: {
      _id: 'Id',
      name: 'Name',
      firstName: 'First name',
      slug: 'Name in the url',
      type: 'Type',
      email: 'Email',
      telephone: 'Phone nr',
      createdOn: 'Created on',
      active: 'Active',
      accountingCode: 'Accounting code'
    },
  },
  project: {
    project: 'Project',
    contractCheck: 'Contracts Consultants',
    detailsTitle: 'Project details',
    goToClient: 'Go to client',
    createNew: 'New project',
    newMonth: 'Add month',
    month: 'Month',
    newConsultant: 'New consultant',
    showInactiveProjects: 'Show inactive projects',
    consultant: 'Consultant',
    consultantId: 'Consultant',
    consultantType: 'Type',
    startDate: 'Start date',
    endDate: 'End date',
    forEndCustomer: 'Project is at end customer',
    deleteConfirm: {
      title: 'Delete project',
      content: 'Project will be permanently deleted.',
      toastr: 'Project deleted',
    },
    contract: {
      title: 'Contracts',
      projectTitle: 'Status contract werkopdracht',
      frameworkAgreementTitle: 'Status contract raamcontract',
      thisContract: 'Werkopdracht',
      contracts: 'Contracten',
    },
    partner: {
      clientId: 'Partner',
      tariff: 'Tarif',
      rateType: 'Unit',
      ref: 'Reference',
    },
    client: {
      clientId: 'Client',
      tariff: 'Client tarif',
      rateType: 'Unit',
      ref: 'reference',
      advancedInvoicing: 'Set specific invoicing details',
    },
    endCustomer: {
      clientId: 'End customer',
      contact: 'Contact',
      notes: 'Notes'
    },
    projectMonthConfig: {
      titleConfig: 'Monthly invoicing',
      timesheetCheck: 'Timesheets: Check report',
      inboundInvoice: 'Has inbound invoice',
      changingOrderNr: 'Order nr changes for each invocie'
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
      title: 'Projects: add month',
      selectMonth: 'Select month for which to create the projects',
      noNewRecordsTitle: 'Nothing to add',
      noNewRecordsLabel: 'All active projects are already linked to this month',
      newRecordsTitle: 'Invoicing will be created for the following projects',
    },
    consultant: 'Consultant',
    title: 'Project months',
    listTitle: '{month} {year}',
    filterUnverified: 'Not validated only',
    footer: {
      forecast: 'Forecast excl. tax',
      projecten: '{projects} projects',
      workDays: '{count} workdays in {month}',
    },
    deleteConfirm: {
      title: 'Confirm deletion',
      content: 'Deze record wordt zondermeer hard gedelete. Ik hoop dat je weet wat je aan het doen bent!',
      toastr: 'Project maand record verwijderd',
    },
    props: {
      month: 'Month',
      projectId: 'Project',
      verified: 'Verified',
      orderNr: 'Order nr',
      note: 'Notes',
      timesheet: {
        title: 'Timesheet consultant',
        timesheet: 'Days on signed timesheet',
        check: 'Days on check report',
        note: 'Notes',
        validated: 'Validated',
      },
      inbound: {
        title: 'Ontvangen factuur van onderaannemer',
        nr: 'Hun factuur nr',
        dateReceived: 'Hun factuur ontvangen op',
        status: 'Status',
      },
    },
    list: {
      openList: 'Show',
      closeList: 'Hide',
      verifiedBadge: '{verified} / {total} invoices verified',
      allVerifiedBadge: 'All invoices paid',
      timesheetPending: '{timesheetPendingCount} Pending',
      timesheetOk: 'OK!',
      inboundAllPaid: 'All paid',
    },
    statusTrue: 'Validated: Timesheet, inbound invoice and outbound invoice has been validated',
    statusFalse: 'Not validated: Something is not quite in order!',
    linkLabel: 'Go to details',
    timesheetdaily: 'Days',
    timesheethourly: 'Hours ',
    timesheetCheck: 'Check',
    timesheetCheckDownloadTooltip: 'View check timesheet',
    timesheetNote: 'Notes Timesheet {name}',
    timesheetUpload: 'Upload timesheet',
    timesheetExpiration: 'Expires in {daysLeft}',
    inboundInvoiceNr: 'Nr',
    inboundDateReceived: 'Received on',
    inboundUpload: 'Upload inbound invoice',
    inboundNew: 'New: Invoice not yet processed',
    inboundPaid: 'Paid: Invoice has been paid',
    outboundPaid: 'Not yet verified invoices',
    timesheetValidated: 'Not yet verified timesheets',
    inboundValidated: 'Validated: timesheet and amount have been checked',
    outboundCreateInvoice: 'Create invoice',
    outboundCreateInvoiceTitle: 'Total excl: {totalWithoutTax}. Total incl: {total}',
    note: 'Invoicing Stories',
    addNote: 'Add comment',
    forceVerified: 'Force handled without creating an invoice',
    validateTimesheet: 'Validate timesheet',
    validateTimesheetDisabled: 'Timesheet kan pas gevalideerd worden als de twee getallen overeenkomen (consultants),<br>er een getal ingevuld is (externen) of er een commentaar is toegevoegd',
    unvalidateTimesheet: 'Invalidate timesheet',
    viewTimesheet: 'View timesheet: {fileName}',
    viewInboundInvoice: 'View inbound invoice: {fileName}',
    linkToDetails: 'Go to project',
    sdWorxTimesheetUpload: 'Upload timesheet check report',
    selectLabel: 'Project month',
    markup: 'Margin',
  },
  controls: {
    // browser
    popupBlockerTitle: 'Mislukt!? Popup blocker misschien?',
    popupBlocker: 'Schakel de popupblocker voor deze pagina uit. Pdf preview is anders niet beschikbaar.',

    // TODO: datepicker has some dutch labels in /controls/DatePicker.js
    today: 'Today',

    // select
    noResultsText: 'No results',
    noOptionsMessage: 'No options',
    addFilterText: 'Add filter "{value}"?',
    addLabelText: 'Add "{value}"?',
    selectPlaceholder: 'Choose',

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
    loginError: 'Failed to login',
    users: 'Users',
    createNew: 'New user',
    props: {
      email: 'Email',
      name: 'Name',
      firstName: 'First name',
      alias: 'Alias',
      roles: 'Roles',
      active: 'Active',
    },
  },
  role: {
    createNew: 'New role',
    listTitle: 'Roles',
    props: {
      name: 'Name',
      claims: 'Claims',
    },
  },
  comment: {
    user: 'User',
    text: 'Comment',
    createdOn: '{date} at {hour}',
    modifiedOn: '✎ {date} at {hour} by {user}',
    addComment: 'Add new Comment',
    noComments: 'Be the first to comment!',
    noResults: 'No comments matches your filter.',
  },
  admin: {
    title: 'Admin Config',
    users: 'Manage users',
  },
  measurements: {
    from: 'Van',
    to: 'Tot',
    projectSection: {
      consultantContracts: {
        title: 'Consultant contracts',
        list: {
          projectsWithoutContract: 'Projecten zonder contract',
          projectsWithoutWorkContract: 'Geen werkcontract',
          projectsWithoutFrameworkAgreements: 'Geen raamcontract',
        },
      }
    },
    clientSection: {
      clientsAndProjectsEvolution: {
        title: 'Klanten- en projectenevolutie',
        list: {
          period: 'Periode',
          clients: 'Klanten',
          clientsWithProjects: 'Klanten met projecten',
        }
      }
    }
    ,
    invoiceSection: {
      dueInvoicesList: {
        title: 'Openstaande facturen',
        list: {
          ok: 'Factuur < {min} dagen open',
          warning: 'Factuur {min} <= x <= {max} dagen open',
          danger: 'Factuur {max} dagen open'
        }
      }
    }
  },
  socketio: {
    entities: {
      clients: 'Client',
      config: 'Configuration',
      consultants: 'Consultant',
      invoices: 'Invoice',
      projects: 'Project',
      projects_month: 'Project month',
      roles: 'Role',
      users: 'User',
    },
    operation: {
      ENTITY_CREATED: '{entityType} has been created by {user}',
      ENTITY_UPDATED: '{entityType} has been updated by {user}',
      ENTITY_DELETED: '{entityType} has been deleted by {user}'
    }
  }
};
