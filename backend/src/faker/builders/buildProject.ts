import {ObjectID} from 'mongodb';
import {BuildProjectMaps, ProjectRow} from '../types';
import {getDefaultProjectMonthConfig} from '../projectMonthConfigDefaults';

function resolve(map: Map<string, ObjectID>, slug: string): ObjectID {
  const id = map.get(slug);
  if (!id) throw new Error(`unresolved slug: ${slug}`);
  return id;
}

function invoiceLine(price: number) {
  return [{
    desc: 'Consultancy diensten',
    price,
    amount: 0,
    tax: 21,
    type: 'daily',
    sort: 0,
  }];
}

export function buildProject(row: ProjectRow, maps: BuildProjectMaps) {
  const consultantId = resolve(maps.consultantIds, row.consultantSlug);
  const clientId = resolve(maps.clientIds, row.clientSlug);
  const consultantType = maps.consultantTypes.get(row.consultantSlug)!;

  const requiresPartner = consultantType === 'freelancer' || consultantType === 'externalConsultant';
  if (requiresPartner && !row.partnerSlug) {
    throw new Error(`${consultantType} ${row.consultantSlug} requires partnerSlug`);
  }

  const clientPrice = row.clientPrice ?? 550;
  const partnerPrice = row.partnerPrice ?? 480;

  const partner = row.partnerSlug
    ? {
      clientId: resolve(maps.clientIds, row.partnerSlug),
      ref: undefined,
      defaultInvoiceLines: invoiceLine(partnerPrice),
      advancedInvoicing: false,
    }
    : undefined;

  const endCustomer = row.endCustomerSlug
    ? {clientId: resolve(maps.clientIds, row.endCustomerSlug), contact: '', notes: ''}
    : null;

  return {
    consultantId,
    accountManager: '',
    startDate: row.startDate,
    endDate: row.endDate ?? null,
    client: {
      clientId,
      ref: row.ref,
      defaultInvoiceLines: invoiceLine(clientPrice),
      advancedInvoicing: row.advancedInvoicing ?? false,
    },
    partner,
    projectMonthConfig: {
      ...getDefaultProjectMonthConfig(consultantType),
      changingOrderNr: false,
      emailInvoiceDuplicate: false,
      proforma: 'no',
    },
    notes: '',
    comments: [],
    contract: {status: row.contractStatus, notes: ''},
    forEndCustomer: !!endCustomer,
    endCustomer,
    audit: {
      createdOn: new Date().toISOString(),
      createdBy: 'faker',
      modifiedOn: '',
      modifiedBy: '',
    },
  };
}
