/* eslint-disable react/jsx-one-expression-per-line, max-len */
import React from 'react';
import {useHistory} from 'react-router-dom';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {ProjectClientTariff} from '../models/getProjectFeature';
import {ProjectDuration} from './ProjectDuration';
import {ProjectMonthLink} from './ProjectMonthLink';


import './ProjectMonthModal.scss';


type ProjectMonthModalProps = {
  onClose: () => void;
  projectMonth: FullProjectMonthModel;
}




export const ProjectMonthModal = ({onClose, projectMonth}: ProjectMonthModalProps) => {
  const history = useHistory();
  return (
    <Modal
      show
      onClose={onClose}
      title={(
        <>
          <span style={{marginRight: 12}}>{t(`consultant.types.${projectMonth.consultant.type}`)}:</span>
          {projectMonth.consultant.firstName} {projectMonth.consultant.name}
        </>
      )}
      onConfirm={() => history.push(`/projects/${projectMonth.project._id}`)}
      confirmText={t('projectMonth.linkToDetails')}
      extraButtons={<ProjectMonthLink to={projectMonth.details} className="btn btn-success" />}
    >
      <div className="project-month-modal">
        <ProjectDuration project={projectMonth.project} />

        <hr />

        <div className="project-client">
          {projectMonth.client.name}
          <small><ProjectClientTariff projectClient={projectMonth.project.client} /></small>
          {projectMonth.project.partner && projectMonth.partner && (
            <h5>
              {t('project.partner.clientId')}:
              <small>{projectMonth.partner.name}</small>
              <small><ProjectClientTariff projectClient={projectMonth.project.partner} /></small>
            </h5>
          )}
        </div>

      </div>
    </Modal>
  );
};
