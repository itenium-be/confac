import {describe, it, expect} from 'vitest';
import {ObjectID} from 'mongodb';
import {buildProject} from '../buildProject';
import {BuildProjectMaps, ProjectRow} from '../../types';

function makeMaps(): BuildProjectMaps {
  return {
    clientIds: new Map([
      ['cegeka', new ObjectID()],
      ['axi', new ObjectID()],
      ['kbc', new ObjectID()],
    ]),
    consultantIds: new Map([
      ['alice-mgr', new ObjectID()],
      ['bob-cons', new ObjectID()],
      ['carol-freelance', new ObjectID()],
    ]),
    consultantTypes: new Map([
      ['alice-mgr', 'manager'],
      ['bob-cons', 'consultant'],
      ['carol-freelance', 'freelancer'],
    ]),
  };
}

const baseRow: ProjectRow = {
  consultantSlug: 'bob-cons',
  clientSlug: 'cegeka',
  startDate: '2025-01-01',
  contractStatus: 'BothSigned',
};

describe('buildProject', () => {
  it('consultant type -> projectMonthConfig (consultant branch)', () => {
    const p = buildProject(baseRow, makeMaps());
    expect(p.projectMonthConfig.timesheetCheck).toBe(true);
    expect(p.projectMonthConfig.inboundInvoice).toBe(false);
    expect(p.projectMonthConfig.changingOrderNr).toBe(false);
    expect(p.projectMonthConfig.emailInvoiceDuplicate).toBe(false);
    expect(p.projectMonthConfig.proforma).toBe('no');
  });

  it('consultant type -> projectMonthConfig (manager branch)', () => {
    const p = buildProject({...baseRow, consultantSlug: 'alice-mgr'}, makeMaps());
    expect(p.projectMonthConfig.timesheetCheck).toBe(false);
    expect(p.projectMonthConfig.inboundInvoice).toBe(true);
  });

  it('freelancer without partnerSlug throws', () => {
    expect(() => buildProject({...baseRow, consultantSlug: 'carol-freelance'}, makeMaps())).toThrow(/freelancer.*requires partnerSlug/i);
  });

  it('freelancer with partnerSlug populates partner block', () => {
    const p = buildProject(
      {...baseRow, consultantSlug: 'carol-freelance', partnerSlug: 'axi'},
      makeMaps(),
    );
    expect(p.partner).toBeTruthy();
    expect(p.partner?.defaultInvoiceLines[0].price).toBe(480);
  });

  it('endCustomerSlug sets forEndCustomer and endCustomer block', () => {
    const p = buildProject({...baseRow, endCustomerSlug: 'kbc'}, makeMaps());
    expect(p.forEndCustomer).toBe(true);
    expect(p.endCustomer).toBeTruthy();
  });

  it('no endCustomerSlug leaves forEndCustomer false', () => {
    const p = buildProject(baseRow, makeMaps());
    expect(p.forEndCustomer).toBe(false);
    expect(p.endCustomer).toBeNull();
  });

  it('unresolved clientSlug throws', () => {
    expect(() => buildProject({...baseRow, clientSlug: 'nope'}, makeMaps())).toThrow(/unresolved slug: nope/);
  });

  it('unresolved consultantSlug throws', () => {
    expect(() => buildProject({...baseRow, consultantSlug: 'nope'}, makeMaps())).toThrow(/unresolved slug: nope/);
  });

  it('uses custom clientPrice and partnerPrice when provided', () => {
    const p = buildProject(
      {
        ...baseRow,
        consultantSlug: 'carol-freelance',
        partnerSlug: 'axi',
        clientPrice: 600,
        partnerPrice: 500,
      },
      makeMaps(),
    );
    expect(p.client.defaultInvoiceLines[0].price).toBe(600);
    expect(p.partner?.defaultInvoiceLines[0].price).toBe(500);
  });
});
