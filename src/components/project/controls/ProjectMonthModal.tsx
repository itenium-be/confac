/* eslint-disable react/jsx-one-expression-per-line, max-len */
import React from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
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


import './ProjectMonthModal.scss';


type ProjectMonthModalProps = {
  onClose: () => void;
  projectMonth: FullProjectMonthModel | string;
}




export const ProjectMonthModal = ({onClose, projectMonth}: ProjectMonthModalProps) => {
  const navigate = useNavigate();

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
            onChange={() => {}}
            disabled={true}
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

      </div>
    </Modal>
  );
};
