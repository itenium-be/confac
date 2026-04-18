// 13 projects — one per consultant. Each row points at real clients/partners/endCustomers
// from partners.ts / clients.ts / endCustomers.ts via slug. buildProject.ts resolves the
// slugs to ObjectIDs at insert time.
import {ProjectRow} from '../types';

export const projects: ProjectRow[] = [
  // Consultants — projectMonthConfig: timesheetCheck=true, inboundInvoice=false
  {
    consultantSlug: 'jan-peeters',
    clientSlug: 'cegeka',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    contractStatus: 'BothSigned',
    endCustomerSlug: 'proximus',
    changingOrderNr: true,
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
    changingOrderNr: true,
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
    proforma: 'inboundWithTax',
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
    proforma: 'outboundWithTax',
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
    proforma: 'inboundWithoutTax',
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
