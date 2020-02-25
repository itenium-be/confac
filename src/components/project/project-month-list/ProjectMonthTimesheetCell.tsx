import React from 'react';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import useViewportSizes from 'use-viewport-sizes';
import {FullProjectMonthModel, ProjectMonthTimesheet} from '../models/ProjectMonthModel';
import {t} from '../../utils';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {UploadFileButton} from '../../controls/form-controls/button/UploadFileButton';
import {projectMonthUpload, patchProjectsMonth} from '../../../actions/projectActions';
import {getNewProjectMonthTimesheet} from '../models/getNewProject';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {BasicMathInput} from '../../controls/form-controls/inputs/BasicMathInput';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {AttachmentPreviewButton} from '../controls/AttachmentPreviewButton';
import {TimesheetTimeConfig, getAmountInDays} from '../../invoice/controls/InvoiceLineTypeSelect';

const ViewportWidths = {showTimesheetDaysFrom: 1600};


/** Display timesheet number in days */
const TimesheetTimeDisplay = (props: TimesheetTimeConfig) => {
  const [vpWidth] = useViewportSizes();

  if (typeof props.amount !== 'number') {
    return <span>&nbsp;</span>;
  }

  if (vpWidth > ViewportWidths.showTimesheetDaysFrom) {
    return <span>{t('client.daysWorked', {days: getAmountInDays(props)})}</span>;
  }

  return <span>{getAmountInDays(props)}</span>;
};






interface ProjectMonthTimesheetCellProps {
  projectMonth: FullProjectMonthModel;
}

/** Timesheet form cell for a ProjectMonth row */
export const ProjectMonthTimesheetCell = ({projectMonth}: ProjectMonthTimesheetCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = projectMonth.details.timesheet || getNewProjectMonthTimesheet();
  const dispatcher = (val: ProjectMonthTimesheet) => {
    dispatch(patchProjectsMonth({...projectMonth.details, timesheet: val}));
  };
  const [timesheet, setTimesheet, saveTimesheet] = useDebouncedSave<ProjectMonthTimesheet>(defaultValue, dispatcher);


  if (projectMonth.details.verified) {
    return <div />;
  }


  const timesheetConfig = {
    rateType: projectMonth.project.client.rateType,
    amount: timesheet.timesheet,
    hoursInDay: projectMonth.client.rate.hoursInDay,
  };

  const timesheetCheckConfig: TimesheetTimeConfig = {
    // TODO: Hardcoded "daily" for timesheetCheck: daily/hourly should be a global config setting
    rateType: 'daily',
    amount: timesheet.check,
    hoursInDay: projectMonth.client.rate.hoursInDay,
  };


  const projectConfig = projectMonth.project.projectMonthConfig;
  const timesheetAmount = getAmountInDays(timesheetConfig);
  const canToggleValid = !(
    timesheet.timesheet
    && (timesheetAmount === timesheet.check || timesheet.note || !projectConfig.timesheetCheck)
  );

  const hasTimesheetBeenUploaded = projectMonth.invoice
    ? projectMonth.invoice.attachments.some(a => a.type === 'timesheet')
    : projectMonth.details.attachments.some(a => a.type === 'timesheet');

  const getTimesheetDownloadUrl = () => {
    const {details, invoice} = projectMonth;
    const projectMonthId = projectMonth._id;
    const timesheetDetails = invoice
      ? invoice.attachments.find(a => a.type === 'timesheet')
      : details.attachments.find(a => a.type === 'timesheet');

    const {fileName} = timesheetDetails!;

    return getDownloadUrl('project_month', invoice ? invoice._id : projectMonthId, 'timesheet', fileName, 'preview');
  };


  return (
    <div className={cn('timesheet-cell')}>
      <>
        <BasicMathInput
          value={timesheet.timesheet}
          onChange={val => setTimesheet({...timesheet, timesheet: val})}
          placeholder={t(`projectMonth.timesheet${timesheetConfig.rateType}`)}
          display={timesheet.validated && (() => <TimesheetTimeDisplay {...timesheetConfig} />)}
          float
        />

        {projectConfig.timesheetCheck ? (
          <BasicMathInput
            value={timesheet.check}
            onChange={val => setTimesheet({...timesheet, check: val})}
            placeholder={t('projectMonth.timesheetCheck')}
            display={timesheet.validated && (() => <TimesheetTimeDisplay {...timesheetCheckConfig} />)}
            float
          />
        ) : <div />}
      </>

      <div className="timesheet-actions">
        <ValidityToggleButton
          value={timesheet.validated}
          onChange={val => saveTimesheet({...timesheet, validated: val})}
          disabled={canToggleValid}
        />
        <NotesModalButton
          value={timesheet.note}
          onChange={val => saveTimesheet({...timesheet, note: val})}
          title={t('projectMonth.timesheetNote', {name: `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`})}
        />
        {!projectMonth.invoice && (
          <UploadFileButton
            onUpload={f => dispatch(projectMonthUpload(f, 'timesheet', projectMonth._id))}
            icon="fa fa-upload"
            title={t('projectMonth.timesheetUpload')}
          />
        )}
        {hasTimesheetBeenUploaded && (
          <AttachmentPreviewButton tooltip="projectMonth.viewTimesheet" downloadUrl={getTimesheetDownloadUrl()} />
        )}
      </div>
    </div>
  );
};
