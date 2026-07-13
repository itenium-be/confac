# Consultant Timesheet Excel

## Goal

A "Timesheet excel" button on `/consultants` opens a modal with a start month (defaulting to the
current month) and an optional end month. Confirming downloads an xlsx with one row per timesheet
comment, for every project month in the selected range.

## Data flow

Mirrors the existing `FreelancerOverviewDownloadButton`: the frontend builds a 2D array of row
values from redux, POSTs it to a backend route, which attaches a column definition and forwards it
to the external excel microservice (`EXCEL_SERVICE_URL`).

Redux only holds the last `initialMonthLoad` months of project months, so the modal shows the same
`dataLoad.monthsLoaded` hint the freelancer modal shows.

## Frontend

| Piece                                            | File                                                            |
|--------------------------------------------------|-----------------------------------------------------------------|
| Button + modal                                   | `components/consultant/timesheet-excel/TimesheetExcelButton.tsx` |
| Pure row builder                                 | `components/consultant/timesheet-excel/getTimesheetExcelRows.ts` |
| `downloadTimesheetExcel(data, from, to)` thunk   | `actions/downloadActions.ts`                                     |
| `topToolbar`                                     | `components/consultant/ConsultantsList.tsx`                      |
| `consultant.timesheetExcel.*`                    | `trans.nl.ts` / `trans.en.ts`                                    |

`getTimesheetExcelRows(projectMonths, users, from, to)`:

- filters project months whose `details.month` falls within `[from, to]` inclusive; `to` defaults to
  the current month. No consultant type or active filter.
- emits one row per `details.timesheet.comments` entry, and one row with blank comment columns when a
  project month has no comments.
- resolves `comment.createdBy` (a userId) to the user's `alias`, falling back to the raw id.
- strips HTML from the comment body, decodes entities and collapses whitespace.
- sorts by consultant name, then month, then comment date.

## Backend

`generateTimesheetExcel` in `controllers/projectsMonth.ts`, routed as
`POST /projects/month/timesheet-excel`. Columns (Dutch, matching the existing exports):

```
Maand (String) | Consultant (String) | Consultant Type (String) | Timesheet (Decimal) | Check (Decimal)
| Comment door (String) | Comment op (Date) | Comment (String)
```

`freezeColumns: 3`.

## Testing

Vitest spec on the pure row builder: month range filtering (inclusive bounds, end defaulting to the
current month), one row per comment, blank-comment row, HTML stripping, unknown-user fallback.
