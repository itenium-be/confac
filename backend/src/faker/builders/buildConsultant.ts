import {ConsultantRow} from '../types';

let consultantIndex = 0;

export function buildConsultant(row: ConsultantRow) {
  const index = consultantIndex++;
  const hasAccountingCode = index % 5 !== 0; // 80% have accounting code (skip every 5th)
  const accountingCode = hasAccountingCode ? `AC${String(index + 1).padStart(4, '0')}` : '';

  return {
    slug: row.slug,
    name: row.lastName,
    firstName: row.firstName,
    type: row.type,
    email: `${row.slug}@pongit.be`,
    telephone: row.telephone,
    accountingCode,
    active: true,
    audit: {
      createdOn: new Date().toISOString(),
      createdBy: 'faker',
      modifiedOn: '',
      modifiedBy: '',
    },
  };
}
