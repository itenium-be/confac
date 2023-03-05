import { faker } from '@faker-js/faker';
import { Db } from 'mongodb';
import slugify from 'slugify';


// https://fakerjs.dev/api/
faker.seed(new Date().valueOf());

const defaultInvoiceLine = (clientPrice?: number) => ({
  desc: 'Consultancy diensten',
  price: faker.datatype.number({min: 100, max: clientPrice || 300}),
  amount: 0,
  tax: 21,
  type: 'daily',
  sort: 0,
});


const getAudit = () => {
  return {
    createdOn: faker.datatype.datetime({max: new Date().valueOf()}),
    createdBy: faker.name.firstName(),
    modifiedOn: '',
    modifiedBy: ''
  }
};

export function getNewClient() {
  const name = faker.company.name();
  return {
    slug: slugify(name).toLowerCase(),
    active: true,
    name: name,
    address: faker.address.street() + ' ' + faker.datatype.number({max: 2000}),
    city: faker.address.zipCode('####') + ' ' + faker.address.cityName(),
    country: faker.address.country(),
    telephone: faker.phone.number('04## ### ###'),
    btw: faker.phone.number('BE ###.###.###'),
    invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}',
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
      combineAttachments: false
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
  "NoContract",
  "Sent",
  "Verified",
  "WeSigned",
  "TheySigned",
  "BothSigned",
  "NotNeeded",
]

const consultantTypes = ['manager', 'consultant', 'freelancer', 'externalConsultant'];

export const getNewConsultant = () => {
  const firstName = faker.name.firstName();
  const name = faker.name.lastName();
  return {
    name: name,
    firstName: firstName,
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
  })

  const newProjects = Array(config.amount).fill(0).map(() => {
    const client = createClientOrPartner();
    const project = {
      consultantId: faker.helpers.arrayElement(consultantIds),
      startDate: null,
      endDate: null,
      client: client,
      partner: faker.helpers.maybe(() => createClientOrPartner(client.defaultInvoiceLines[0].price), {probability: config.partnerProbability}),
      projectMonthConfig: {
        changingOrderNr: false,
        timesheetCheck: faker.datatype.boolean(),
        inboundInvoice: faker.datatype.boolean(),
      },
      contract: {
        status: faker.helpers.arrayElement(contractStatusses),
        notes: '',
      },
      audit: getAudit()
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
}

export async function insertAdminRole(db: Db) {
  const adminRoles = await db.collection('roles').find({name: {$eq: 'admin'}}).toArray();
  if (adminRoles.length) {
    console.log('Admin role already exists, skipping');
  } else {
    const adminRole = {
      name: 'admin',
      claims: ['view-config', 'manage-config', 'view-users', 'manage-users', 'view-roles', 'manage-roles'],
      audit: {}
    };
    await db.collection('roles').insertOne(adminRole);
    console.log('Admin role inserted');
  }
}


export const getNewProjectMonths = async (db: Db, config: ProjectConfig) => {
  const clients = await db.collection('clients').find().toArray();
  const clientIds = clients.map(x => x._id);

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
  invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}',
  defaultInvoiceLines: [defaultInvoiceLine()],
  attachmentTypes: [],
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {cc: '', bcc: '', subject: '', body: '', attachments: []},
  emailSignature: '',
  emailReminder: '',
  emailReminderCc: '',
  emailReminderBcc: '',
  emailInvoiceOnly: '',
  initialMonthLoad: null,
  language: 'en',
  attachments: [],
  audit: {},
};
