import moment from 'moment';
import {getTimesheetExcelRows} from '../timesheet-excel/getTimesheetExcelRows';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';
import {ConsultantModel, ConsultantType} from '../models/ConsultantModel';
import {UserModel} from '../../users/models/UserModel';
import {IComment} from '../../../models';


const users = [
  {_id: 'user-1', alias: 'wouter'},
  {_id: 'user-2', alias: 'jos'},
] as UserModel[];


const comment = (createdBy: string, createdOn: string, text: string): IComment => ({
  createdBy,
  createdOn,
  comment: text,
});


type ProjectMonthConfig = {
  month: string;
  firstName?: string;
  name?: string;
  type?: ConsultantType;
  timesheet?: number;
  check?: number;
  comments?: IComment[];
};

const projectMonth = (config: ProjectMonthConfig): FullProjectMonthModel => new FullProjectMonthModel({
  details: {
    month: moment(config.month, 'YYYY-MM'),
    timesheet: {
      timesheet: config.timesheet,
      check: config.check,
      validated: false,
      comments: config.comments || [],
    },
  },
  consultant: {
    firstName: config.firstName || 'Wouter',
    name: config.name || 'Vanschandevijl',
    type: config.type || 'consultant',
  } as ConsultantModel,
} as never);


describe('getTimesheetExcelRows', () => {
  it('returns a row per timesheet comment', () => {
    const projectMonths = [projectMonth({
      month: '2026-07',
      timesheet: 20,
      check: 19.5,
      comments: [
        comment('user-1', '2026-07-02T10:00:00.000Z', 'First'),
        comment('user-2', '2026-07-03T10:00:00.000Z', 'Second'),
      ],
    })];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-07', 'YYYY-MM'));

    expect(rows).toEqual([
      ['2026-07', 'Wouter Vanschandevijl', 'consultant', 20, 19.5, 'wouter', '2026-07-02T10:00:00.000Z', 'First'],
      ['2026-07', 'Wouter Vanschandevijl', 'consultant', 20, 19.5, 'jos', '2026-07-03T10:00:00.000Z', 'Second'],
    ]);
  });

  it('returns a single row with blank comment columns when there are no comments', () => {
    const projectMonths = [projectMonth({month: '2026-07', timesheet: 20})];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-07', 'YYYY-MM'));

    expect(rows).toEqual([
      ['2026-07', 'Wouter Vanschandevijl', 'consultant', 20, null, '', '', ''],
    ]);
  });

  it('defaults the end month to the start month', () => {
    const projectMonths = [
      projectMonth({month: '2026-06'}),
      projectMonth({month: '2026-07'}),
      projectMonth({month: '2026-08'}),
    ];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-07', 'YYYY-MM'));

    expect(rows.map(row => row[0])).toEqual(['2026-07']);
  });

  it('includes both bounds of the month range', () => {
    const projectMonths = [
      projectMonth({month: '2026-05'}),
      projectMonth({month: '2026-06'}),
      projectMonth({month: '2026-07'}),
      projectMonth({month: '2026-08'}),
    ];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-06', 'YYYY-MM'), moment('2026-07', 'YYYY-MM'));

    expect(rows.map(row => row[0])).toEqual(['2026-06', '2026-07']);
  });

  it('strips html from the comment', () => {
    const projectMonths = [projectMonth({
      month: '2026-07',
      comments: [comment('user-1', '2026-07-02T10:00:00.000Z', '<p>Sick <strong>leave</strong></p><p>3 &amp; 4 july</p>')],
    })];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-07', 'YYYY-MM'));

    expect(rows[0][7]).toBe('Sick leave 3 & 4 july');
  });

  it('falls back to the user id when the user is unknown', () => {
    const projectMonths = [projectMonth({
      month: '2026-07',
      comments: [comment('deleted-user', '2026-07-02T10:00:00.000Z', 'Hi')],
    })];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-07', 'YYYY-MM'));

    expect(rows[0][5]).toBe('deleted-user');
  });

  it('sorts by consultant, month and comment date', () => {
    const projectMonths = [
      projectMonth({month: '2026-07', firstName: 'Jos', name: 'Vermeulen'}),
      projectMonth({
        month: '2026-06',
        comments: [
          comment('user-1', '2026-06-20T10:00:00.000Z', 'Later'),
          comment('user-1', '2026-06-10T10:00:00.000Z', 'Earlier'),
        ],
      }),
      projectMonth({month: '2026-07'}),
    ];

    const rows = getTimesheetExcelRows(projectMonths, users, moment('2026-06', 'YYYY-MM'), moment('2026-07', 'YYYY-MM'));

    expect(rows.map(row => [row[1], row[0], row[7]])).toEqual([
      ['Jos Vermeulen', '2026-07', ''],
      ['Wouter Vanschandevijl', '2026-06', 'Earlier'],
      ['Wouter Vanschandevijl', '2026-06', 'Later'],
      ['Wouter Vanschandevijl', '2026-07', ''],
    ]);
  });
});
