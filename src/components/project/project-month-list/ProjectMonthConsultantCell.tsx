import React from 'react';
// import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';
import {Icon} from '../../controls/Icon';


interface ProjectMonthConsultantCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthConsultantCell = ({projectMonth}: ProjectMonthConsultantCellProps) => {
  // const dispatch = useDispatch();
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));

  const {consultant, client, partner} = projectMonth;
  return (
    <div className="consultant-cell">
      <Icon fa="fa fa-info-circle" title="TODO: More info on consultant/client/partner?" />
      <div>{`${consultant.firstName} ${consultant.name}`}</div>
      <small>
        {client.name}
        {partner && ` / ${partner.name}`}
      </small>
    </div>
  );
};
