import React from 'react';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import useViewportSizes from 'use-viewport-sizes';
import {ProjectMonthTimesheet} from '../models/ProjectMonthModel';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {t} from '../../utils';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {projectMonthUpload, patchProjectsMonth} from '../../../actions/projectActions';
import {getNewProjectMonthTimesheet} from '../models/getNewProject';
import {useDebouncedSave} from '../../hooks/useDebounce';
import {BasicMathInput} from '../../controls/form-controls/inputs/BasicMathInput';
import {getDownloadUrl} from '../../../actions/utils/download-helpers';
import {TimesheetTimeConfig, getAmountInDays} from '../../invoice/controls/InvoiceLineTypeSelect';
import {AttachmentUploadPreviewButtons} from '../controls/AttachmentUploadPreviewButtons';
import {SignedTimesheetAttachmentType} from '../../../models';

interface ProjectMonthTimesheetCellProps {
  fullProjectMonth: FullProjectMonthModel;
}
const ViewportWidths = {showTimesheetDaysFrom: 1800};


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




/** Timesheet form cell for a ProjectMonth row */
export const ProjectMonthTimesheetCell = ({fullProjectMonth}: ProjectMonthTimesheetCellProps) => {
  const dispatch = useDispatch();

  const defaultValue = fullProjectMonth.details.timesheet || getNewProjectMonthTimesheet();
  const dispatcher = (val: ProjectMonthTimesheet) => {
    dispatch(patchProjectsMonth({...fullProjectMonth.details, timesheet: val}));
  };
  const [timesheet, setTimesheet, saveTimesheet] = useDebouncedSave<ProjectMonthTimesheet>(defaultValue, dispatcher);


  if (fullProjectMonth.details.verified) {
    return <div />;
  }


  const projectConfig = fullProjectMonth.project.projectMonthConfig;
  const timesheetConfig = {
    rateType: fullProjectMonth.project.client.rateType,
    amount: timesheet.timesheet,
    hoursInDay: fullProjectMonth.client.rate.hoursInDay,
  };

  const timesheetCheckConfig: TimesheetTimeConfig = {
    // TODO: Hardcoded "daily" for timesheetCheck: daily/hourly should be a global config setting
    rateType: 'daily',
    amount: timesheet.check,
    hoursInDay: fullProjectMonth.client.rate.hoursInDay,
  };


  const timesheetAmount = getAmountInDays(timesheetConfig);
  const canToggleValid = !(
    timesheet.timesheet
    && (timesheetAmount === timesheet.check || timesheet.note || !projectConfig.timesheetCheck)
  );

  const timesheetDetails = fullProjectMonth.invoice
    ? fullProjectMonth.invoice.attachments.find(a => a.type === SignedTimesheetAttachmentType)
    : fullProjectMonth.details.attachments.find(a => a.type === SignedTimesheetAttachmentType);

  const hasTimesheetBeenUploaded = !!timesheetDetails;

  const getTimesheetDownloadUrl = () => {
    const {invoice} = fullProjectMonth;
    const projectMonthId = fullProjectMonth._id;

    if (!timesheetDetails) return '';

    const {fileName} = timesheetDetails;

    if (invoice) {
      return getDownloadUrl('invoice', invoice._id, SignedTimesheetAttachmentType, fileName, 'preview');
    }
    return getDownloadUrl('project_month', projectMonthId, SignedTimesheetAttachmentType, fileName, 'preview');
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
          title={t('projectMonth.timesheetNote', {name: `${fullProjectMonth.consultant.firstName} ${fullProjectMonth.consultant.name}`})}
        />
        <AttachmentUploadPreviewButtons
          isUploadDisabled={!!fullProjectMonth.invoice}
          isPreviewDisabled={!hasTimesheetBeenUploaded}
          uploadTooltip={t('projectMonth.timesheetUpload')}
          previewTooltip={t('projectMonth.viewTimesheet', {fileName: timesheetDetails ? timesheetDetails.fileName : ''})}
          onUpload={f => dispatch(projectMonthUpload(f, SignedTimesheetAttachmentType, fullProjectMonth._id))}
          downloadUrl={getTimesheetDownloadUrl()}
        />
      </div>
    </div>
  );
};
