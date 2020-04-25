/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthModal} from '../controls/ProjectMonthModal';


interface ProjectMonthConsultantCellProps {
  fullProjectMonth: FullProjectMonthModel;
}


/** The first cell with Consultant/Client/Partner info of a ProjectMonth */
export const ProjectMonthConsultantCell = ({fullProjectMonth}: ProjectMonthConsultantCellProps) => {
  const [modal, setModal] = useState<boolean>(false);
  const {consultant, client, partner} = fullProjectMonth;
  return (
    <>
      {modal && (
        <ProjectMonthModal
          onClose={() => setModal(false)}
          projectMonth={fullProjectMonth}
        />
      )}
      <div className="consultant-cell clickable" onClick={() => setModal(true)} role="button" tabIndex={0}>
        <div>
          <Link to={`consultants/${consultant.slug}`}>
            {`${consultant.firstName} ${consultant.name}`}
          </Link>
        </div>
        <small>
          {client && (
            <Link to={`/clients/${client.slug}`}>{client.name}</Link>
          )}
          {partner && ' / '}
          {partner && (
            <Link to={`/clients/${partner.slug}`}>{partner.name}</Link>
          )}
        </small>
      </div>
    </>
  );
};
