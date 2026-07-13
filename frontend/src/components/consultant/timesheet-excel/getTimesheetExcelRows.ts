import {Moment} from 'moment';
import DOMPurify from 'dompurify';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';
import {UserModel} from '../../users/models/UserModel';
import {IComment} from '../../../models';

export type TimesheetExcelRow = [
  month: string,
  consultant: string,
  consultantType: string,
  timesheet: number | null,
  check: number | null,
  commentCreatedBy: string,
  commentCreatedOn: string,
  comment: string,
];


/** Excel has no rich text: flatten the comment editor html to a single line */
const stripHtml = (html: string): string => {
  const spaced = html.replace(/<\/(p|div|li|h[1-6]|tr)>|<br\s*\/?>/gi, ' ');
  const text = DOMPurify.sanitize(spaced, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
  const decoded = new DOMParser().parseFromString(text, 'text/html').documentElement.textContent || '';
  return decoded.replace(/\s+/g, ' ').trim();
};


const byCreatedOn = (a: IComment, b: IComment): number => a.createdOn.localeCompare(b.createdOn);


export function getTimesheetExcelRows(
  projectMonths: FullProjectMonthModel[],
  users: UserModel[],
  from: Moment,
  to?: Moment | null,
): TimesheetExcelRow[] {
  const start = from.clone().startOf('month');
  const end = (to || from).clone().endOf('month');

  return projectMonths
    .filter(fpm => fpm.details.month.isBetween(start, end, undefined, '[]'))
    .sort((a, b) => a.consultantName.localeCompare(b.consultantName) || a.details.month.valueOf() - b.details.month.valueOf())
    .flatMap(fpm => {
      const {timesheet} = fpm.details;
      const details: [string, string, string, number | null, number | null] = [
        fpm.details.month.format('YYYY-MM'),
        fpm.consultantName,
        fpm.consultant.type,
        timesheet.timesheet ?? null,
        timesheet.check ?? null,
      ];

      const comments = [...(timesheet.comments || [])].sort(byCreatedOn);
      if (!comments.length) {
        return [[...details, '', '', ''] as TimesheetExcelRow];
      }

      return comments.map((comment): TimesheetExcelRow => [
        ...details,
        users.find(user => user._id === comment.createdBy)?.alias || comment.createdBy,
        comment.createdOn,
        stripHtml(comment.comment),
      ]);
    });
}
