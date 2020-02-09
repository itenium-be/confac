import React from 'react';
import {Link} from 'react-router-dom';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';


interface ProjectMonthConsultantCellProps {
  projectMonth: FullProjectMonthModel;
}


/** The first cell with Consultant/Client/Partner info of a ProjectMonth */
export const ProjectMonthConsultantCell = ({projectMonth}: ProjectMonthConsultantCellProps) => {
  const {consultant, client, partner} = projectMonth;
  return (
    <div className="consultant-cell">
      <div>
        <Link to={`consultants/${consultant.slug}`}>
          {`${consultant.firstName} ${consultant.name}`}
        </Link>
      </div>
      <small>
        {client && client.name}
        {partner && ` / ${partner.name}`}
      </small>
    </div>
  );
};
