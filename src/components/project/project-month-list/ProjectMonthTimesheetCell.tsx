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

interface ProjectMonthTimesheetCellProps {
  projectMonth: FullProjectMonthModel;
}


/** Display timesheet number in days */
const TimesheetDaysDisplay = ({days}: {days: number | undefined}) => {
  const [vpWidth] = useViewportSizes();

  if (typeof days !== 'number') {
    return <span>&nbsp;</span>;
  }

  // TODO: hourly rate not implemented

  if (vpWidth > 1600) {
    return <span>{t('client.daysWorked', {days})}</span>;
  }

  return <span>{days}</span>;
};

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


  const projectConfig = projectMonth.project.projectMonthConfig;
  const canToggleValid = !(
    timesheet.timesheet
    && (timesheet.timesheet === timesheet.check || timesheet.note || !projectConfig.timesheetCheck)
  );

  const hasTimesheetBeenUploaded = projectMonth.details.attachments.some(attachment => attachment.type === 'timesheet');

  const getTimesheetDownloadUrl = () => {
    const projectMonthId = projectMonth._id;
    const timesheetDetails = projectMonth.details.attachments.find(attachment => attachment.type === 'timesheet');

    const {fileName} = timesheetDetails!;

    return getDownloadUrl('project_month', projectMonthId, 'timesheet', fileName, 'preview');
  };

  return (
    <div className={cn('timesheet-cell')}>
      <>
        <BasicMathInput
          value={timesheet.timesheet}
          onChange={val => setTimesheet({...timesheet, timesheet: val})}
          placeholder={t('projectMonth.timesheet')}
          display={timesheet.validated && (() => <TimesheetDaysDisplay days={timesheet.timesheet} />)}
          float
        />

        {projectConfig.timesheetCheck ? (
          <BasicMathInput
            value={timesheet.check}
            onChange={val => setTimesheet({...timesheet, check: val})}
            placeholder={t('projectMonth.timesheetCheck')}
            display={timesheet.validated && (() => <TimesheetDaysDisplay days={timesheet.check} />)}
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
        <UploadFileButton
          onUpload={f => dispatch(projectMonthUpload(f, 'timesheet', projectMonth._id))}
          icon="fa fa-upload"
          title={t('projectMonth.timesheetUpload')}
        />
        {hasTimesheetBeenUploaded && <AttachmentPreviewButton toolTipTransString="projectMonth.viewTimesheet" downloadUrl={getTimesheetDownloadUrl()} />}
      </div>
    </div>
  );
};
