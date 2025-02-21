import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {patchProjectsMonth} from '../../../../actions';
import {NotesModalButton} from '../../../controls/form-controls/button/NotesModalButton';
import {t} from '../../../utils';
import {Claim} from '../../../users/models/UserModel';
import { NotesWithCommentsModalButton } from '../../../controls/form-controls/button/NotesWithCommentsModalButton';


interface ProjectMonthNotesCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** Notes form cell for a ProjectMonth row */
export const ProjectMonthNotesCell = ({fullProjectMonth}: ProjectMonthNotesCellProps) => {
  const dispatch = useDispatch();

  return (
    <div className="notes-cell">
      <NotesWithCommentsModalButton
        claim={Claim.EditProjectMonth}
        value={fullProjectMonth.details}
        onChange={val => dispatch(patchProjectsMonth({...fullProjectMonth.details, note: val.note, comments: val.comments}) as any)}
        title={t('projectMonth.note')}
      />
    </div>
  );
};
