# Journey Projects API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `GET /api/public/projects` endpoint, authenticated by a single API key, returning the running consultant projects for the Journey app.

**Architecture:** An express middleware checks the `X-Api-Key` header against `JOURNEY_API_KEY` and is mounted on its own `/public` router so the key reaches nothing else. The controller reads four mongo collections and hands the raw arrays to a pure function that filters and maps them; all logic worth testing lives in that pure function.

**Tech Stack:** TypeScript, express 4, mongodb 3 driver, moment, vitest. Run everything with `bun`, never `npm`.

Spec: `docs/superpowers/specs/2026-09-14-journey-projects-api-design.md`

---

## File Structure

| File | Responsibility |
|-------------------------------------------------------------|---------------------------------------------------|
| `backend/src/models/contracts.ts` (create)                   | `ContractStatus` union + `IContract`              |
| `backend/src/models/projects.ts` (modify)                    | the project fields the mapper needs               |
| `backend/src/models/clients.ts` (modify)                     | `frameworkAgreement` on `IClient`                 |
| `backend/src/models/technical.ts` (modify)                   | `apiConsumer` on `ConfacRequest`                  |
| `backend/src/config.ts` (modify)                             | `journey.apiKey` from `JOURNEY_API_KEY`           |
| `backend/.env.sample` (modify)                               | document the var                                  |
| `backend/src/routes/journeyApiKey.ts` (create)               | the header check                                  |
| `backend/src/routes/tests/journeyApiKey.test.ts` (create)    | its tests                                         |
| `backend/src/services/public-api/project-export.ts` (create) | pure filter + map                                 |
| `backend/src/services/public-api/tests/project-export.test.ts` (create) | its tests                               |
| `backend/src/controllers/publicProjects.ts` (create)         | the four collection reads                         |
| `backend/src/routes/public.ts` (create)                      | the single route                                  |
| `backend/src/routes/index.ts` (modify)                       | mount it, log it as Journey                       |

---

### Task 1: Config and env var

**Files:**
- Modify: `backend/src/config.ts`
- Modify: `backend/.env.sample`

No test: this is a literal read of `process.env`, the same as every other entry in the file.

- [ ] **Step 1: Add the config value**

In `backend/src/config.ts`, in the `appConfig` object, immediately after the `jwt: {...}` block:

```ts
  journey: {
    apiKey: process.env.JOURNEY_API_KEY || '',
  },
```

- [ ] **Step 2: Add it to the IConfig interface**

In the same file, in `interface IConfig`, immediately after the `jwt: {...}` block:

```ts
  /** The Journey app, consumer of /api/public */
  journey: {
    /** When empty, /api/public rejects every request */
    apiKey: string;
  };
```

- [ ] **Step 3: Document the env var**

At the end of `backend/.env.sample`:

```
# The Journey app, consumer of GET /api/public/projects
# Empty disables the endpoint (every request 401s)
JOURNEY_API_KEY=
```

- [ ] **Step 4: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: exit 0, no output.

- [ ] **Step 5: Commit**

```bash
git add backend/src/config.ts backend/.env.sample
git commit -m "config: JOURNEY_API_KEY for the public projects API"
```

---

### Task 2: The API key middleware

**Files:**
- Create: `backend/src/routes/journeyApiKey.ts`
- Create: `backend/src/routes/tests/journeyApiKey.test.ts`
- Modify: `backend/src/models/technical.ts`

The middleware is a factory that takes the expected key, so the tests never have to mock `config`. This mirrors `jwtMiddleware`, which is also a factory.

- [ ] **Step 1: Write the failing test**

Create `backend/src/routes/tests/journeyApiKey.test.ts`:

```ts
import {Request, Response, NextFunction} from 'express';
import {journeyApiKeyMiddleware} from '../journeyApiKey';
import {ConfacRequest} from '../../models/technical';

const makeReq = (apiKey?: string): Request => ({
  header: (name: string) => (name === 'X-Api-Key' ? apiKey : undefined),
} as unknown as Request);

const runMiddleware = (req: Request, expectedKey: string) => new Promise<Error | undefined>(resolve => {
  const next: NextFunction = (err?: unknown) => resolve(err as Error | undefined);
  journeyApiKeyMiddleware(expectedKey)(req, {} as Response, next);
});

describe('routes :: journey api key middleware', () => {
  it('calls next() without an error for the right key', async () => {
    const err = await runMiddleware(makeReq('s3cret'), 's3cret');
    expect(err).toBeUndefined();
  });

  it('labels the request as Journey for the logger', async () => {
    const req = makeReq('s3cret');
    await runMiddleware(req, 's3cret');
    expect((req as ConfacRequest).apiConsumer).toBe('Journey');
  });

  it('is unauthorized for a wrong key', async () => {
    const err = await runMiddleware(makeReq('wrong'), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized for a key of a different length', async () => {
    const err = await runMiddleware(makeReq('way-way-way-longer'), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized without the header', async () => {
    const err = await runMiddleware(makeReq(), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized when no key is configured', async () => {
    const err = await runMiddleware(makeReq(''), '');
    expect(err?.name).toBe('UnauthorizedError');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `cd backend && bunx vitest run src/routes/tests/journeyApiKey.test.ts`
Expected: FAIL — `Failed to resolve import "../journeyApiKey"`.

- [ ] **Step 3: Add apiConsumer to ConfacRequest**

In `backend/src/models/technical.ts`, replace the `ConfacRequest` interface with:

```ts
export interface ConfacRequest extends Request {
  user: Jwt;
  /** Set instead of user when authenticated with an API key */
  apiConsumer?: string;
}
```

- [ ] **Step 4: Write the middleware**

Create `backend/src/routes/journeyApiKey.ts`:

```ts
import {createHash, timingSafeEqual} from 'crypto';
import {Request, Response, NextFunction} from 'express';
import {UnauthorizedError} from './jwt';
import {ConfacRequest} from '../models/technical';

/** Hashing first keeps the comparison constant-time for keys of a different length */
const keysMatch = (provided: string, expected: string): boolean => timingSafeEqual(
  createHash('sha256').update(provided).digest(),
  createHash('sha256').update(expected).digest(),
);

export const journeyApiKeyMiddleware = (expectedKey: string) => (req: Request, _res: Response, next: NextFunction): void => {
  const providedKey = req.header('X-Api-Key');
  if (!expectedKey || !providedKey || !keysMatch(providedKey, expectedKey)) {
    return next(new UnauthorizedError('credentials_required', 'Invalid API key'));
  }

  (req as ConfacRequest).apiConsumer = 'Journey';
  return next();
};
```

- [ ] **Step 5: Run the tests**

Run: `cd backend && bunx vitest run src/routes/tests/journeyApiKey.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add backend/src/routes/journeyApiKey.ts backend/src/routes/tests/journeyApiKey.test.ts backend/src/models/technical.ts
git commit -m "api: X-Api-Key middleware for the Journey app"
```

---

### Task 3: Backend models catch up with the stored documents

**Files:**
- Create: `backend/src/models/contracts.ts`
- Modify: `backend/src/models/projects.ts`
- Modify: `backend/src/models/clients.ts`

`backend/src/models/projects.ts` predates several fields that the frontend
writes (`frontend/src/components/project/models/IProjectModel.ts` is the
accurate shape). The mapper needs `accountManager`, `contract`, `endCustomer`
and `forEndCustomer`; `IClient` needs `frameworkAgreement`. No test: these are
type declarations only, the compiler is the test.

- [ ] **Step 1: Create the contract model**

Create `backend/src/models/contracts.ts`:

```ts
export type ContractStatus = 'NoContract' | 'Sent' | 'Verified' | 'WeSigned' | 'TheySigned' | 'BothSigned' | 'NotNeeded';

export interface IContract {
  status: ContractStatus;
  notes: string;
}
```

- [ ] **Step 2: Extend IProject**

In `backend/src/models/projects.ts`, add the import at the top:

```ts
import {IContract} from './contracts';
```

Then add these fields to `interface IProject`, after `endDate?: string;`:

```ts
  /** UserId */
  accountManager?: string;
  contract?: IContract;
  /** We invoice the client but the project is at an endCustomer */
  forEndCustomer?: boolean;
  endCustomer?: ProjectEndCustomerModel | null;
```

And below the `ProjectClientModel` interface in the same file:

```ts
export interface ProjectEndCustomerModel {
  clientId: string;
  contact: string;
  notes: string;
}
```

- [ ] **Step 3: Extend IClient**

In `backend/src/models/clients.ts`, add the import at the top:

```ts
import {IContract} from './contracts';
```

And add to `interface IClient`, after `attachments: IAttachment[];`:

```ts
  frameworkAgreement?: IContract;
```

- [ ] **Step 4: Typecheck**

Run: `cd backend && bun run typecheck`
Expected: exit 0, no output.

- [ ] **Step 5: Commit**

```bash
git add backend/src/models/contracts.ts backend/src/models/projects.ts backend/src/models/clients.ts
git commit -m "models: add the project contract, accountManager and endCustomer fields"
```

---

### Task 4: The pure export mapper

**Files:**
- Create: `backend/src/services/public-api/project-export.ts`
- Create: `backend/src/services/public-api/tests/project-export.test.ts`

This is where all the logic lives. It takes plain arrays and a `today`, so every
date rule is testable without freezing the clock.

- [ ] **Step 1: Write the failing tests**

Create `backend/src/services/public-api/tests/project-export.test.ts`:

```ts
import moment from 'moment';
import {ObjectID} from 'mongodb';
import {getJourneyProjects} from '../project-export';
import {IProject} from '../../../models/projects';
import {IConsultant} from '../../../models/consultants';
import {IClient} from '../../../models/clients';
import {IUser} from '../../../models/user';

const today = moment('2026-09-14');

type ProjectOptions = {
  consultantId?: string;
  accountManager?: string;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  endCustomerId?: string;
  forEndCustomer?: boolean;
  contractStatus?: string;
};

const buildProject = (options: ProjectOptions = {}) => ({
  _id: new ObjectID('000000000000000000000001'),
  consultantId: options.consultantId || 'c1',
  accountManager: options.accountManager,
  startDate: options.startDate || '2026-01-01',
  endDate: options.endDate,
  client: {clientId: options.clientId || 'kl1'},
  forEndCustomer: options.forEndCustomer ?? !!options.endCustomerId,
  endCustomer: options.endCustomerId ? {clientId: options.endCustomerId, contact: 'Jos', notes: ''} : null,
  contract: options.contractStatus ? {status: options.contractStatus, notes: ''} : undefined,
} as unknown as IProject);

const buildConsultant = (id = 'c1', type = 'consultant') => ({
  _id: id,
  firstName: 'Jos',
  name: 'Vermeulen',
  email: 'jos@itenium.be',
  type,
} as unknown as IConsultant);

const buildUser = (id = 'u1') => ({
  _id: id,
  firstName: 'Wouter',
  name: 'Vanschandevijl',
  email: 'wouter@itenium.be',
} as unknown as IUser);

const buildClient = (id = 'kl1', name = 'KBC', frameworkStatus?: string) => ({
  _id: id,
  name,
  frameworkAgreement: frameworkStatus ? {status: frameworkStatus, notes: ''} : undefined,
} as unknown as IClient);

const run = (projects: IProject[], consultants = [buildConsultant()], users = [buildUser()], clients = [buildClient()]) =>
  getJourneyProjects(projects, consultants, users, clients, today);


describe('getJourneyProjects :: which projects', () => {
  it('includes a project without an end date', () => {
    expect(run([buildProject()])).toHaveLength(1);
  });

  it('includes a project that ended two months ago', () => {
    expect(run([buildProject({endDate: '2026-07-20'})])).toHaveLength(1);
  });

  it('excludes a project that ended four months ago', () => {
    expect(run([buildProject({endDate: '2026-05-20'})])).toHaveLength(0);
  });

  it('includes a project that has not started yet', () => {
    expect(run([buildProject({startDate: '2026-12-01'})])).toHaveLength(1);
  });

  it('excludes a freelancer', () => {
    expect(run([buildProject()], [buildConsultant('c1', 'freelancer')])).toHaveLength(0);
  });

  it('excludes a manager and an externalConsultant', () => {
    const projects = [buildProject({consultantId: 'c1'}), buildProject({consultantId: 'c2'})];
    const consultants = [buildConsultant('c1', 'manager'), buildConsultant('c2', 'externalConsultant')];
    expect(run(projects, consultants)).toHaveLength(0);
  });

  it('excludes a project of an unknown consultant', () => {
    expect(run([buildProject({consultantId: 'nope'})])).toHaveLength(0);
  });
});


describe('getJourneyProjects :: mapping', () => {
  it('maps the project itself', () => {
    const [project] = run([buildProject({startDate: '2026-01-01', endDate: '2026-09-30'})]);
    expect(project.id).toBe('000000000000000000000001');
    expect(project.startDate).toBe('2026-01-01');
    expect(project.endDate).toBe('2026-09-30');
  });

  it('has a null endDate when the project has no end date', () => {
    expect(run([buildProject()])[0].endDate).toBeNull();
  });

  it('maps the consultant', () => {
    expect(run([buildProject()])[0].consultant).toEqual({
      id: 'c1',
      name: 'Jos Vermeulen',
      email: 'jos@itenium.be',
    });
  });

  it('maps the account manager', () => {
    expect(run([buildProject({accountManager: 'u1'})])[0].accountManager).toEqual({
      id: 'u1',
      name: 'Wouter Vanschandevijl',
      email: 'wouter@itenium.be',
    });
  });

  it('has no account manager when the project has none', () => {
    expect(run([buildProject()])[0].accountManager).toBeNull();
  });

  it('has no account manager when the user no longer exists', () => {
    expect(run([buildProject({accountManager: 'gone'})])[0].accountManager).toBeNull();
  });

  it('maps the client', () => {
    expect(run([buildProject()])[0].client).toEqual({id: 'kl1', name: 'KBC'});
  });

  it('maps the end customer', () => {
    const clients = [buildClient(), buildClient('kl2', 'Ergo')];
    const [project] = run([buildProject({endCustomerId: 'kl2'})], undefined, undefined, clients);
    expect(project.endCustomer).toEqual({id: 'kl2', name: 'Ergo'});
  });

  it('has no end customer when the project is not for one', () => {
    expect(run([buildProject()])[0].endCustomer).toBeNull();
  });

  it('has no end customer when forEndCustomer is off', () => {
    const clients = [buildClient(), buildClient('kl2', 'Ergo')];
    const projects = [buildProject({endCustomerId: 'kl2', forEndCustomer: false})];
    expect(run(projects, undefined, undefined, clients)[0].endCustomer).toBeNull();
  });

  it('maps both contract statuses', () => {
    const clients = [buildClient('kl1', 'KBC', 'BothSigned')];
    const [project] = run([buildProject({contractStatus: 'Sent'})], undefined, undefined, clients);
    expect(project.contract).toEqual({frameworkAgreement: 'BothSigned', project: 'Sent'});
  });

  it('falls back to NoContract for both statuses', () => {
    expect(run([buildProject()])[0].contract).toEqual({
      frameworkAgreement: 'NoContract',
      project: 'NoContract',
    });
  });
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `cd backend && bunx vitest run src/services/public-api/tests/project-export.test.ts`
Expected: FAIL — `Failed to resolve import "../project-export"`.

- [ ] **Step 3: Write the mapper**

Create `backend/src/services/public-api/project-export.ts`:

```ts
import moment from 'moment';
import {IProject} from '../../models/projects';
import {IConsultant} from '../../models/consultants';
import {IClient} from '../../models/clients';
import {IUser} from '../../models/user';
import {ContractStatus} from '../../models/contracts';

/** How long a finished project stays in the export */
const KEEP_ENDED_PROJECTS_FOR_MONTHS = 3;

type JourneyPerson = {
  id: string;
  name: string;
  email: string;
};

type JourneyClient = {
  id: string;
  name: string;
};

type JourneyProject = {
  id: string;
  startDate: string;
  endDate: string | null;
  consultant: JourneyPerson;
  accountManager: JourneyPerson | null;
  client: JourneyClient | null;
  endCustomer: JourneyClient | null;
  contract: {
    frameworkAgreement: ContractStatus;
    project: ContractStatus;
  };
};

const toPerson = (person: IConsultant | IUser): JourneyPerson => ({
  id: person._id.toString(),
  name: `${person.firstName} ${person.name}`,
  email: person.email,
});

const toClient = (client?: IClient): JourneyClient | null => (client ? {id: client._id.toString(), name: client.name} : null);

const isRunning = (project: IProject, today: moment.Moment): boolean => {
  if (!project.endDate) {
    return true;
  }
  return moment(project.endDate).isSameOrAfter(today.clone().subtract(KEEP_ENDED_PROJECTS_FOR_MONTHS, 'months'));
};

export function getJourneyProjects(
  projects: IProject[],
  consultants: IConsultant[],
  users: IUser[],
  clients: IClient[],
  today: moment.Moment = moment(),
): JourneyProject[] {
  const consultantsById = new Map(consultants.map(c => [c._id.toString(), c]));
  const usersById = new Map(users.map(u => [u._id.toString(), u]));
  const clientsById = new Map(clients.map(c => [c._id.toString(), c]));

  return projects.flatMap(project => {
    const consultant = consultantsById.get(project.consultantId);
    if (consultant?.type !== 'consultant' || !isRunning(project, today)) {
      return [];
    }

    const accountManager = project.accountManager ? usersById.get(project.accountManager) : undefined;
    const endCustomerId = project.forEndCustomer ? project.endCustomer?.clientId : undefined;
    const client = clientsById.get(project.client.clientId);

    return [{
      id: project._id.toString(),
      startDate: moment(project.startDate).format('YYYY-MM-DD'),
      endDate: project.endDate ? moment(project.endDate).format('YYYY-MM-DD') : null,
      consultant: toPerson(consultant),
      accountManager: accountManager ? toPerson(accountManager) : null,
      client: toClient(client),
      endCustomer: toClient(endCustomerId ? clientsById.get(endCustomerId) : undefined),
      contract: {
        frameworkAgreement: client?.frameworkAgreement?.status || 'NoContract',
        project: project.contract?.status || 'NoContract',
      },
    }];
  });
}
```

- [ ] **Step 4: Run the tests**

Run: `cd backend && bunx vitest run src/services/public-api/tests/project-export.test.ts`
Expected: PASS, 19 tests.

- [ ] **Step 5: Commit**

```bash
git add backend/src/services/public-api
git commit -m "api: map projects to the Journey export shape"
```

---

### Task 5: Controller, router and wiring

**Files:**
- Create: `backend/src/controllers/publicProjects.ts`
- Create: `backend/src/routes/public.ts`
- Modify: `backend/src/routes/index.ts`

The controller is four `find().toArray()` calls and a delegation, so it gets no
test of its own; the logic it delegates to is already covered by Task 4.

- [ ] **Step 1: Write the controller**

Create `backend/src/controllers/publicProjects.ts`:

```ts
import {Request, Response} from 'express';
import {CollectionNames} from '../models/common';
import {IProject} from '../models/projects';
import {IConsultant} from '../models/consultants';
import {IClient} from '../models/clients';
import {IUser} from '../models/user';
import {getJourneyProjects} from '../services/public-api/project-export';

export const getPublicProjectsController = async (req: Request, res: Response) => {
  const [projects, consultants, users, clients] = await Promise.all([
    req.db.collection<IProject>(CollectionNames.PROJECTS).find().toArray(),
    req.db.collection<IConsultant>(CollectionNames.CONSULTANTS).find().toArray(),
    req.db.collection<IUser>(CollectionNames.USERS).find().toArray(),
    req.db.collection<IClient>(CollectionNames.CLIENTS).find().toArray(),
  ]);

  return res.send(getJourneyProjects(projects, consultants, users, clients));
};
```

- [ ] **Step 2: Write the router**

Create `backend/src/routes/public.ts`:

```ts
import {Router} from 'express';
import {getPublicProjectsController} from '../controllers/publicProjects';

const publicRouter = Router();

publicRouter.get('/projects', getPublicProjectsController);

export default publicRouter;
```

- [ ] **Step 3: Log API key traffic under its consumer name**

In `backend/src/routes/index.ts`, inside `useLogger`, replace:

```ts
  const user = confacReq.user?.data?.alias ?? confacReq.user?.data?._id;
```

with:

```ts
  const user = confacReq.user?.data?.alias ?? confacReq.user?.data?._id ?? confacReq.apiConsumer;
```

- [ ] **Step 4: Mount the router**

In `backend/src/routes/index.ts`, add the imports next to the other router imports:

```ts
import {journeyApiKeyMiddleware} from './journeyApiKey';
import publicRouter from './public';
```

And mount it next to the billit webhooks, after the `withSecurity` if/else, replacing the `appRouter.use('/billit/webhooks', ...)` line with:

```ts
appRouter.use('/billit/webhooks', useLogger, billitWebhooksRouters);
appRouter.use('/public', journeyApiKeyMiddleware(config.journey.apiKey), useLogger, publicRouter);
```

`config` is already imported at the top of the file. Mounting outside the
`withSecurity` branch is deliberate: the key is required in development too.

- [ ] **Step 5: Verify the whole backend**

Run: `cd backend && bun run test && bun run typecheck && bun run lint && bun run knip`
Expected: all tests pass (was 230, now 255), typecheck exit 0, lint and knip no output.

- [ ] **Step 6: Commit**

```bash
git add backend/src/controllers/publicProjects.ts backend/src/routes/public.ts backend/src/routes/index.ts
git commit -m "api: GET /api/public/projects for the Journey app"
```

---

### Task 6: Verify against a running backend

**Files:** none

- [ ] **Step 1: Set a local key**

Add to `backend/.env`:

```
JOURNEY_API_KEY=local-dev-key
```

- [ ] **Step 2: Start the backend**

Run: `cd backend && bun run start`

- [ ] **Step 3: Check that a missing key is refused**

Run: `curl -s -o /dev/null -w '%{http_code}' http://localhost:9000/api/public/projects`
Expected: `401`

- [ ] **Step 4: Check that a wrong key is refused**

Run: `curl -s -o /dev/null -w '%{http_code}' -H 'X-Api-Key: nope' http://localhost:9000/api/public/projects`
Expected: `401`

- [ ] **Step 5: Check that the right key returns projects**

Run: `curl -s -H 'X-Api-Key: local-dev-key' http://localhost:9000/api/public/projects | head -c 2000`
Expected: a JSON array whose entries have `consultant`, `accountManager`, `client`, `endCustomer` and `contract`.

- [ ] **Step 6: Check that the key opens nothing else**

Run: `curl -s -o /dev/null -w '%{http_code}' -H 'X-Api-Key: local-dev-key' http://localhost:9000/api/clients`
Expected: `401` when running with security on. With security off this returns `200` because `/api/clients` is unauthenticated in that mode — that is the existing dev behaviour, not a leak through the API key.

- [ ] **Step 7: Stop the backend**

Ctrl-C in the terminal running it.

---

## Deployment

Set `JOURNEY_API_KEY` in Coolify to a freshly generated secret
(`openssl rand -hex 32`) and redeploy. Until it is set, the endpoint 401s every
request. Hand the key to the Journey app out of band; it is not stored in the
repository and there is no UI for it.
