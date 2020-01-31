import React from 'react';
// import {useDispatch} from 'react-redux';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';


interface ProjectMonthOutboundCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthOutboundCell = ({projectMonth}: ProjectMonthOutboundCellProps) => {
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  // const [timesheet, setTimesheet] = useState<ProjectMonthTimesheet>(projectMonth.details.timesheet);

  return (
    <>
      OUTBOUND
    </>
  );
};
