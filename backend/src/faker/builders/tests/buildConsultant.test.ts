import {describe, it, expect} from 'vitest';
import {buildConsultant} from '../buildConsultant';
import {ConsultantRow} from '../../types';

const sampleRow: ConsultantRow = {
  slug: 'jan-peeters',
  firstName: 'Jan',
  lastName: 'Peeters',
  type: 'consultant',
  telephone: '0477 12 34 56',
};

describe('buildConsultant', () => {
  it('routes email to @pongit.be based on slug', () => {
    const c = buildConsultant(sampleRow);
    expect(c.email).toBe('jan-peeters@pongit.be');
  });

  it('preserves the configured type', () => {
    const c = buildConsultant({...sampleRow, type: 'freelancer', partnerSlug: 'foo'});
    expect(c.type).toBe('freelancer');
  });

  it('sets active and audit', () => {
    const c = buildConsultant(sampleRow);
    expect(c.active).toBe(true);
    expect(c.audit.createdBy).toBe('faker');
  });
});
