// 16 projects — one per consultant. Each row points at real clients/partners/endCustomers
// from partners.ts / clients.ts / endCustomers.ts via slug. buildProject.ts resolves the
// slugs to ObjectIDs at insert time.
import {ProjectRow} from '../types';

export const projects: ProjectRow[] = [
  // Managers — projectMonthConfig: timesheetCheck=false, inboundInvoice=true
  {
    consultantSlug: 'lien-van-den-berg',
    clientSlug: 'cegeka',
    startDate: '2024-03-01',
    contractStatus: 'BothSigned',
  },
  {
    consultantSlug: 'bart-claes',
    clientSlug: 'delaware',
    startDate: '2024-06-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'kbc',
  },
  {
    consultantSlug: 'els-hermans',
    clientSlug: 'accenture-be',
    startDate: '2025-01-15',
    contractStatus: 'Sent',
  },

  // Consultants — projectMonthConfig: timesheetCheck=true, inboundInvoice=false
  {
    consultantSlug: 'jan-peeters',
    clientSlug: 'cegeka',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'proximus',
  },
  {
    consultantSlug: 'sofie-janssens',
    clientSlug: 'ae',
    startDate: '2024-09-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'ag-insurance',
  },
  {
    consultantSlug: 'tom-de-vos',
    clientSlug: 'delaware',
    startDate: '2024-04-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'colruyt',
    ref: 'PO-9912',
  },
  {
    consultantSlug: 'anke-maes',
    clientSlug: 'sopra-steria-be',
    startDate: '2025-02-01',
    contractStatus: 'WeSigned',
  },
  {
    consultantSlug: 'koen-willems',
    clientSlug: 'nrb',
    startDate: '2024-11-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'elia',
  },

  // Freelancers — partnerSlug required (defaults same as manager branch)
  {
    consultantSlug: 'lars-wouters',
    clientSlug: 'cegeka',
    partnerSlug: 'devoteam',
    startDate: '2024-02-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'bpost',
  },
  {
    consultantSlug: 'eva-goossens',
    clientSlug: 'delaware',
    partnerSlug: 'axi',
    startDate: '2024-07-15',
    endDate: '2026-07-14',
    contractStatus: 'BothSigned',
  },
  {
    consultantSlug: 'nico-mertens',
    clientSlug: 'cronos',
    partnerSlug: 'euricom',
    startDate: '2025-01-01',
    contractStatus: 'Sent',
    endCustomerSlug: 'argenta',
  },
  {
    consultantSlug: 'saar-dubois',
    clientSlug: 'ctg-belgium',
    partnerSlug: 'ixor',
    startDate: '2024-05-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'fluvius',
  },
  {
    consultantSlug: 'pieter-lemaire',
    clientSlug: 'capgemini-fr',
    partnerSlug: 'codit',
    startDate: '2025-03-01',
    contractStatus: 'BothSigned',
  },

  // externalConsultants
  {
    consultantSlug: 'marc-martin',
    clientSlug: 'accenture-uk',
    partnerSlug: 'in-the-pocket',
    startDate: '2024-10-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'brussels-airport',
  },
  {
    consultantSlug: 'clara-dupont',
    clientSlug: 'sopra-steria-fr',
    partnerSlug: 'flexso',
    startDate: '2025-04-01',
    contractStatus: 'WeSigned',
  },
  {
    consultantSlug: 'simon-ferreira',
    clientSlug: 'thoughtworks-uk',
    partnerSlug: 'avisi-group',
    startDate: '2024-08-01',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'asml-nl',
  },
];
