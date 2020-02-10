import React from 'react';
import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';
import {patchProjectsMonth} from '../../../actions';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {t} from '../../utils';


interface ProjectMonthNotesCellProps {
  projectMonth: FullProjectMonthModel;
}


/** Notes form cell for a ProjectMonth row */
export const ProjectMonthNotesCell = ({projectMonth}: ProjectMonthNotesCellProps) => {
  const dispatch = useDispatch();

  return (
    <div className="notes-cell">
      <NotesModalButton
        value={projectMonth.details.note}
        onChange={val => dispatch(patchProjectsMonth({...projectMonth.details, note: val}))}
        title={t('projectMonth.note')}
      />
    </div>
  );
};
