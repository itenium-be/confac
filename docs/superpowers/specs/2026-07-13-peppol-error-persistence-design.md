# Persist and visualize Peppol send errors

## Problem

When sending an invoice to Peppol fails, the error is only logged and returned as an HTTP 500,
which the frontend shows as a transient toast. Nothing is stored on the invoice.

The failure mode from the README:

```
info: SEND INVOICE TO PEPPOL - Invoice Nr=2737
info: Billit order created successfully: 128275964
error: Billit sendInvoice failed: 400 - {"errors":[{"Code":"PleaseSupplyAValidPONumberInTheFieldYourReference","Description":"Voor deze klant is een geldig PO of ordernummer nodig ..."}]}
```

`createOrder` succeeded, so the invoice is now `ToSend` with a `billit.orderId`, but `sendInvoice`
failed. Once the toast is gone there is no record of why. The invoice is stuck: `EditInvoice`
locks anything that is not `Draft`, and the "Peppol Status" button only renders for `ToPay`/`Paid`.

## Scope

In scope: persisting send-time Billit API errors (`createOrder`, `sendInvoice`) on the invoice, and
surfacing them in the frontend.

Out of scope:

- Async delivery failures (webhook `EInvoiceFlowState: 'Refused'`, `message.success === false`).
  These already land in `billit.messages`/`billit.delivery`.
- Errors from `getParticipantInformation` / `syncClientPeppolStatus`.
- Unlocking a failed `ToSend` invoice for editing. The Billit order already exists with the old
  data and `createOrder` is skipped on retry, so edits would not reach Billit without also patching
  or recreating the order. That needs its own design.

## Data model

`backend/src/models/invoices.ts`:

```ts
export interface IInvoiceBillitError {
  date: string;
  operation: 'createOrder' | 'sendInvoice';
  /** The full error message, incl. the raw Billit response body */
  message: string;
  /** Structured Billit error codes, when Billit returned them */
  billitErrors?: {Code: string; Description?: string}[];
}
```

`errors?: IInvoiceBillitError[]` is added to `IInvoiceBillit`, alongside `delivery` and `messages`.

The array is append-only: a later successful send does not clear it. The history is what explains
why an invoice was stuck.

`billitErrors` keeps Billit's PascalCase, matching `BillitErrorDetail` in the service layer and the
`{Code, Description}` shape the frontend already renders from the 500 response body.

## Backend

### Mapping

`BillitErrorFactory.toInvoiceError(operation, error): IInvoiceBillitError` — the inverse of the
existing `createError`. A `BillitError` maps to all four fields; a plain `Error` or a non-Error
throwable maps to the same minus `billitErrors`. Pure function, so it is the main unit-test seam.

### Persistence

`saveBillitError(req, invoice, operation, error)`, a new util next to the other Billit controller
utils. It performs a single `$push` onto `billit.errors` (Mongo creates `billit` when a `createOrder`
failure means there is none yet), then `saveAudit` and `emitEntityEvent` — the same trio
`syncBillitOrder` already uses.

The socket event is how the stored errors reach the frontend store: the send request itself answers
500, and the existing `sendToPeppol` failure path does not update the store.

Called from the two existing catch blocks in `sendInvoiceToPeppolController`
(`backend/src/controllers/invoices.ts:536` and `:581`), after the idempotency-token check and before
the rethrow. The outer catch stays untouched — it also catches DB and attachment failures, which are
not Peppol errors.

### Surviving sync

`mapBillitOrderToInvoiceBillit` in `backend/src/services/billit/orders/sync-order.ts` rebuilds the
`billit` object from Billit's response and `$set`s it wholesale, so it would silently drop `errors`
on the next webhook or status refresh. It takes the existing `IInvoiceBillit` instead of just
`aboutInvoiceNumber` and carries `errors` over. This also keeps its `diff()` no-change check honest.

## Frontend

- `InvoiceModel.ts` — mirror `InvoiceBillitError`; add `errors?` to `InvoiceBillitModel`.
- `PeppolModal.tsx` — a `BillitErrors` component, red, styled like the existing `BillitMessages`
  block, listing each error's date, operation and `Code: Description` lines.
  - `PeppolStatusModal` renders the full history.
  - `SendToPeppolModal` renders only the most recent error, as a "previous attempt failed" warning
    above the confirm text. That is the modal you are in when you retry.
- `EditInvoiceFooter.tsx:193` — the Peppol Status button condition becomes
  `isSentStatus || !!invoice.billit?.errors?.length`, so a `ToSend` invoice stuck on a failed send
  can reach the modal.
- `trans.en.ts` / `trans.nl.ts` — `invoice.peppolErrors`, `invoice.peppolPreviousAttemptFailed`.

## Tests

Written first, per TDD.

| Unit                                | Cases                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `BillitErrorFactory.toInvoiceError` | structured `BillitError`; plain `Error`; non-Error throwable                        |
| `mapBillitOrderToInvoiceBillit`     | preserves existing `errors` (no test file exists for `sync-order` yet)              |
| `saveBillitError`                   | pushes when `billit` is absent; appends when it already has entries                 |

`saveBillitError` uses the mock-Express + `fakeDb` pattern from
`backend/src/controllers/tests/1-clients.test.ts`.
