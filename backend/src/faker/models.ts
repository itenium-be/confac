/* eslint-disable no-console */
import {faker} from '@faker-js/faker';
import moment from 'moment';
import {Db} from 'mongodb';
import slugify from 'slugify';


// https://fakerjs.dev/api/
faker.seed(new Date().valueOf());

const getPrice = (maxPrice?: number) => faker.datatype.number({min: 100, max: maxPrice || 300});

const defaultInvoiceLine = (clientPrice?: number) => ({
  desc: 'Consultancy diensten',
  price: getPrice(clientPrice),
  amount: 0,
  tax: 21,
  type: 'daily',
  sort: 0,
});


const getAudit = () => ({
  createdOn: faker.datatype.datetime({max: new Date().valueOf()}),
  createdBy: faker.name.firstName(),
  modifiedOn: '',
  modifiedBy: '',
});

export function getNewClient() {
  const name = faker.company.name();
  return {
    slug: slugify(name).toLowerCase(),
    active: true,
    name,
    street: faker.address.street(),
    streetNr: faker.datatype.number({max: 2000}),
    postalCode: faker.address.zipCode('####'),
    city: faker.address.cityName(),
    country: faker.address.country(),
    telephone: faker.phone.number('04## ### ###'),
    btw: faker.phone.number('BE ###.###.###'),
    invoiceFileName: ' {{formatDate date "YYYY-MM"}} {{zero nr 4}} - {{clientName}}',
    hoursInDay: 8,
    defaultInvoiceLines: [defaultInvoiceLine()],
    attachments: [],
    notes: '',
    contact: faker.name.fullName(),
    contactEmail: faker.internet.email(),
    defaultInvoiceDateStrategy: 'prev-month-last-day',
    defaultChangingOrderNr: false,
    email: {
      to: faker.internet.email(name),
      subject: 'New Invoice',
      body: 'Your invoice attached!',
      attachments: ['pdf', 'Getekende timesheet'],
      combineAttachments: false,
    },
    language: 'en',
    frameworkAgreement: {
      status: faker.helpers.arrayElement(contractStatusses),
      notes: '',
    },
    audit: getAudit(),
  };
}


const contractStatusses = [
  'NoContract',
  'Sent',
  'Verified',
  'WeSigned',
  'TheySigned',
  'BothSigned',
  'NotNeeded',
];

const consultantTypes = ['manager', 'consultant', 'freelancer', 'externalConsultant'];

export const getNewConsultant = () => {
  const firstName = faker.name.firstName();
  const name = faker.name.lastName();
  return {
    name,
    firstName,
    slug: slugify(firstName + '-' + name),
    type: faker.helpers.arrayElement(consultantTypes),
    email: faker.internet.email(),
    telephone: faker.phone.number('04## ### ###'),
    active: true,
    audit: getAudit(),
  };
};





export type ProjectConfig = {
  amount: number;
  endDate?: Date;
  startDate?: Date;
  partnerProbability: number;
  noEndDateProbability: number;
}


export const getNewProjects = async (db: Db, config: ProjectConfig) => {
  const consultants = await db.collection('consultants').find().toArray();
  const consultantIds = consultants.map(x => x._id);

  const clients = await db.collection('clients').find().toArray();
  const clientIds = clients.map(x => x._id);

  const createClientOrPartner = (clientPrice?: number) => ({
    clientId: faker.helpers.arrayElement(clientIds),
    defaultInvoiceLines: [defaultInvoiceLine(clientPrice)],
    advancedInvoicing: false,
    ref: faker.helpers.maybe(() => faker.datatype.string(faker.datatype.number({min: 3, max: 10})), {probability: 0.3}),
  });

  const newProjects = Array(config.amount).fill(0).map(() => {
    const client = createClientOrPartner();
    const project = {
      consultantId: faker.helpers.arrayElement(consultantIds),
      startDate: null,
      endDate: null,
      client,
      partner: faker.helpers.maybe(
        () => createClientOrPartner(client.defaultInvoiceLines[0].price),
        {probability: config.partnerProbability},
      ),
      projectMonthConfig: {
        changingOrderNr: false,
        timesheetCheck: faker.datatype.boolean(),
        inboundInvoice: faker.datatype.boolean(),
      },
      contract: {
        status: faker.helpers.arrayElement(contractStatusses),
        notes: '',
      },
      audit: getAudit(),
    } as any;

    const oneYear = 31556952000;
    if (config.endDate) {
      const fakerMaxDate = config.endDate.valueOf();
      project.startDate = config.startDate || faker.datatype.datetime({min: fakerMaxDate - oneYear, max: fakerMaxDate});
      project.endDate = config.endDate;
    } else if (config.startDate) {
      const fakerMinDate = config.startDate.valueOf();
      project.startDate = config.startDate;
      const endDate = faker.datatype.datetime({min: fakerMinDate, max: fakerMinDate + oneYear});
      project.endDate = faker.helpers.maybe(() => endDate, {probability: 1 - config.noEndDateProbability});
    } else {
      throw new Error('Not implemented');
    }

    return project;
  });

  return newProjects;
};



export const getNewInvoices = async (db: Db, config: any) => {
  const consultants = await db.collection('consultants').find().toArray();
  const projectMonths = await db.collection('projects_month').find().toArray();
  // const projects = await db.collection('projects').find().toArray();
  const clients = await db.collection('clients').find().toArray();

  if (!projectMonths.length) {
    console.log('No projectMonths found! Create some through the UI!');
    return [];
  }

  const newInvoices = Array(config.amount).fill(0).map((_, index) => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const projectMonth = projectMonths[Math.floor(Math.random() * projectMonths.length)];
    const consultant = consultants[Math.floor(Math.random() * consultants.length)];
    const price = getPrice();
    const days = faker.datatype.number({min: 15, max: 22});
    const total = price * days;

    const invoice: any = {
      number: index + 1, // TODO: need to watch out for doubles here
      projectMonth: {
        projectMonthId: projectMonth._id,
        month: projectMonth.month,
        consultantId: consultant._id,
        consultantName: consultant.firstName,
      },
      client: {
        _id: client._id,
        slug: client.slug,
        active: true,
        name: client.name,
        street: client.street,
        streetNr: client.streetNr,
        city: client.city,
        country: client.country,
        telephone: client.telephone,
        btw: client.btw,
        invoiceFileName: client.invoiceFileName,
        hoursInDay: client.hoursInDay,
        defaultInvoiceLines: [{
          desc: 'Consultancy diensten',
          price,
          amount: 0,
          tax: 21,
          type: 'daily',
          sort: 0,
        }],
        attachments: [],
        defaultInvoiceDateStrategy: 'prev-month-last-day',
        defaultChangingOrderNr: false,
        email: {
          to: 'AnkundingandSons_Rolfson@yahoo.com',
          subject: 'New Invoice',
          body: 'Your invoice attached!',
          attachments: [
            'pdf',
            'Getekende timesheet',
          ],
          combineAttachments: false,
        },
        language: 'en',
        frameworkAgreement: {
          status: 'NoContract',
          notes: '',
        },
        audit: {
          createdOn: '2007-1228::44.695Z',
          createdBy: 'Isobel',
        },
        contact: '',
        contactEmail: '',
      },
      your: {
        name: 'itenium',
        address: '',
        city: '',
        btw: '',
        rpr: '',
        bank: '',
        iban: '',
        bic: '',
        telephone: '',
        email: '',
        website: 'https://itenium.be',
        template: 'example-1.pug',
        templateQuotation: 'example-1.pug',
      },
      date: faker.datatype.datetime({min: new Date('2018').valueOf(), max: new Date().valueOf()}).toISOString(),
      orderNr: faker.helpers.maybe(() => faker.datatype.string(faker.datatype.number({min: 3, max: 7})), {probability: 0.35}),
      verified: faker.datatype.boolean(),
      attachments: [{type: 'pdf'}],
      isQuotation: false,
      lines: [{
        desc: 'Consultancy diensten',
        price,
        amount: days,
        tax: 21,
        type: 'daily',
        sort: 0,
      }],
      money: {
        totalWithoutTax: 0,
        totalTax: 0,
        discount: 0,
        total,
        totals: {daily: total},
      },
      note: '',
      audit: {
        createdOn: '2023-03-05T22:25:57.860Z',
        createdBy: 'Bearer PerfUser',
      },
      lastEmail: faker.helpers.maybe(() => faker.datatype.datetime(), {probability: 0.7}),
    };

    return invoice;
  });

  return newInvoices;
};




export async function insertAdminRole(db: Db) {
  const adminRoles = await db.collection('roles').find({name: {$eq: 'admin'}}).toArray();
  if (adminRoles.length) {
    console.log('Admin role already exists, skipping');
  } else {
    const adminRole = {
      name: 'admin',
      claims: ['view-config', 'manage-config', 'view-users', 'manage-users', 'view-roles', 'manage-roles'],
      audit: {},
    };
    await db.collection('roles').insertOne(adminRole);
    console.log('Admin role inserted');
  }
}


export const getNewProjectMonths = async (db: Db, config: ProjectConfig) => {
  const clients = await db.collection('clients').find().toArray();
  const clientIds = clients.map(x => x._id);

  console.log('insert new ProjectMonths -- Oopsie, not implemented!!');

  // TODO: insert projectMonths here...

  return [];
};


// {
//   "_id" : ObjectId("5ec168842bd8cc7fa5f5fcf5"),
//   "month" : "2020-04-01T00:00:00.000Z",
//   "projectId" : "5ea495efc54b41241081ca03",
//   "verified" : true,
//   "inbound" : {
//       "nr" : "20200004",
//       "status" : "paid",
//       "dateReceived" : "2020-05-17T16:53:13.706Z"
//   },
//   "timesheet" : {
//       "validated" : true,
//       "timesheet" : 12
//   },
//   "attachments" : [],
//   "note" : "",
//   "orderNr" : "",
//   "audit" : {
//       "createdOn" : "2020-05-17T16:38:28.230Z",
//       "modifiedOn" : "2020-07-04T13:33:00.226Z",
//       "modifiedBy" : "5ed0f53cf06c3bd4675078d6"
//   }
// }




export const defaultConfig = {
  key: 'conf',
  company: {
    name: '',
    address: '',
    city: '',
    btw: '',
    rpr: '',
    bank: '',
    iban: '',
    bic: '',
    telephone: '',
    email: '',
    website: '',
    template: 'example-1.pug',
    templateQuotation: 'example-1.pug',
  },
  defaultClient: null,
  invoiceFileName: ' {{formatDate date "YYYY-MM"}} {{zero nr 4}} - {{clientName}}',
  defaultInvoiceLines: [defaultInvoiceLine()],
  attachmentTypes: [],
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {
    cc: '', bcc: '', subject: '', body: '', attachments: [],
  },
  emailSignature: '',
  emailReminder: '',
  emailReminderCc: '',
  emailReminderBcc: '',
  emailInvoiceOnly: '',
  initialMonthLoad: 12,
  peppolPivotDate: moment.utc('2026-01-01'),
  language: 'en',
  attachments: [],
  audit: {},
};
