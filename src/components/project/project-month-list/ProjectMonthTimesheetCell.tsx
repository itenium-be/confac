import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import cn from 'classnames';
import {FullProjectMonthModel, ProjectMonthTimesheet} from '../models/ProjectMonthModel';
import {FloatInput} from '../../controls/form-controls/inputs/FloatInput';
import {t} from '../../utils';
import {ValidityToggleButton} from '../../controls/form-controls/button/ValidityToggleButton';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';


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
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  const [timesheet, setTimesheet] = useState<ProjectMonthTimesheet>(projectMonth.details.timesheet);

  const canToggleValid = !(timesheet.timesheet && (timesheet.timesheet === timesheet.check || timesheet.note));

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
            onChange={val => setTimesheet({...timesheet, timesheet: val})}
            placeholder={t('projectMonth.timesheet')}
          />

          <FloatInput
            value={timesheet.check}
            onChange={val => setTimesheet({...timesheet, check: val})}
            placeholder={t('projectMonth.timesheetCheck')}
          />
        </>
      )}

      <div className="timesheet-actions">
        <ValidityToggleButton
          value={timesheet.validated}
          onChange={val => setTimesheet({...timesheet, validated: val})}
          disabled={canToggleValid}
        />
        <NotesModalButton
          value={timesheet.note}
          onChange={val => setTimesheet({...timesheet, note: val})}
          title={t('projectMonth.timesheetNote', {name: `${projectMonth.consultant.firstName} ${projectMonth.consultant.name}`})}
        />
      </div>
    </div>
  );
};
