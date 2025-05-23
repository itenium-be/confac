/* eslint-disable react/jsx-one-expression-per-line, max-len */
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {ProjectClientTariff} from '../models/getProjectFeature';
import {ProjectDuration} from './ProjectDuration';
import {ProjectMonthLink} from './ProjectMonthLink';
import {NotesModalButton} from '../../controls/form-controls/button/NotesModalButton';
import {Claim} from '../../users/models/UserModel';
import {ConfacState} from '../../../reducers/app-state';
import {singleProjectMonthResolve} from '../../hooks/useProjects';
import {useDispatch} from 'react-redux';
import {saveProject} from '../../../actions';
import {Icon} from '../../controls/Icon';


import './ProjectMonthModal.scss';


type ProjectMonthModalProps = {
  onClose: () => void;
  projectMonth: FullProjectMonthModel | string;
}


export const ProjectMonthModal = ({onClose, projectMonth}: ProjectMonthModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fullProjectMonth = useSelector((state: ConfacState) => {
    if (typeof projectMonth === 'string') {
      const prjMonth = state.projectsMonth.find(pm => pm._id === projectMonth);
      if (prjMonth) {
        return singleProjectMonthResolve(state, prjMonth);
      }
    } else {
      return projectMonth;
    }
    return null;
  });

  if (!fullProjectMonth)
    return null;

  return (
    <Modal
      show
      onClose={onClose}
      title={(
        <>
          <span style={{marginRight: 12}}>{t(`consultant.types.${fullProjectMonth.consultant.type}`)}:</span>
          {fullProjectMonth.consultant.firstName} {fullProjectMonth.consultant.name}
        </>
      )}
      onConfirm={() => navigate(`/projects/${fullProjectMonth.project._id}`)}
      confirmText={t('projectMonth.linkToDetails')}
      extraButtons={
        <>
          <ProjectMonthLink to={fullProjectMonth.details} className="btn btn-success" />
          <NotesModalButton
            onChange={val => dispatch(saveProject({...fullProjectMonth.project, notes: val}) as any)}
            value={fullProjectMonth.project.notes}
            claim={Claim.ManageProjects}
            title={t('project.project') + ': ' + t('notes')}
            variant="success"
          />
        </>
      }
    >
      <div className="project-month-modal">
        <ProjectDuration project={fullProjectMonth.project} />

        <hr />

        <div className="project-client">
          {fullProjectMonth.client.name}
          <small><ProjectClientTariff projectClient={fullProjectMonth.project.client} /></small>
          {fullProjectMonth.project.partner && fullProjectMonth.partner && (
            <h5>
              {t('project.partner.clientId')}:
              <small>{fullProjectMonth.partner.name}</small>
              <small><ProjectClientTariff projectClient={fullProjectMonth.project.partner} /></small>
            </h5>
          )}
        </div>

        {fullProjectMonth.endCustomer && (
          <div>
            <hr />
            <h5>{t('project.endCustomer.clientId')}: {fullProjectMonth.endCustomer.name}</h5>

            {fullProjectMonth.project.endCustomer?.contact && (
              <div>
                <Icon fa="fa fa-user" size={1} style={{marginRight: 5}} />
                <span>{fullProjectMonth.project.endCustomer?.contact}</span>
              </div>
            )}
            {fullProjectMonth.project.endCustomer?.notes && (
              <span><b>{t('project.endCustomer.notes')}</b>: {fullProjectMonth.project.endCustomer?.notes}</span>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
