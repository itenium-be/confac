---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Comprehensive Playwright E2E test strategy for confac - behavioral contract between old and new systems'
session_goals: 'Identify coverage strategy, design portable tests with data-testid selectors, ensure behavior validation not implementation testing'
selected_approach: 'AI-Recommended Techniques'
techniques_used: ['Question Storming', 'Morphological Analysis']
ideas_generated: []
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Wouter
**Date:** 2026-02-21

## Session Overview

**Topic:** Comprehensive Playwright E2E test strategy for confac - behavioral contract between old and new systems

**Goals:**
- Identify what to test (coverage strategy)
- Design portable tests using `data-testid` selectors
- Ensure tests validate behavior, not implementation

**Key Constraint:** Tests serve as the "source of truth" - passing on both systems validates the rewrite

## Strategic Decisions

### Infrastructure

| Decision | Answer |
|----------|--------|
| Starting point | Fork/use `itenium-be/confac-playwright` repo |
| `data-testid` | Add as needed, consistent naming |
| Coverage goal | 100% |
| CI/CD | Nightly runs |
| Process | Write tests on current system → then rewrite |

### Test Environment (Docker Compose per test file)

**Real services:**
- Express backend
- Database (fresh copy from baseline per test file)
- React frontend

**Mocks:**
- Peppol/Billit: External container with `/prime` + `/calls` endpoints, stateful
- Excel-creator: External container with `/prime` + `/calls` endpoints
- Email: Internal interface substitution (not external mock)

**Baseline data:**
- Small realistic dataset: users, roles, consultant, client, project, invoices

### Authentication
- Login via name input field (not Google)
- Test as different claim combinations

### Test Organization

**Pattern:** Page Object Model (POM)

```
tests/
  pages/                    # Page Object Models
    consultant.page.ts
    client.page.ts
    invoice.page.ts
    ...

  specs/
    entities/
      consultant.spec.ts
      client.spec.ts
      project.spec.ts
      project-month.spec.ts
      invoice.spec.ts
      user.spec.ts
      roles-claims.spec.ts
      attachments.spec.ts
      audit.spec.ts
      config.spec.ts
      reports.spec.ts

    ui-behaviors/
      filtering.spec.ts
      sorting.spec.ts
      pagination.spec.ts

    flows/
      invoice-flow.spec.ts

    claims/
      claim-enforcement.spec.ts

    integrations/
      peppol.spec.ts
      excel.spec.ts
```

## Coverage Matrix

### Entities

| Entity | CRUD | Special Actions |
|--------|------|-----------------|
| Consultant | ✓ | - |
| Client | ✓ | - |
| Project | ✓ | - |
| Project Month | ✓ | Fill in, create new month logic |
| Invoice | ✓ | Email, Preview, Download, Credit notes, Comments, Send to Peppol |
| Users | ✓ | - |
| Roles/Claims | ✓ | - |
| Attachments | ✓ | Download |
| Audit | Read only | Filter/Search |
| Config | Read/Update | - |
| Reports | Read | Filter, Export |

### UI Behaviors (across list views)
- Filtering
- Sorting
- Pagination

### Claims Testing
- With claim → action allowed
- Without claim → action denied

### Integration Scenarios (Peppol/Billit)
- Success
- Connection timeout
- Rejected invoice
- Invalid response
- Partial success

### Delete Behavior
- Soft delete: most entities
- Hard delete: only when not linked to other entities

### Business Logic
- Date checks
- Create new month logic
- Other rules discovered from source code

## Golden Path Flow

```
Consultant → Client → Project → Project Month → Fill in → Invoice → Peppol/Billit
```

## Done Criteria

**100% coverage = all tests pass on new .NET system = ready to switch**

## Next Steps

1. Audit `itenium-be/confac-playwright` for existing POMs and tests
2. Set up Docker infrastructure (mocks, DB per file)
3. Add `data-testid` attributes to current confac as needed
4. Complete CRUD tests for all entities
5. Add business logic tests (discovered from source code)
6. Add flow tests
7. Add integration tests with mock failure scenarios
8. Run nightly in CI
9. Begin .NET rewrite
10. Verify all tests pass on new system
