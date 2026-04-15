import {ConsultantRow} from '../types';

export function buildConsultant(row: ConsultantRow) {
  return {
    slug: row.slug,
    name: row.lastName,
    firstName: row.firstName,
    type: row.type,
    email: `${row.slug}@pongit.be`,
    telephone: row.telephone,
    active: true,
    audit: {
      createdOn: new Date().toISOString(),
      createdBy: 'faker',
      modifiedOn: '',
      modifiedBy: '',
    },
  };
}
