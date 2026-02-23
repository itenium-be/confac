import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {patchProjectsMonth} from '../../../../actions';
import {t} from '../../../utils';
import {Claim} from '../../../users/models/UserModel';
import {NotesWithCommentsModalButton} from '../../../controls/form-controls/button/NotesWithCommentsModalButton';
import {useAppDispatch} from '../../../hooks/useAppDispatch';


interface ProjectMonthNotesCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Notes form cell for a ProjectMonth row */
export const ProjectMonthNotesCell = ({fullProjectMonth}: ProjectMonthNotesCellProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="notes-cell">
      <NotesWithCommentsModalButton
        claim={Claim.EditProjectMonth}
        value={fullProjectMonth.details}
        onChange={val => dispatch(patchProjectsMonth({...fullProjectMonth.details, note: val.note, comments: val.comments}))}
        title={t('projectMonth.note')}
        showNote
      />
    </div>
  );
};
