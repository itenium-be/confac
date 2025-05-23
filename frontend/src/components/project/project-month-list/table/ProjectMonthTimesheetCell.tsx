import {useDispatch} from 'react-redux';
import cn from 'classnames';
import {ProjectMonthTimesheet} from '../../models/ProjectMonthModel';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {t} from '../../../utils';
import {ValidityToggleButton} from '../../../controls/form-controls/button/ValidityToggleButton';
import {projectMonthUpload, patchProjectsMonth} from '../../../../actions/projectActions';
import {getNewProjectMonthTimesheet} from '../../models/getNewProject';
import {useDebouncedSave} from '../../../hooks/useDebounce';
import {BasicMathInput} from '../../../controls/form-controls/inputs/BasicMathInput';
import {getDownloadUrl} from '../../../../actions/utils/download-helpers';
import {TimesheetTimeConfig, getAmountInDays} from '../../../invoice/controls/InvoiceLineTypeSelect';
import {AttachmentUploadPreviewButtons} from '../../controls/AttachmentUploadPreviewButtons';
import {SignedTimesheetAttachmentType} from '../../../../models';
import {Claim} from '../../../users/models/UserModel';
import {NotesWithCommentsModalButton} from '../../../controls/form-controls/button/NotesWithCommentsModalButton';

interface ProjectMonthTimesheetCellProps {
  fullProjectMonth: FullProjectMonthModel;
}
const ViewportWidths = {showTimesheetDaysFrom: 1800};


/** Display timesheet number in days */
const TimesheetTimeDisplay = (props: TimesheetTimeConfig) => {
  if (typeof props.amount !== 'number') {
    return <span>&nbsp;</span>;
  }

  const days = getAmountInDays(props);
  const vpWidth = window.innerWidth;
  if (vpWidth > ViewportWidths.showTimesheetDaysFrom && days.toString().length < 5) {
    return <span>{t('client.daysWorked', {days})}</span>;
  }

  return <span>{days}</span>;
};




/** Timesheet form cell for a ProjectMonth row */
export const ProjectMonthTimesheetCell = ({fullProjectMonth}: ProjectMonthTimesheetCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = fullProjectMonth.details.timesheet || getNewProjectMonthTimesheet();
  const dispatcher = (val: ProjectMonthTimesheet) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, timesheet: val}) as any);
  };
  const [timesheet, setTimesheet, saveTimesheet] = useDebouncedSave<ProjectMonthTimesheet>(defaultValue, dispatcher);


  const projectConfig = fullProjectMonth.project.projectMonthConfig;
  const timesheetConfig: TimesheetTimeConfig = {
    rateType: fullProjectMonth.project.client.defaultInvoiceLines[0].type,
    amount: timesheet.timesheet,
    hoursInDay: fullProjectMonth.project.client.hoursInDay ?? fullProjectMonth.client.hoursInDay,
  };

  const timesheetCheckConfig: TimesheetTimeConfig = {
    // TODO: Hardcoded "daily" for timesheetCheck: daily/hourly should be a global config setting
    rateType: 'daily',
    amount: timesheet.check,
    hoursInDay: fullProjectMonth.project.client.hoursInDay ?? fullProjectMonth.client.hoursInDay,
  };


  const timesheetAmount = getAmountInDays(timesheetConfig);
  const canToggleValid = !(
    typeof timesheet.timesheet === 'number'
    && (timesheetAmount === timesheet.check || timesheet.note || !projectConfig.timesheetCheck || timesheet.comments?.length)
  );

  const timesheetDetails = fullProjectMonth.invoice
    ? fullProjectMonth.invoice.attachments.find(a => a.type === SignedTimesheetAttachmentType)
    : fullProjectMonth.details.attachments.find(a => a.type === SignedTimesheetAttachmentType);

  const hasTimesheetBeenUploaded = !!timesheetDetails;

  const getTimesheetDownloadUrl = (): string => {
    const {invoice} = fullProjectMonth;
    const projectMonthId = fullProjectMonth._id;

    if (!timesheetDetails)
      return '';

    const {fileName} = timesheetDetails;

    if (invoice) {
      return getDownloadUrl('invoice', invoice._id, SignedTimesheetAttachmentType, fileName, 'preview');
    }
    return getDownloadUrl('project_month', projectMonthId, SignedTimesheetAttachmentType, fileName, 'preview');
  };

  const timesheetValid = timesheet.validated || fullProjectMonth.details.verified === 'forced';
  const timesheetFileName = '{month}-{consultant}-Timesheet'
    .replace('{consultant}', `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`)
    .replace('{month}', fullProjectMonth.details.month.format('YYYY-MM'));

  return (
    <div className={cn('timesheet-cell')}>
      <BasicMathInput
        value={timesheet.timesheet}
        onChange={val => setTimesheet({...timesheet, timesheet: val})}
        placeholder={t(`projectMonth.timesheet${timesheetConfig.rateType}`)}
        display={timesheetValid && <TimesheetTimeDisplay {...timesheetConfig} />}
        float
      />

      {projectConfig.timesheetCheck ? (
        <BasicMathInput
          value={timesheet.check}
          onChange={val => setTimesheet({...timesheet, check: val})}
          placeholder={t('projectMonth.timesheetCheck')}
          display={timesheetValid && <TimesheetTimeDisplay {...timesheetCheckConfig} />}
          float
        />
      ) : <div />}

      <div className="timesheet-actions">
        <ValidityToggleButton
          claim={Claim.ValidateProjectMonthTimesheet}
          value={timesheet.validated}
          onChange={val => saveTimesheet({...timesheet, validated: val})}
          disabled={canToggleValid}
          title={{
            on: t('projectMonth.validateTimesheet'),
            off: t('projectMonth.unvalidateTimesheet'),
            disabled: t('projectMonth.validateTimesheetDisabled'),
          }}
        />
        <NotesWithCommentsModalButton
          claim={Claim.EditProjectMonth}
          value={{note: timesheet.note, comments: timesheet.comments || []}}
          onChange={val => saveTimesheet({...timesheet, note: val.note, comments: val.comments})}
          title={t('projectMonth.timesheetNote', {name: `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`})}
          showNote
        />
        <AttachmentUploadPreviewButtons
          isUploadDisabled={fullProjectMonth.details.timesheet.validated}
          isPreviewDisabled={!hasTimesheetBeenUploaded}
          uploadTooltip={t('projectMonth.timesheetUpload')}
          previewTooltip={t('projectMonth.viewTimesheet', {fileName: timesheetDetails ? timesheetDetails.fileName : ''})}
          onUpload={f => {
            const fileName = timesheetFileName + f.name.substring(f.name.lastIndexOf('.'));
            return dispatch(projectMonthUpload(f, SignedTimesheetAttachmentType, fullProjectMonth, fileName) as any);
          }}
          downloadUrl={getTimesheetDownloadUrl()}
        />
      </div>
    </div>
  );
};
