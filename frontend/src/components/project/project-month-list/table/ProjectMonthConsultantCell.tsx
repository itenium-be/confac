/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {FullProjectMonthModel} from '../../models/FullProjectMonthModel';
import {ProjectMonthModal} from '../../controls/ProjectMonthModal';
import {ConsultantLink} from '../../../consultant/controls/ConsultantLink';


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
          <ConsultantLink consultant={consultant} />
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
