# Curated Faker Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the random `backend/src/faker/` generator with a curated fixture of one `itenium TEST` config, 36 real companies (partners/clients/endCustomers), 16 consultants, and 16 projects wired together via consultant-type-aware defaults.

**Architecture:** Two-layer split under `backend/src/faker/`: pure `data/` files containing real-world rows, and `builders/` functions that turn each row into a full Mongo doc. `insertStuff.ts` guards against existing data, then inserts config → clients → consultants → projects in order, resolving cross-references by slug. All emails are rerouted to `@pongit.be`.

**Tech Stack:** TypeScript, Bun, vitest 3, mongodb driver v3, slugify, frontend→backend function copy (no shared package).

**Spec:** `docs/superpowers/specs/2026-04-15-faker-curated-data-design.md`

---

## File structure

New files:
- `backend/src/faker/types.ts` — shared row types (`ClientRow`, `ConsultantRow`, `ProjectRow`) + slug maps
- `backend/src/faker/projectMonthConfigDefaults.ts` — copy of frontend `getDefaultProjectMonthConfig`
- `backend/src/faker/builders/buildConfig.ts`
- `backend/src/faker/builders/buildClient.ts`
- `backend/src/faker/builders/buildConsultant.ts`
- `backend/src/faker/builders/buildProject.ts`
- `backend/src/faker/builders/tests/buildClient.test.ts`
- `backend/src/faker/builders/tests/buildConsultant.test.ts`
- `backend/src/faker/builders/tests/buildProject.test.ts`
- `backend/src/faker/data/config.ts`
- `backend/src/faker/data/partners.ts`
- `backend/src/faker/data/clients.ts`
- `backend/src/faker/data/endCustomers.ts`
- `backend/src/faker/data/consultants.ts`
- `backend/src/faker/data/projects.ts`

Rewritten:
- `backend/src/faker/insertStuff.ts`

Deleted:
- `backend/src/faker/models.ts`
- `backend/src/faker/faker-config.ts`

Unchanged:
- `backend/src/faker/index.ts`

---

## Task 1: Scaffold — types + projectMonthConfigDefaults

**Files:**
- Create: `backend/src/faker/types.ts`
- Create: `backend/src/faker/projectMonthConfigDefaults.ts`

- [ ] **Step 1: Create `types.ts` with row definitions**

```ts
// backend/src/faker/types.ts
import {ObjectID} from 'mongodb';

export type Country = 'BE' | 'NL' | 'FR' | 'UK';
export type Language = 'nl' | 'fr' | 'en';
export type ClientTypeTag = 'partner' | 'client' | 'endCustomer';
export type ConsultantType = 'manager' | 'consultant' | 'freelancer' | 'externalConsultant';
export type ContractStatus = 'NoContract' | 'Sent' | 'Verified' | 'WeSigned' | 'TheySigned' | 'BothSigned' | 'NotNeeded';

export type ClientRow = {
  slug: string;
  name: string;
  btw: string;
  street: string;
  streetNr: string;
  streetBox?: string;
  postalCode: string;
  city: string;
  country: Country;
  language: Language;
  contact: string;
  telephone: string;
  peppolEnabled?: boolean;
  frameworkAgreementStatus?: ContractStatus;
};

export type ConsultantRow = {
  slug: string;
  firstName: string;
  lastName: string;
  type: ConsultantType;
  telephone: string;
  partnerSlug?: string;
};

export type ProjectRow = {
  consultantSlug: string;
  clientSlug: string;
  partnerSlug?: string;
  endCustomerSlug?: string;
  startDate: string;
  endDate?: string;
  ref?: string;
  contractStatus: ContractStatus;
  advancedInvoicing?: boolean;
  clientPrice?: number;
  partnerPrice?: number;
};

/** slug -> inserted Mongo _id, used by buildProject */
export type SlugIdMap = Map<string, ObjectID>;

export type BuildProjectMaps = {
  clientIds: SlugIdMap;
  consultantIds: SlugIdMap;
  consultantTypes: Map<string, ConsultantType>;
};
```

- [ ] **Step 2: Copy `getDefaultProjectMonthConfig` from frontend**

Source: `frontend/src/components/project/models/ProjectMonthModel.ts` lines 82-110.

```ts
// backend/src/faker/projectMonthConfigDefaults.ts
// Copy of frontend/src/components/project/models/ProjectMonthModel.ts::getDefaultProjectMonthConfig.
// The frontend version is canonical — keep in sync if that branching changes.
import {ConsultantType} from './types';

export function getDefaultProjectMonthConfig(consultantType: ConsultantType): {
  timesheetCheck: boolean;
  inboundInvoice: boolean;
} {
  switch (consultantType) {
    case 'manager':
    case 'externalConsultant':
    case 'freelancer':
      return {timesheetCheck: false, inboundInvoice: true};
    case 'consultant':
      return {timesheetCheck: true, inboundInvoice: false};
    default:
      return {timesheetCheck: true, inboundInvoice: true};
  }
}
```

- [ ] **Step 3: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: PASS (new files don't reference anything yet).

- [ ] **Step 4: Commit**

```bash
git add backend/src/faker/types.ts backend/src/faker/projectMonthConfigDefaults.ts
git commit backend/src/faker/types.ts backend/src/faker/projectMonthConfigDefaults.ts -m "faker: row types + projectMonthConfig defaults"
```

Note: use pathspec — never `git commit -a` in this repo (see MEMORY.md).

---

## Task 2: buildClient (TDD)

**Files:**
- Create: `backend/src/faker/builders/buildClient.ts`
- Create: `backend/src/faker/builders/tests/buildClient.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// backend/src/faker/builders/tests/buildClient.test.ts
import {describe, it, expect} from 'vitest';
import {buildClient} from '../buildClient';
import {ClientRow} from '../../types';

const sampleRow: ClientRow = {
  slug: 'test-bv',
  name: 'Test BV',
  btw: 'BE 0123.456.789',
  street: 'Teststraat',
  streetNr: '1',
  postalCode: '1000',
  city: 'Brussel',
  country: 'BE',
  language: 'nl',
  contact: 'Jan Peeters',
  telephone: '02 123 45 67',
};

describe('buildClient', () => {
  it('routes email.to to @pongit.be based on slug', () => {
    const client = buildClient(sampleRow, 'client');
    expect(client.email.to).toBe('test-bv@pongit.be');
  });

  it('tags client with the given type', () => {
    const partner = buildClient(sampleRow, 'partner');
    const endCustomer = buildClient(sampleRow, 'endCustomer');
    expect(partner.types).toEqual(['partner']);
    expect(endCustomer.types).toEqual(['endCustomer']);
  });

  it('uses per-type default invoice line price', () => {
    const client = buildClient(sampleRow, 'client');
    const partner = buildClient(sampleRow, 'partner');
    const endCustomer = buildClient(sampleRow, 'endCustomer');
    expect(client.defaultInvoiceLines[0].price).toBe(550);
    expect(partner.defaultInvoiceLines[0].price).toBe(480);
    expect(endCustomer.defaultInvoiceLines[0].price).toBe(0);
  });

  it('enables peppol for BE entries by default', () => {
    const be = buildClient({...sampleRow, country: 'BE'}, 'client');
    const fr = buildClient({...sampleRow, country: 'FR'}, 'client');
    expect(be.peppolEnabled).toBe(true);
    expect(fr.peppolEnabled).toBe(false);
  });

  it('honours explicit peppolEnabled override', () => {
    const c = buildClient({...sampleRow, country: 'BE', peppolEnabled: false}, 'client');
    expect(c.peppolEnabled).toBe(false);
  });

  it('stamps audit with createdBy faker', () => {
    const c = buildClient(sampleRow, 'client');
    expect(c.audit.createdBy).toBe('faker');
    expect(c.audit.createdOn).toBeTruthy();
  });

  it('defaults frameworkAgreement status to BothSigned', () => {
    const c = buildClient(sampleRow, 'client');
    expect(c.frameworkAgreement.status).toBe('BothSigned');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildClient.test.ts`
Expected: FAIL — `Cannot find module '../buildClient'`.

- [ ] **Step 3: Implement `buildClient`**

```ts
// backend/src/faker/builders/buildClient.ts
import {ClientRow, ClientTypeTag} from '../types';

type BuiltClient = {
  slug: string;
  active: boolean;
  name: string;
  types: ClientTypeTag[];
  street: string;
  streetNr: string;
  streetBox: string;
  postalCode: string;
  city: string;
  country: string;
  language: string;
  telephone: string;
  btw: string;
  contact: string;
  hoursInDay: number;
  invoiceFileName: string;
  defaultInvoiceLines: Array<{
    desc: string;
    price: number;
    amount: number;
    tax: number;
    type: string;
    sort: number;
  }>;
  attachments: unknown[];
  notes: string;
  comments: unknown[];
  defaultInvoiceDateStrategy: string;
  defaultChangingOrderNr: boolean;
  email: {
    to: string;
    subject: string;
    body: string;
    attachments: Array<{type: string; fileName: string; fileType: string}>;
    combineAttachments: boolean;
  };
  frameworkAgreement: {status: string; notes: string};
  peppolEnabled: boolean;
  audit: {createdOn: string; createdBy: string; modifiedOn: string; modifiedBy: string};
};

const priceByType: Record<ClientTypeTag, number> = {
  client: 550,
  partner: 480,
  endCustomer: 0,
};

export function buildClient(row: ClientRow, type: ClientTypeTag): BuiltClient {
  return {
    slug: row.slug,
    active: true,
    name: row.name,
    types: [type],
    street: row.street,
    streetNr: row.streetNr,
    streetBox: row.streetBox ?? '',
    postalCode: row.postalCode,
    city: row.city,
    country: row.country,
    language: row.language,
    telephone: row.telephone,
    btw: row.btw,
    contact: row.contact,
    hoursInDay: 8,
    invoiceFileName: ' {{formatDate date "YYYY-MM"}} {{zero nr 4}} - {{clientName}}',
    defaultInvoiceLines: [{
      desc: 'Consultancy diensten',
      price: priceByType[type],
      amount: 0,
      tax: 21,
      type: 'daily',
      sort: 0,
    }],
    attachments: [],
    notes: '',
    comments: [],
    defaultInvoiceDateStrategy: 'prev-month-last-day',
    defaultChangingOrderNr: false,
    email: {
      to: `${row.slug}@pongit.be`,
      subject: 'New invoice {{nr}}',
      body: '<p>Dear,</p><p>Please find the invoice attached.</p>',
      attachments: [
        {type: 'pdf', fileName: 'invoice.pdf', fileType: 'application/pdf'},
        {type: 'Getekende timesheet', fileName: 'timesheet.pdf', fileType: 'application/pdf'},
      ],
      combineAttachments: false,
    },
    frameworkAgreement: {
      status: row.frameworkAgreementStatus ?? 'BothSigned',
      notes: '',
    },
    peppolEnabled: row.peppolEnabled ?? (row.country === 'BE'),
    audit: {
      createdOn: new Date().toISOString(),
      createdBy: 'faker',
      modifiedOn: '',
      modifiedBy: '',
    },
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildClient.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/faker/builders/buildClient.ts backend/src/faker/builders/tests/buildClient.test.ts
git commit backend/src/faker/builders/buildClient.ts backend/src/faker/builders/tests/buildClient.test.ts -m "faker: buildClient with per-type defaults and pongit email rerouting"
```

---

## Task 3: buildConsultant (TDD)

**Files:**
- Create: `backend/src/faker/builders/buildConsultant.ts`
- Create: `backend/src/faker/builders/tests/buildConsultant.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// backend/src/faker/builders/tests/buildConsultant.test.ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildConsultant.test.ts`
Expected: FAIL — missing module.

- [ ] **Step 3: Implement `buildConsultant`**

```ts
// backend/src/faker/builders/buildConsultant.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildConsultant.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/faker/builders/buildConsultant.ts backend/src/faker/builders/tests/buildConsultant.test.ts
git commit backend/src/faker/builders/buildConsultant.ts backend/src/faker/builders/tests/buildConsultant.test.ts -m "faker: buildConsultant with pongit email"
```

---

## Task 4: buildProject (TDD)

**Files:**
- Create: `backend/src/faker/builders/buildProject.ts`
- Create: `backend/src/faker/builders/tests/buildProject.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// backend/src/faker/builders/tests/buildProject.test.ts
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
    expect(() =>
      buildProject({...baseRow, consultantSlug: 'carol-freelance'}, makeMaps()),
    ).toThrow(/freelancer.*requires partnerSlug/i);
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
    expect(() =>
      buildProject({...baseRow, clientSlug: 'nope'}, makeMaps()),
    ).toThrow(/unresolved slug: nope/);
  });

  it('unresolved consultantSlug throws', () => {
    expect(() =>
      buildProject({...baseRow, consultantSlug: 'nope'}, makeMaps()),
    ).toThrow(/unresolved slug: nope/);
  });

  it('uses custom clientPrice and partnerPrice when provided', () => {
    const p = buildProject(
      {...baseRow, consultantSlug: 'carol-freelance', partnerSlug: 'axi', clientPrice: 600, partnerPrice: 500},
      makeMaps(),
    );
    expect(p.client.defaultInvoiceLines[0].price).toBe(600);
    expect(p.partner?.defaultInvoiceLines[0].price).toBe(500);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildProject.test.ts`
Expected: FAIL — missing module.

- [ ] **Step 3: Implement `buildProject`**

```ts
// backend/src/faker/builders/buildProject.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && bun run vitest run src/faker/builders/tests/buildProject.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/faker/builders/buildProject.ts backend/src/faker/builders/tests/buildProject.test.ts
git commit backend/src/faker/builders/buildProject.ts backend/src/faker/builders/tests/buildProject.test.ts -m "faker: buildProject with consultant-type defaults and slug resolution"
```

---

## Task 5: buildConfig + data/config.ts

**Files:**
- Create: `backend/src/faker/builders/buildConfig.ts`
- Create: `backend/src/faker/data/config.ts`

No unit test — this is a constant with a simple transform. Verification happens in the end-to-end run (Task 11).

- [ ] **Step 1: Create `data/config.ts`**

Base on the prod dump the user provided. Apply the overrides from the spec. IMPORTANT: the prod dump uses `" KREDBEBB"` with a leading space — strip it.

```ts
// backend/src/faker/data/config.ts
// Real itenium config with test overrides:
// - name: "itenium BV" -> "itenium TEST"
// - all real emails replaced with itenium@pongit.be
// - exactonline inbox replaced
// - bic whitespace stripped
// defaultClient is set after clients are inserted (see insertStuff.ts).

export const ITENIUM_TEST_CONFIG = {
  key: 'conf',
  company: {
    template: 'itenium.pug',
    name: 'itenium TEST',
    address: 'Pilatusveld 7',
    city: 'Londerzeel',
    btw: 'BE0687800967',
    bank: 'KBC',
    iban: 'BE84 7370 4817 1859',
    bic: 'KREDBEBB',
    telephone: '0477 54 89 57',
    email: 'itenium@pongit.be',
    website: 'https://itenium.be',
    templateQuotation: 'itenium-signable.pug',
    rpr: 'Brussel',
    postalCode: '1840',
  },
  defaultClient: null as string | null,
  template: 'itenium.pug',
  templateQuotation: 'itenium - offerte.pug',
  invoiceFileName: 'Factuur {{zero nr 4}} - {{formatDate date "YYYY-MM-DD"}} - {{clientName}}',
  attachmentTypes: ['Getekende timesheet', 'Factuur freelancer'],
  defaultExtraClientFields: [],
  defaultExtraClientInvoiceFields: [],
  defaultExtraInvoiceFields: [],
  showOrderNr: true,
  groupInvoiceListByMonth: false,
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {
    to: '',
    cc: '',
    bcc: 'itenium@pongit.be',
    subject: 'Factuur {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',
    body: '<p>Dear,</p>\n<p>Please find invoice {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} and signed timesheet in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>\n',
    attachments: ['Getekende timesheet', 'pdf'],
    from: 'itenium@pongit.be',
  },
  emailSignature: '<p><br>Best regards,<br><br><span style="color: rgb(231,130,0);font-size: 13px;font-family: monospace;">Team Finance</span><br><a href="mailto:itenium@pongit.be" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">itenium@pongit.be</span></a><br><a href="tel:+32476403502" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">+32 15 79 46 89</span></a><br><a href="https://itenium.be" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">www.itenium.be</span></a>&nbsp;</p>\n<div style="text-align:left;"><img src="https://raw.githubusercontent.com/itenium-be/marketing/refs/heads/master/email-signature/itenium-logo-cropped.png" alt="itenium" style="height: auto;width: 100px"/></div>\n',
  emailReminder: '<p>Dear,<br><br>According to our records, invoice {{nr}} from {{formatDate projectMonth "MMMM YYYY"}} has not yet been paid<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}{{/if}}</p>\n',
  extraConfigFields: [],
  emailAttachments: ['Getekende timesheet'],
  defaultInvoiceLines: [{desc: 'Consultancy diensten', amount: 0, type: 'daily', price: 0, tax: 21, sort: 0}],
  emailReminderBcc: 'itenium@pongit.be',
  emailReminderCc: '',
  language: 'en',
  attachments: [],
  emailInvoiceOnly: 'itenium@pongit.be',
  initialMonthLoad: 18,
  emailCreditNotaBody: '<p>Dear,</p>\n<p>Please find credit note {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>',
  emailCreditNotaSubject: 'Credit Note {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',
  emailPeppolDuplicateBody: '<p style="text-align:start;"><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Lato, serif;">Dear,</span></p>\n<p style="text-align:start;"><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Lato, serif;">Please find invoice {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} and signed timesheet in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</span> <br><br>This is a duplicate. The invoice has been sent to Peppol.</p>\n',
  emailPeppolDuplicateSubject: 'Factuur {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}} (duplicaat)',
  peppolPivotDate: '2026-01-01T00:00:00.000Z',
  audit: {
    createdOn: new Date().toISOString(),
    createdBy: 'faker',
    modifiedOn: '',
    modifiedBy: '',
  },
};

/** Slug of the client to set as config.defaultClient after insertion. */
export const DEFAULT_CLIENT_SLUG = 'cegeka';
```

- [ ] **Step 2: Create `buildConfig.ts` (thin passthrough)**

```ts
// backend/src/faker/builders/buildConfig.ts
import {ITENIUM_TEST_CONFIG} from '../data/config';

/** The config is already fully shaped in data/config.ts; this is a seam for future transforms. */
export function buildConfig() {
  return {...ITENIUM_TEST_CONFIG};
}
```

- [ ] **Step 3: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add backend/src/faker/builders/buildConfig.ts backend/src/faker/data/config.ts
git commit backend/src/faker/builders/buildConfig.ts backend/src/faker/data/config.ts -m "faker: itenium TEST config with rerouted emails"
```

---

## Task 6: data/partners.ts (10 onderaannemers)

Look up each candidate on KBO (`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html`) via WebFetch, record the VAT, address, postal code. Replace any deregistered candidate with another real small BE IT shop.

Candidates (from spec): `ordina-belgium`, `axi`, `euricom`, `ixor`, `aleri-solutions`, `in-the-pocket`, `bagaar`, `kunstmaan`, `ibidem`, `ordina-nederland` (NL).

- [ ] **Step 1: Verify each BE VAT via KBO**

For each BE candidate, WebFetch `https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=<number>` or the search form. Capture: official name, street + number, postal code, city. Note: KBO may display `0xxx.xxx.xxx` — reformat to `BE 0xxx.xxx.xxx` for the row. Record results in a scratch comment block inside the file.

Expected result: 9 verified BE rows. If any company is inactive or merged, swap for another small BE IT consultancy (sourcing: https://www.google.com/search?q=belgian+IT+consultancy+small or KBO browse-by-NACE 62020). Do NOT proceed with unverified VATs.

- [ ] **Step 2: Fetch Ordina Nederland legal footer for NL VAT**

WebFetch `https://www.ordina.nl/contact/` (or the `/disclaimer` / `/algemene-voorwaarden` page) and extract VAT (`NL...B01` format) + address.

- [ ] **Step 3: Write `data/partners.ts`**

```ts
// backend/src/faker/data/partners.ts
import {ClientRow} from '../types';

export const partners: ClientRow[] = [
  {
    slug: 'ordina-belgium',
    name: '<verified name>',
    btw: 'BE 0xxx.xxx.xxx',
    street: '<verified>',
    streetNr: '<verified>',
    postalCode: '<verified>',
    city: '<verified>',
    country: 'BE',
    language: 'nl',
    contact: 'Jeroen De Smet',
    telephone: '<plausible>',
  },
  // ...9 more, same shape
];
```

Use plausible fictional BE contact names (Jeroen De Smet, Sofie Willems, Bart Claes, Lieve Janssens, Pieter Maes, Koen Peeters, An Mertens, Filip Goossens, Els Hermans). Telephones in `+32 ...` format.

Two slugs are intentionally unreferenced downstream (`ibidem`, `kunstmaan`) — keep them in this file.

Language: `nl` for all Flemish-area BE, `fr` for any Wallonia-area entry, `nl` for the NL entry.

- [ ] **Step 4: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: PASS (exports an array of the declared type).

- [ ] **Step 5: Commit**

```bash
git add backend/src/faker/data/partners.ts
git commit backend/src/faker/data/partners.ts -m "faker: 10 onderaannemer rows with KBO-verified VATs"
```

---

## Task 7: data/clients.ts (16 IT consultancy clients)

Same pattern as Task 6 but for the larger consultancies.

Candidates (from spec): `cegeka`, `delaware`, `ae`, `sopra-steria-be`, `accenture-be`, `nexios`, `nrb`, `cronos`, `ctg-belgium`, `smals`, `ibm-belgium`, `atos-belux`, `capgemini-fr`, `sopra-steria-fr`, `accenture-uk`, `thoughtworks-uk`.

- [ ] **Step 1: Verify BE VATs via KBO**

For the 12 BE entries, WebFetch KBO per the Task 6 instructions. If any candidate is wrong (e.g. `atos-belux` is the wrong legal name), fix it.

- [ ] **Step 2: Fetch FR VATs**

FR VATs look like `FR XX 123456789` (12 digits after country code). Sources:
- Capgemini: https://www.capgemini.com/fr-fr/mentions-legales/ or similar legal page
- Sopra Steria: https://www.soprasteria.com/fr/mentions-legales

- [ ] **Step 3: Fetch UK VATs**

UK VATs look like `GB 123 4567 89`. Sources:
- Accenture UK: https://www.accenture.com/gb-en/about/company/terms or legal footer
- Thoughtworks: https://www.thoughtworks.com/en-gb/legal

- [ ] **Step 4: Write `data/clients.ts`**

```ts
// backend/src/faker/data/clients.ts
import {ClientRow} from '../types';

export const clients: ClientRow[] = [
  {
    slug: 'cegeka',
    name: '<verified name>',
    btw: 'BE 0xxx.xxx.xxx',
    street: '<verified>',
    streetNr: '<verified>',
    postalCode: '<verified>',
    city: '<verified>',
    country: 'BE',
    language: 'nl',
    contact: 'Hans Vercauteren',
    telephone: '+32 ...',
  },
  // ... 15 more
];
```

Language spread: BE → mostly `nl`, one `fr` (e.g. `nrb` is Walloon → `fr`); FR entries → `fr`; UK entries → `en`.

Vary `frameworkAgreementStatus` — 2-3 rows get `'Sent'` or `'WeSigned'` to exercise UI badges.

- [ ] **Step 5: Typecheck + commit**

```bash
cd backend && bun run typecheck
git add backend/src/faker/data/clients.ts
git commit backend/src/faker/data/clients.ts -m "faker: 16 client rows (BE/FR/UK) with verified VATs"
```

---

## Task 8: data/endCustomers.ts (10 eindklanten)

Candidates: `kbc`, `ag-insurance`, `proximus`, `colruyt`, `bpost`, `elia`, `argenta`, `fluvius`, `brussels-airport`, `asml-nl` (NL).

- [ ] **Step 1: Verify BE VATs via KBO**

All 9 BE entries. Same process as Task 6.

- [ ] **Step 2: Fetch ASML Holding NL VAT**

WebFetch ASML corporate site or annual report for NL VAT. Headquarters is Veldhoven.

- [ ] **Step 3: Write `data/endCustomers.ts`**

```ts
// backend/src/faker/data/endCustomers.ts
import {ClientRow} from '../types';

export const endCustomers: ClientRow[] = [
  {
    slug: 'kbc',
    name: 'KBC Groep NV',
    btw: 'BE 0xxx.xxx.xxx',
    // ...
    country: 'BE',
    language: 'nl',
    contact: 'Sven Dhondt',
    telephone: '+32 ...',
  },
  // ... 9 more
];
```

- [ ] **Step 4: Typecheck + commit**

```bash
cd backend && bun run typecheck
git add backend/src/faker/data/endCustomers.ts
git commit backend/src/faker/data/endCustomers.ts -m "faker: 10 endCustomer rows with verified VATs"
```

---

## Task 9: data/consultants.ts + data/projects.ts

No external lookups — static fixture.

- [ ] **Step 1: Write `data/consultants.ts`**

```ts
// backend/src/faker/data/consultants.ts
import {ConsultantRow} from '../types';

export const consultants: ConsultantRow[] = [
  // 3 managers
  {slug: 'lien-van-den-berg', firstName: 'Lien', lastName: 'Van den Berg', type: 'manager', telephone: '+32 477 10 20 30'},
  {slug: 'bart-claes',        firstName: 'Bart', lastName: 'Claes',        type: 'manager', telephone: '+32 477 10 20 31'},
  {slug: 'els-hermans',       firstName: 'Els',  lastName: 'Hermans',      type: 'manager', telephone: '+32 477 10 20 32'},

  // 5 consultants
  {slug: 'jan-peeters',    firstName: 'Jan',    lastName: 'Peeters',    type: 'consultant', telephone: '+32 477 10 20 33'},
  {slug: 'sofie-janssens', firstName: 'Sofie',  lastName: 'Janssens',   type: 'consultant', telephone: '+32 477 10 20 34'},
  {slug: 'tom-de-vos',     firstName: 'Tom',    lastName: 'De Vos',     type: 'consultant', telephone: '+32 477 10 20 35'},
  {slug: 'anke-maes',      firstName: 'Anke',   lastName: 'Maes',       type: 'consultant', telephone: '+32 477 10 20 36'},
  {slug: 'koen-willems',   firstName: 'Koen',   lastName: 'Willems',    type: 'consultant', telephone: '+32 477 10 20 37'},

  // 5 freelancers (each wired to a partner)
  {slug: 'lars-wouters',  firstName: 'Lars',  lastName: 'Wouters',  type: 'freelancer', telephone: '+32 477 10 20 38', partnerSlug: 'ordina-belgium'},
  {slug: 'eva-goossens',  firstName: 'Eva',   lastName: 'Goossens', type: 'freelancer', telephone: '+32 477 10 20 39', partnerSlug: 'axi'},
  {slug: 'nico-mertens',  firstName: 'Nico',  lastName: 'Mertens',  type: 'freelancer', telephone: '+32 477 10 20 40', partnerSlug: 'euricom'},
  {slug: 'saar-dubois',   firstName: 'Saar',  lastName: 'Dubois',   type: 'freelancer', telephone: '+32 477 10 20 41', partnerSlug: 'ixor'},
  {slug: 'pieter-lemaire', firstName: 'Pieter', lastName: 'Lemaire', type: 'freelancer', telephone: '+32 477 10 20 42', partnerSlug: 'aleri-solutions'},

  // 3 externalConsultants (each wired to a partner)
  {slug: 'marc-martin',    firstName: 'Marc',    lastName: 'Martin',    type: 'externalConsultant', telephone: '+32 477 10 20 43', partnerSlug: 'in-the-pocket'},
  {slug: 'clara-dupont',   firstName: 'Clara',   lastName: 'Dupont',    type: 'externalConsultant', telephone: '+32 477 10 20 44', partnerSlug: 'bagaar'},
  {slug: 'simon-ferreira', firstName: 'Simon',   lastName: 'Ferreira',  type: 'externalConsultant', telephone: '+32 477 10 20 45', partnerSlug: 'ordina-nederland'},
];
```

Unassigned partners: `kunstmaan` and `ibidem` (no consultant references them — exercise "add partner later" UI flow).

- [ ] **Step 2: Write `data/projects.ts`**

```ts
// backend/src/faker/data/projects.ts
import {ProjectRow} from '../types';

export const projects: ProjectRow[] = [
  // Managers (projectMonthConfig: timesheetCheck=false, inboundInvoice=true)
  {consultantSlug: 'lien-van-den-berg', clientSlug: 'cegeka',          startDate: '2024-03-01', contractStatus: 'BothSigned'},
  {consultantSlug: 'bart-claes',        clientSlug: 'delaware',        startDate: '2024-06-01', contractStatus: 'BothSigned', endCustomerSlug: 'kbc'},
  {consultantSlug: 'els-hermans',       clientSlug: 'accenture-be',    startDate: '2025-01-15', contractStatus: 'Sent'},

  // Consultants (projectMonthConfig: timesheetCheck=true, inboundInvoice=false)
  {consultantSlug: 'jan-peeters',    clientSlug: 'cegeka',        startDate: '2024-01-01', endDate: '2025-12-31', contractStatus: 'BothSigned', endCustomerSlug: 'proximus'},
  {consultantSlug: 'sofie-janssens', clientSlug: 'ae',            startDate: '2024-09-01', contractStatus: 'BothSigned', endCustomerSlug: 'ag-insurance'},
  {consultantSlug: 'tom-de-vos',     clientSlug: 'delaware',      startDate: '2024-04-01', contractStatus: 'BothSigned', endCustomerSlug: 'colruyt', ref: 'PO-9912'},
  {consultantSlug: 'anke-maes',      clientSlug: 'sopra-steria-be', startDate: '2025-02-01', contractStatus: 'WeSigned'},
  {consultantSlug: 'koen-willems',   clientSlug: 'nrb',           startDate: '2024-11-01', contractStatus: 'BothSigned', endCustomerSlug: 'elia'},

  // Freelancers (partnerSlug required; defaults same as manager branch)
  {consultantSlug: 'lars-wouters',  clientSlug: 'cegeka',         partnerSlug: 'ordina-belgium',   startDate: '2024-02-01', contractStatus: 'BothSigned', endCustomerSlug: 'bpost'},
  {consultantSlug: 'eva-goossens',  clientSlug: 'delaware',       partnerSlug: 'axi',              startDate: '2024-07-15', endDate: '2026-07-14', contractStatus: 'BothSigned'},
  {consultantSlug: 'nico-mertens',  clientSlug: 'cronos',         partnerSlug: 'euricom',          startDate: '2025-01-01', contractStatus: 'Sent', endCustomerSlug: 'argenta'},
  {consultantSlug: 'saar-dubois',   clientSlug: 'ctg-belgium',    partnerSlug: 'ixor',             startDate: '2024-05-01', contractStatus: 'BothSigned', endCustomerSlug: 'fluvius'},
  {consultantSlug: 'pieter-lemaire', clientSlug: 'capgemini-fr',  partnerSlug: 'aleri-solutions',  startDate: '2025-03-01', contractStatus: 'BothSigned'},

  // externalConsultants
  {consultantSlug: 'marc-martin',    clientSlug: 'accenture-uk',  partnerSlug: 'in-the-pocket',    startDate: '2024-10-01', contractStatus: 'BothSigned', endCustomerSlug: 'brussels-airport'},
  {consultantSlug: 'clara-dupont',   clientSlug: 'sopra-steria-fr', partnerSlug: 'bagaar',         startDate: '2025-04-01', contractStatus: 'WeSigned'},
  {consultantSlug: 'simon-ferreira', clientSlug: 'thoughtworks-uk', partnerSlug: 'ordina-nederland', startDate: '2024-08-01', contractStatus: 'BothSigned', endCustomerSlug: 'asml-nl'},
];
```

- [ ] **Step 3: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add backend/src/faker/data/consultants.ts backend/src/faker/data/projects.ts
git commit backend/src/faker/data/consultants.ts backend/src/faker/data/projects.ts -m "faker: curated consultants and projects"
```

---

## Task 10: Rewrite insertStuff.ts with guard + orchestration

**Files:**
- Rewrite: `backend/src/faker/insertStuff.ts`

- [ ] **Step 1: Write the new `insertStuff.ts`**

```ts
/* eslint-disable no-console */
import {Db, ObjectID} from 'mongodb';
import {buildConfig} from './builders/buildConfig';
import {buildClient} from './builders/buildClient';
import {buildConsultant} from './builders/buildConsultant';
import {buildProject} from './builders/buildProject';
import {DEFAULT_CLIENT_SLUG} from './data/config';
import {partners} from './data/partners';
import {clients} from './data/clients';
import {endCustomers} from './data/endCustomers';
import {consultants as consultantRows} from './data/consultants';
import {projects as projectRows} from './data/projects';
import {BuildProjectMaps, ConsultantType} from './types';

const GUARDED = [
  {collection: 'config', filter: {key: 'conf'}},
  {collection: 'clients', filter: {}},
  {collection: 'consultants', filter: {}},
  {collection: 'projects', filter: {}},
] as const;

export async function insertStuff(db: Db): Promise<void> {
  // --- 1. Guard: refuse to touch a non-empty DB ---
  for (const {collection, filter} of GUARDED) {
    const count = await db.collection(collection).countDocuments(filter);
    if (count > 0) {
      console.warn(`[faker] Skipping: '${collection}' already has ${count} doc(s). Running against a fresh DB is required.`);
      return;
    }
  }

  // --- 2. Config (defaultClient set later) ---
  const configDoc = buildConfig();
  await db.collection('config').insertOne(configDoc);
  console.log('[faker] Inserted config');

  // --- 3. Clients (partners ∪ clients ∪ endCustomers) ---
  const builtClients = [
    ...partners.map(r => buildClient(r, 'partner')),
    ...clients.map(r => buildClient(r, 'client')),
    ...endCustomers.map(r => buildClient(r, 'endCustomer')),
  ];
  const clientInsert = await db.collection('clients').insertMany(builtClients);
  console.log(`[faker] Inserted ${builtClients.length} clients`);

  const clientIds = new Map<string, ObjectID>();
  builtClients.forEach((c, i) => clientIds.set(c.slug, clientInsert.insertedIds[i]));

  // --- 4. Consultants ---
  const builtConsultants = consultantRows.map(buildConsultant);
  const consultantInsert = await db.collection('consultants').insertMany(builtConsultants);
  console.log(`[faker] Inserted ${builtConsultants.length} consultants`);

  const consultantIds = new Map<string, ObjectID>();
  const consultantTypes = new Map<string, ConsultantType>();
  builtConsultants.forEach((c, i) => {
    consultantIds.set(c.slug, consultantInsert.insertedIds[i]);
    consultantTypes.set(c.slug, c.type as ConsultantType);
  });

  // --- 5. Projects ---
  const maps: BuildProjectMaps = {clientIds, consultantIds, consultantTypes};
  const builtProjects = projectRows.map(row => buildProject(row, maps));
  await db.collection('projects').insertMany(builtProjects);
  console.log(`[faker] Inserted ${builtProjects.length} projects`);

  // --- 6. Set config.defaultClient to the designated main client ---
  const defaultClientId = clientIds.get(DEFAULT_CLIENT_SLUG);
  if (!defaultClientId) {
    throw new Error(`DEFAULT_CLIENT_SLUG '${DEFAULT_CLIENT_SLUG}' not found among inserted clients`);
  }
  await db.collection('config').updateOne(
    {key: 'conf'},
    {$set: {defaultClient: defaultClientId.toString()}},
  );
  console.log(`[faker] config.defaultClient -> ${DEFAULT_CLIENT_SLUG}`);
}
```

- [ ] **Step 2: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: PASS.

- [ ] **Step 3: Lint**

Run: `cd backend && bun run lint`
Expected: PASS (zero warnings).

- [ ] **Step 4: Commit**

```bash
git add backend/src/faker/insertStuff.ts
git commit backend/src/faker/insertStuff.ts -m "faker: guarded, curated insert orchestration"
```

---

## Task 11: Remove dead code and run end-to-end

**Files:**
- Delete: `backend/src/faker/models.ts`
- Delete: `backend/src/faker/faker-config.ts`

- [ ] **Step 1: Delete obsolete files**

```bash
git rm backend/src/faker/models.ts backend/src/faker/faker-config.ts
```

These held the random generator + its toggles, which nothing references after Task 10.

- [ ] **Step 2: Full typecheck + lint + unit tests**

```bash
cd backend && bun run typecheck
cd backend && bun run lint
cd backend && bun run test
```

Expected: all PASS, zero lint warnings.

- [ ] **Step 3: Prepare a scratch Mongo DB**

The faker hits the DB named by `MONGO_DB` in `backend/.env`. Point it at a scratch DB (`confac-faker-test` or similar) before running — not your dev DB. Manually drop the collections if they exist:

```bash
mongosh "mongodb://localhost:27017/confac-faker-test" --eval 'db.config.drop(); db.clients.drop(); db.consultants.drop(); db.projects.drop()'
```

- [ ] **Step 4: Run the faker**

```bash
cd backend && bun run faker
```

Expected console output (approximate):
```
Successfully connected to the database!
About to insert some stuff...
[faker] Inserted config
[faker] Inserted 36 clients
[faker] Inserted 16 consultants
[faker] Inserted 16 projects
[faker] config.defaultClient -> cegeka
```

- [ ] **Step 5: Re-run to verify the guard**

```bash
cd backend && bun run faker
```

Expected: 4 `[faker] Skipping: '<collection>' already has N doc(s)` warnings, no inserts, clean exit.

- [ ] **Step 6: Spot-check the data in Mongo**

```bash
mongosh "mongodb://localhost:27017/confac-faker-test" --eval '
  JSON.stringify({
    config: db.config.findOne({key: "conf"}, {"company.name": 1, defaultClient: 1, "email.bcc": 1}),
    partners: db.clients.countDocuments({types: "partner"}),
    clients: db.clients.countDocuments({types: "client"}),
    endCustomers: db.clients.countDocuments({types: "endCustomer"}),
    consultants: db.consultants.countDocuments(),
    projects: db.projects.countDocuments(),
    noRealEmails: db.clients.countDocuments({"email.to": /itenium\.be$/}),
  }, null, 2)
'
```

Expected:
- `config.company.name`: `"itenium TEST"`
- `config.defaultClient`: non-null ObjectId string
- `config.email.bcc`: `"itenium@pongit.be"`
- partners: 10
- clients: 16
- endCustomers: 10
- consultants: 16
- projects: 16
- `noRealEmails`: 0 (no `@itenium.be` leaks)

- [ ] **Step 7: UI smoke test**

Start the backend + frontend dev servers. Open the app and check:
- Config page shows `itenium TEST` with Pilatusveld 7, Londerzeel, `itenium@pongit.be`.
- Clients list has 36 entries across 3 type filters.
- Consultants list has 16 entries across the 4 types.
- Projects list has 16 entries; opening a freelancer project shows its partner; opening a consultant-type project shows `timesheetCheck=true, inboundInvoice=false`; opening a manager project shows the inverse.

- [ ] **Step 8: Commit the deletions**

```bash
git commit backend/src/faker/models.ts backend/src/faker/faker-config.ts -m "faker: drop obsolete random generator"
```

---

## Self-review

- **Spec coverage:** Every spec section is covered — file layout (Task 1), guard (Task 10), config overrides (Task 5), 10/16/10 client split with VAT verification (Tasks 6-8), 3/5/5/3 consultant split (Task 9), consultant-type→projectMonthConfig (Task 4 + Task 9 rows), slug-based project resolution (Task 4 + Task 10), defaultClient post-update (Task 5 + Task 10), pongit email rerouting (Tasks 2, 3, 5), no projectMonths/invoices (out of scope, explicit).
- **Placeholders:** The data files contain `<verified>` / `BE 0xxx.xxx.xxx` markers — these are intentional for Tasks 6-8 where the engineer must fill them after a live KBO lookup. Not a plan failure; they're the *thing to do* in those steps.
- **Type consistency:** `buildClient` returns a `BuiltClient` that `insertStuff` treats as plain docs (mongodb `Collection<T>` is permissive). `buildProject` consumes `BuildProjectMaps`, defined in `types.ts` and constructed inline in `insertStuff.ts` and the unit test — shapes match. `ConsultantType` is the same type used in `getDefaultProjectMonthConfig` and the maps.
