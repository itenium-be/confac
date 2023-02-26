import React from 'react';
import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {patchProjectsMonth} from '../../../../actions';
import {NotesModalButton} from '../../../controls/form-controls/button/NotesModalButton';
import {t} from '../../../utils';
import {Claim} from '../../../users/models/UserModel';


interface ProjectMonthNotesCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Notes form cell for a ProjectMonth row */
export const ProjectMonthNotesCell = ({fullProjectMonth}: ProjectMonthNotesCellProps) => {
  const dispatch = useDispatch();

  return (
    <div className="notes-cell">
      <NotesModalButton
        claim={Claim.EditProjectMonth}
        value={fullProjectMonth.details.note}
        onChange={val => dispatch(patchProjectsMonth({...fullProjectMonth.details, note: val}) as any)}
        title={t('projectMonth.note')}
      />
    </div>
  );
};
