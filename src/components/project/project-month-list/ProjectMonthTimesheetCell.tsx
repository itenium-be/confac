import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import {FullProjectMonthModel, ProjectMonthTimesheet} from '../models/ProjectMonthModel';
import {FloatInput} from '../../controls/form-controls/inputs/FloatInput';
import {t} from '../../utils';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {UploadFileButton} from '../../controls/form-controls/button/UploadFileButton';
import {projectMonthUpload, patchProjectsMonth} from '../../../actions/projectActions';
import {getNewProjectMonthTimesheet} from '../models/getNewProject';


interface ProjectMonthTimesheetCellProps {
  projectMonth: FullProjectMonthModel;
}


const TimesheetDaysDisplay = ({days}: {days: number | undefined}) => {
  if (typeof days !== 'number') {
    return <span>&nbsp;</span>;
  }
  return <span>{t('client.daysWorked', {days})}</span>;
};

type TimesheetKeys = keyof ProjectMonthTimesheet;

export const ProjectMonthTimesheetCell = ({projectMonth}: ProjectMonthTimesheetCellProps) => {
  const dispatch = useDispatch();
  const [timesheet, setTimesheet] = useState<ProjectMonthTimesheet>(projectMonth.details.timesheet || getNewProjectMonthTimesheet());

  // TODO: Oh my.. add a debounce...
  const realSetTimesheet = (patch: {[key in TimesheetKeys]?: any}): ProjectMonthTimesheet => {
    const newTimesheet = {...timesheet, ...patch};
    setTimesheet(newTimesheet);
    return newTimesheet;
  };

  const saveTimesheet = (newTimesheet?: ProjectMonthTimesheet) => {
    dispatch(patchProjectsMonth({...projectMonth.details, timesheet: newTimesheet || timesheet}));
  };

  const projectConfig = projectMonth.project.projectMonthConfig;

  const canToggleValid = !(
    timesheet.timesheet
    && (timesheet.timesheet === timesheet.check || timesheet.note || !projectConfig.timesheetCheck)
  );

  return (
    <div className={cn('timesheet-cell', timesheet.validated && 'validated')}>
      {timesheet.validated ? (
        <>
          <TimesheetDaysDisplay days={timesheet.timesheet} />
          <TimesheetDaysDisplay days={timesheet.check} />
        </>
      ) : (
        <>
          <FloatInput
            value={timesheet.timesheet}
            onChange={val => realSetTimesheet({timesheet: val})}
            onBlur={() => saveTimesheet()}
            placeholder={t('projectMonth.timesheet')}
          />

          {projectConfig.timesheetCheck ? (
            <FloatInput
              value={timesheet.check}
              onChange={val => realSetTimesheet({check: val})}
              onBlur={() => saveTimesheet()}
              placeholder={t('projectMonth.timesheetCheck')}
            />
          ) : <div />}
        </>
      )}

      <div className="timesheet-actions">
        <ValidityToggleButton
          value={timesheet.validated}
          onChange={val => {
            const newTimesheet = realSetTimesheet({validated: val});
            saveTimesheet(newTimesheet);
          }}
          disabled={canToggleValid}
        />
        <NotesModalButton
          value={timesheet.note}
          onChange={val => {
            const newTimesheet = realSetTimesheet({note: val});
            saveTimesheet(newTimesheet);
          }}
          title={t('projectMonth.timesheetNote', {name: `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`})}
        />
        <UploadFileButton
          onUpload={f => dispatch(projectMonthUpload(f, 'timesheet'))}
          icon="fa fa-clock"
          title={t('projectMonth.timesheetUpload')}
        />
      </div>
    </div>
  );
};
