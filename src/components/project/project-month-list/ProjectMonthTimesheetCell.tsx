import React, {useState, useEffect} from 'react';
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
import useDebounce from '../../hooks/useDebounce';


interface ProjectMonthTimesheetCellProps {
  projectMonth: FullProjectMonthModel;
}


const TimesheetDaysDisplay = ({days}: {days: number | undefined}) => {
  if (typeof days !== 'number') {
    return <span>&nbsp;</span>;
  }
  return <span>{t('client.daysWorked', {days})}</span>;
};


export const ProjectMonthTimesheetCell = ({projectMonth}: ProjectMonthTimesheetCellProps) => {
  const dispatch = useDispatch();

  const defaultTimesheet = projectMonth.details.timesheet || getNewProjectMonthTimesheet();
  const [timesheet, setInternalTimesheet] = useState<ProjectMonthTimesheet>(defaultTimesheet);
  const [editMode, setEditMode] = useState<boolean>(false);
  const debounced = useDebounce<ProjectMonthTimesheet>(timesheet);
  useEffect(
    () => {
      if (editMode) {
        dispatch(patchProjectsMonth({...projectMonth.details, timesheet}));
        setEditMode(false);
      }
    },
    [debounced],
  );

  const setTimesheet = (newTimesheet: ProjectMonthTimesheet): void => {
    setEditMode(true);
    setInternalTimesheet(newTimesheet);
  };

  const setFullTimesheet = (newTimesheet: ProjectMonthTimesheet): void => {
    dispatch(patchProjectsMonth({...projectMonth.details, timesheet: newTimesheet}));
    setEditMode(false);
    setInternalTimesheet(newTimesheet);
  };

  const projectConfig = projectMonth.project.projectMonthConfig;

  const canToggleValid = !(
    timesheet.timesheet
    && (timesheet.timesheet === timesheet.check || timesheet.note || !projectConfig.timesheetCheck)
  );

  return (
    <div className={cn('timesheet-cell')}>
      {timesheet.validated ? (
        <>
          <TimesheetDaysDisplay days={timesheet.timesheet} />
          <TimesheetDaysDisplay days={timesheet.check} />
        </>
      ) : (
        <>
          <FloatInput
            value={timesheet.timesheet}
            onChange={val => setTimesheet({...timesheet, timesheet: val})}
            placeholder={t('projectMonth.timesheet')}
          />

          {projectConfig.timesheetCheck ? (
            <FloatInput
              value={timesheet.check}
              onChange={val => setTimesheet({...timesheet, check: val})}
              placeholder={t('projectMonth.timesheetCheck')}
            />
          ) : <div />}
        </>
      )}

      <div className="timesheet-actions">
        <ValidityToggleButton
          value={timesheet.validated}
          onChange={val => setFullTimesheet({...timesheet, validated: val})}
          disabled={canToggleValid}
        />
        <NotesModalButton
          value={timesheet.note}
          onChange={val => setFullTimesheet({...timesheet, note: val})}
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
