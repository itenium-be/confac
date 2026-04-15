# Curated Faker Data — Design

Replace the current random faker with a curated, deterministic fixture: one real `itenium TEST` config, real Belgian (+ a few NL/FR/UK) companies as clients, fixed-list consultants, and projects that wire them together with consultant-type-appropriate defaults.

## Goals

- Re-running the faker against a fresh DB always produces the same state.
- All "real" companies use real VAT numbers (verified via KBO public lookup for BE).
- No email address in the fixture points at a real inbox — every `to`/`from`/`cc`/`bcc`/signature address is rerouted to `*@pongit.be`.
- Projects respect the same consultant-type → `projectMonthConfig` logic the Edit screen applies.
- `onderaannemer` and `eindklant` on a project are real `Client` docs tagged with `types: ['partner']` / `['endCustomer']`, not ad-hoc embedded objects.
- Existing-data safety: if any target collection is non-empty, warn and exit without inserting anything.

## Non-goals

- `projectMonths` and `invoices` generation. Current random generators for these are untouched for now; decision deferred.
- Runtime toggles / amounts. This is a fixed fixture — no `faker-config.ts`.
- Anonymising / shuffling. Data is intentionally deterministic.

## File layout

```
backend/src/faker/
  index.ts                         # unchanged: mongo connect + call insertStuff
  insertStuff.ts                   # rewritten: guard + orchestrate curated inserts
  projectMonthConfigDefaults.ts    # copied from frontend getDefaultProjectMonthConfig
  data/
    config.ts                      # itenium TEST ICompanyConfig (real data, rerouted emails)
    partners.ts                    # 10 onderaannemer rows (9 BE + 1 NL), type 'partner'
    clients.ts                     # 16 client rows (12 BE + 2 FR + 2 UK), type 'client'
    endCustomers.ts                # 10 eindklant rows (9 BE + 1 NL), type 'endCustomer'
    consultants.ts                 # 16 consultant rows (3 mgr / 5 cons / 5 fl / 3 ext)
    projects.ts                    # 16 project rows, one per consultant
  builders/
    buildConfig.ts
    buildClient.ts
    buildConsultant.ts
    buildProject.ts
```

The existing `faker-config.ts` is deleted. The random `getNewClient` / `getNewConsultant` / `getNewProjects` / `getNewInvoices` / `getNewProjectMonths` in `models.ts` are removed (invoice/projectMonth generation not in scope, and the rest is replaced).

## Orchestration (`insertStuff.ts`)

```
1. Guard: for each of [config key=conf, clients, consultants, projects]
     if collection.countDocuments() > 0:
       console.warn(`Skipping faker: '<name>' already has <n> docs`)
       return                 # all-or-nothing — don't try to fill gaps
2. Insert config (without defaultClient set).
3. Build + insert all clients (partners ∪ clients ∪ endCustomers) in one insertMany.
4. Build + insert all consultants in one insertMany.
5. Build projects, resolving consultantSlug/clientSlug/partnerSlug/endCustomerSlug
   against the freshly-inserted docs. Throw on any unresolved slug.
6. insertMany projects.
7. Update the config doc: set `defaultClient` to the `_id` of the designated
   main client (specified by slug in data/config.ts).
```

No admin-role insertion (existing `insertAdminRole` stays but is unrelated to this spec).

## Config doc (`data/config.ts`)

Near-verbatim copy of the prod config dump provided by the user, with the following changes:

| field | from | to |
|---|---|---|
| `_id` | `5ace3f34d8b6f80001182fb1` | removed |
| `company.name` | `itenium BV` | `itenium TEST` |
| `company.email` | `info@itenium.be` | `itenium@pongit.be` |
| `email.bcc` | `finance@itenium.be` | `itenium@pongit.be` |
| `email.from` | `finance@itenium.be` | `itenium@pongit.be` |
| `emailReminderBcc` | `finance@itenium.be` | `itenium@pongit.be` |
| `emailSignature` | contains `finance@itenium.be` (href + text) | both → `itenium@pongit.be` |
| `emailInvoiceOnly` | `w72q@verkoop.exactonline.be` | `itenium@pongit.be` |
| `defaultClient` | `5e8f37138fb2840001b90821` | initially `null`; post-insert update sets it to the `_id` of the client with `slug: 'cegeka'` (main demo client) |
| `audit` | `{modifiedOn, modifiedBy}` | `{createdOn: <now>, createdBy: 'faker'}` |

Everything else (templates `itenium.pug` / `itenium-signable.pug` / `itenium - offerte.pug`, `invoiceFileName`, `attachmentTypes`, `defaultInvoiceLines`, email subject/body templates, `emailCreditNotaSubject/Body`, `emailPeppolDuplicateSubject/Body`, `peppolPivotDate: 2026-01-01`, `initialMonthLoad: 18`, `invoicePayDays: 30`, `language: 'en'`, `key: 'conf'`, etc.) is copied exactly as provided.

`bic` is normalised from `" KREDBEBB"` (leading space in prod) to `"KREDBEBB"`.

## Client data files

Each file exports `const rows: ClientRow[]`. `ClientRow` is defined in `builders/buildClient.ts`:

```ts
type ClientRow = {
  slug: string;          // explicit, used for cross-file references
  name: string;          // real legal name
  btw: string;           // display format: 'BE 0687.800.967', 'FR 12 345678901', etc.
  street: string;
  streetNr: string;
  streetBox?: string;
  postalCode: string;
  city: string;
  country: 'BE' | 'NL' | 'FR' | 'UK';
  language: 'nl' | 'fr' | 'en';
  contact: string;       // plausible (fictional) contact person
  telephone: string;
  peppolEnabled?: boolean;
  frameworkAgreementStatus?: 'BothSigned' | 'Sent' | 'WeSigned' | 'NotNeeded';  // default 'BothSigned'
};
```

### `data/partners.ts` — 10 rows, type `partner` (onderaannemer)

Real BE IT consultancies (the small end of the market) plus one NL entry. Candidates; final list + verified VATs written into the file during implementation using KBO (`kbopub.economie.fgov.be`) lookups:

1. `ordina-belgium` — Ordina Belgium NV (BE)
2. `axi` — AXI NV (BE)
3. `euricom` — Euricom NV (BE)
4. `ixor` — Ixor NV (BE)
5. `aleri-solutions` — Aleri Solutions NV (BE)
6. `in-the-pocket` — In The Pocket NV (BE)
7. `bagaar` — Bagaar NV (BE)
8. `kunstmaan` — Kunstmaan NV (BE)
9. `ibidem` — Ibidem Group (BE)
10. `ordina-nederland` — Ordina Nederland BV (NL)

Two of these (`ibidem`, `kunstmaan`) are intentionally left **unassigned** — no consultant references them — so the "add partner to existing project" UI flow has spare docs to work against.

### `data/clients.ts` — 16 rows, type `client` (IT consultancies we invoice)

1. `cegeka` — Cegeka NV (BE) ← designated `config.defaultClient`
2. `delaware` — Delaware Consulting CVBA (BE)
3. `ae` — AE NV (BE)
4. `sopra-steria-be` — Sopra Steria Benelux NV (BE)
5. `accenture-be` — Accenture NV (BE)
6. `nexios` — Nexios IT (BE)
7. `nrb` — NRB SA (BE)
8. `cronos` — The Cronos Group (BE)
9. `ctg-belgium` — CTG Belgium NV (BE)
10. `smals` — Smals vzw (BE)
11. `ibm-belgium` — IBM Belgium BV (BE)
12. `atos-belux` — Atos Belgium Luxembourg NV (BE)
13. `capgemini-fr` — Capgemini SE (FR)
14. `sopra-steria-fr` — Sopra Steria Group SE (FR)
15. `accenture-uk` — Accenture (UK) Limited (UK)
16. `thoughtworks-uk` — ThoughtWorks Limited (UK)

Language: BE → mix of `nl` (most) and one `fr`; FR → `fr`; UK → `en`.

### `data/endCustomers.ts` — 10 rows, type `endCustomer` (eindklant)

Large BE corporates that hire external dev teams, plus one NL:

1. `kbc` — KBC Groep NV (BE)
2. `ag-insurance` — AG Insurance NV (BE)
3. `proximus` — Proximus NV (BE)
4. `colruyt` — Colruyt Group NV (BE)
5. `bpost` — bpost NV (BE)
6. `elia` — Elia Transmission Belgium NV (BE)
7. `argenta` — Argenta Spaarbank NV (BE)
8. `fluvius` — Fluvius System Operator CV (BE)
9. `brussels-airport` — Brussels Airport Company NV (BE)
10. `asml-nl` — ASML Holding NV (NL)

### `buildClient.ts`

```ts
(row: ClientRow, type: 'partner' | 'client' | 'endCustomer') => IClient
```

Adds:

- `types: [type]`
- `email.to`: `${row.slug}@pongit.be`
- `email.subject`: `'New invoice {{nr}}'`, `email.body`: `'<p>Dear,</p><p>Please find the invoice attached.</p>'`
- `email.attachments`: `[{type: 'pdf', fileName: 'invoice.pdf', fileType: 'application/pdf'}, {type: 'Getekende timesheet', fileName: 'timesheet.pdf', fileType: 'application/pdf'}]`
- `email.combineAttachments: false`
- `active: true`
- `hoursInDay: 8`
- `defaultInvoiceDateStrategy: 'prev-month-last-day'`
- `defaultChangingOrderNr: false`
- `invoiceFileName: ' {{formatDate date "YYYY-MM"}} {{zero nr 4}} - {{clientName}}'`
- `defaultInvoiceLines`: `[{desc: 'Consultancy diensten', price: <type-default>, amount: 0, tax: 21, type: 'daily', sort: 0}]` — price 550 for `client`, 480 for `partner`, 0 for `endCustomer` (not invoiced directly).
- `frameworkAgreement: {status: row.frameworkAgreementStatus ?? 'BothSigned', notes: ''}`
- `peppolEnabled: row.peppolEnabled ?? (row.country === 'BE')` — all BE entries Peppol-enabled, others not.
- `attachments: []`, `notes: ''`, `comments: []`
- `audit: {createdOn: <now>, createdBy: 'faker', modifiedOn: '', modifiedBy: ''}`

## `data/consultants.ts` — 16 rows

```ts
type ConsultantRow = {
  slug: string;
  firstName: string;
  lastName: string;
  type: 'manager' | 'consultant' | 'freelancer' | 'externalConsultant';
  telephone: string;
  partnerSlug?: string;   // required iff type is 'freelancer' or 'externalConsultant'
};
```

Distribution: 3 managers, 5 consultants, 5 freelancers, 3 externalConsultants.

Names use plausible BE surnames (Peeters, Janssens, De Vos, Claes, Maes, Willems, Wouters, Goossens, Mertens, Hermans, Van den Berg, Dubois, Lemaire, Martin, Dupont, Simon). No real people.

The 8 freelancer/externalConsultant rows reference 8 of the 10 partner slugs (all except `ibidem` and `kunstmaan`).

### `buildConsultant.ts`

```ts
(row: ConsultantRow) => IConsultant
```

Adds:

- `slug: row.slug` (pre-declared in data file — not derived, so cross-file refs stay stable)
- `email: ${row.slug}@pongit.be`
- `active: true`
- `audit: {createdOn: <now>, createdBy: 'faker'}`

## `projectMonthConfigDefaults.ts`

A **copy** of `frontend/src/components/project/models/ProjectMonthModel.ts::getDefaultProjectMonthConfig`. Copying (not importing) because frontend and backend are separate bun packages with no shared utilities module. The function is 25 lines — cheaper to duplicate than to set up shared infrastructure.

```ts
export function getDefaultProjectMonthConfig(consultantType: ConsultantType):
  { timesheetCheck: boolean; inboundInvoice: boolean } {
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

A small comment on the file points to the frontend source as the canonical location — if behaviour there changes, this copy must be updated.

## `data/projects.ts` — 16 rows (one per consultant)

```ts
type ProjectRow = {
  consultantSlug: string;
  clientSlug: string;               // type 'client'
  partnerSlug?: string;             // required iff consultant is freelancer/externalConsultant
  endCustomerSlug?: string;         // optional, ~60% of rows
  startDate: string;                // ISO
  endDate?: string;                 // ISO, ~70% of rows
  ref?: string;
  contractStatus: 'BothSigned' | 'Sent' | 'WeSigned' | 'TheySigned' | 'NotNeeded';
  advancedInvoicing?: boolean;      // default false
  clientPrice?: number;             // default 550
  partnerPrice?: number;            // default 480
};
```

### `buildProject.ts`

Input: the row plus lookup maps `Map<slug, _id>` and `Map<slug, ConsultantRow>` (so we know consultant type without re-reading the DB).

```ts
(row: ProjectRow, maps: Maps) => IProject
```

Logic:

1. Resolve `consultantId`, `client.clientId`, optionally `partner.clientId`, optionally `endCustomer.clientId` via the slug maps. Throw `Error('unresolved slug: <slug>')` on any miss.
2. Assert: if consultant is `freelancer`/`externalConsultant`, `partnerSlug` must be set; else fail fast.
3. Compute `projectMonthConfig`:
   ```ts
   {
     ...getDefaultProjectMonthConfig(consultantRow.type),
     changingOrderNr: false,
     emailInvoiceDuplicate: false,
     proforma: 'no',
   }
   ```
4. Build `client`: `{clientId, ref: row.ref, defaultInvoiceLines: [<line at clientPrice>], advancedInvoicing: row.advancedInvoicing ?? false}`.
5. Build `partner` (if set): same shape, price = `partnerPrice`.
6. Build `endCustomer` (if set): `{clientId, contact: '', notes: ''}`. Set `forEndCustomer: true`.
7. `contract: {status: row.contractStatus, notes: ''}`.
8. `startDate`, `endDate`, `accountManager: ''`, `comments: []`, `notes: ''`, `audit`.

All 16 projects have `startDate` in 2024 or 2025. Mix of open-ended and fixed-end. A few projects have `contractStatus: 'Sent'` to exercise the "contract not yet signed" UI.

## VAT verification

Every BE row's `btw` is verified via `https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html` (or equivalent KBO endpoint) during implementation, before the data file is written. If a candidate company turns out to be merged / deregistered / unfindable, it's swapped for another from the same bucket and the swap noted in the commit message. NL/FR/UK rows use VAT numbers taken from the companies' public legal footers.

## Testing

No unit tests for the data files themselves (they're constants). One integration-style test per builder:

- `buildClient.test.ts` — given a fixture row, asserts output has `email.to` ending in `@pongit.be`, `types: ['client']`, `audit.createdBy: 'faker'`.
- `buildConsultant.test.ts` — asserts `email` ending `@pongit.be`, active true.
- `buildProject.test.ts` — table-driven: for each consultant type, asserts `projectMonthConfig.timesheetCheck/inboundInvoice` match `getDefaultProjectMonthConfig`. Asserts `forEndCustomer` ↔ `endCustomer` presence. Asserts an unresolved slug throws.
- `insertStuff.test.ts` — hits an in-memory or scratch mongo: runs twice, second run warns + does nothing. First run leaves exactly 1 config / 36 clients / 16 consultants / 16 projects.

Manual verification: after running `bun run faker`, the UI should load without errors, the config page should show "itenium TEST", all three client tabs should be populated, and one project per consultant should be listed.

## Out of scope / open questions to decide later

- Whether to generate `projectMonths` / `invoices` as curated data. Current thinking: keep those random or dropped — easier to exercise through the UI. Revisit after this spec lands.
- Whether to delete the existing random `getNewInvoices` etc. or keep them as a separate command. Current plan: remove them (no caller will be left).
