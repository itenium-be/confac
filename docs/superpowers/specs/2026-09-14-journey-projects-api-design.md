# Journey projects API

A read-only HTTP endpoint that hands the Journey app the running consultant
projects. Authenticated with a single API key that reaches this endpoint and
nothing else.

## Authentication

`JOURNEY_API_KEY` env var → `config.journey.apiKey`.

`backend/src/routes/journeyApiKey.ts` exports `journeyApiKeyMiddleware`: reads
the `X-Api-Key` header and compares it to `config.journey.apiKey` with
`crypto.timingSafeEqual` over the sha256 of both, so unequal lengths compare
instead of throwing. On mismatch it calls
`next(new UnauthorizedError('credentials_required', ...))`, which `server.ts`
already turns into a 401.

An empty `config.journey.apiKey` rejects every request, so a missing env var
disables the endpoint instead of opening it. The key is checked regardless of
the `withSecurity` toggle — local development sets the var in `.env`.

The middleware also sets `req.apiConsumer = 'Journey'` (new optional field on
`ConfacRequest`) so the requests are greppable in Loki.

`backend/.env.sample` gets an empty `JOURNEY_API_KEY`; the real one goes in
Coolify.

## Routing

Mounted outside the `withSecurity` branch in `routes/index.ts`, next to the
billit webhooks:

```ts
appRouter.use('/public', journeyApiKeyMiddleware, useLogger, publicRouter);
```

`publicRouter` (`routes/public.ts`) holds exactly one route: `GET /projects`.
Nothing else is mounted under `/public`, so the key structurally cannot reach
another endpoint.

`useLogger` gains one fallback: `confacReq.user?.data?.alias ?? confacReq.user?.data?._id ?? confacReq.apiConsumer`.
No other call site changes.

## Modules

| File                                               | Responsibility                                     |
|----------------------------------------------------|----------------------------------------------------|
| `routes/journeyApiKey.ts`                          | header check                                       |
| `routes/public.ts`                                 | the single route                                   |
| `controllers/publicProjects.ts`                    | fetch the four collections, map, send              |
| `services/public-api/project-export.ts`            | pure filter + map → `ProjectExport[]`              |
| `services/public-api/tests/project-export.test.ts` | covers filter and mapping, no database             |

The controller does the I/O, the service does the thinking. Everything worth
testing lives in the pure function, which takes plain arrays and returns plain
objects.

## Which projects

A project is exported when both hold:

- its consultant exists and has `type === 'consultant'`
- `endDate` is empty, or `endDate >= today - 3 months`

`startDate` is not bounded, so projects that have not started yet are included.
Projects whose `consultantId` no longer resolves are dropped — the type filter
cannot be satisfied without the consultant.

## Response

`GET /api/public/projects` → `200` with a JSON array of:

```json
{
  "id": "66f...",
  "startDate": "2026-01-01",
  "endDate": null,
  "consultant":     {"id": "..", "name": "Jos Vermeulen", "email": "jos@itenium.be"},
  "accountManager": {"id": "..", "name": "Wouter Vanschandevijl", "email": "wouter@itenium.be"},
  "client":         {"id": "..", "name": "KBC"},
  "endCustomer":    {"id": "..", "name": "Ergo"},
  "contract": {
    "frameworkAgreement": "BothSigned",
    "project": "Sent"
  }
}
```

| Field                        | Source                                                      |
|------------------------------|-------------------------------------------------------------|
| `id`                         | `project._id`                                               |
| `startDate`, `endDate`       | `YYYY-MM-DD`; `endDate` is `null` when unset                |
| `consultant.name`            | `${firstName} ${name}`                                      |
| `accountManager`             | user by `project.accountManager`; `null` when unset/unknown |
| `accountManager.name`        | `${firstName} ${name}`                                      |
| `client`                     | client by `project.client.clientId`; `null` when unknown    |
| `endCustomer`                | client by `project.endCustomer.clientId`; `null` unless `forEndCustomer` |
| `contract.frameworkAgreement`| `client.frameworkAgreement.status`, `NoContract` when unset |
| `contract.project`           | `project.contract.status`, `NoContract` when unset          |

Ids are Mongo ObjectId strings. `endCustomer.contact` and `endCustomer.notes`
are not exported.

## Errors

| Situation                | Response |
|--------------------------|----------|
| Missing/wrong `X-Api-Key`| 401      |
| `JOURNEY_API_KEY` unset  | 401      |

## Testing

`project-export.test.ts` covers, against handbuilt arrays:

- a freelancer, manager and externalConsultant project are excluded
- a project ended 2 months ago is included, 4 months ago is not
- a project starting next month is included
- an unknown `consultantId` drops the project
- missing account manager, end customer and contract statuses map to
  `null` / `NoContract`
- date formatting

The api key middleware gets its own test: right key passes, wrong key and
missing header 401, empty config 401.

## Out of scope

Key rotation UI, multiple keys, revocation, paging, filtering by query
parameters. One consumer, one key, one list.
