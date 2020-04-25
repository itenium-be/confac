/* eslint-disable react/jsx-one-expression-per-line, max-len */
import React from 'react';
import {useHistory} from 'react-router-dom';
import moment from 'moment';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {Icon} from '../../controls/Icon';
import {formatDate, t} from '../../utils';
import {Modal} from '../../controls/Modal';
import {ProjectClientTariff} from '../models/getProjectFeature';


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
    >
      <div className="project-month-modal">
        <div className="project-duration">
          <Icon fa="fa fa-clock" />
          <span>{formatDate(projectMonth.project.startDate)}</span>
          {projectMonth.project.endDate ? (
            <>
              <Icon fa="fa fa-arrow-right" />
              <span>{formatDate(projectMonth.project.endDate)}</span>
              {projectMonth.project.endDate.isAfter(moment()) && (
                <small>
                  (
                  {t('projectMonth.timesheetExpiration', {daysLeft: moment.duration(moment(projectMonth.project.endDate).diff(moment())).humanize(true)})}
                  )
                </small>
              )}
            </>
          ) : (
            <>
              <Icon fa="fa fa-arrow-right" />
              <Icon fa="fa fa-infinity" />
            </>
          )}
        </div>

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
