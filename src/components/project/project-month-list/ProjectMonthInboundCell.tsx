import React from 'react';
// import {useDispatch} from 'react-redux';
// import {Container, Row, Form, Col} from 'react-bootstrap';
// import {useHistory} from 'react-router-dom';
import {FullProjectMonthModel} from '../models/ProjectMonthModel';
// import { FloatInput } from '../../controls/form-controls/inputs/FloatInput';


interface ProjectMonthInboundCellProps {
  projectMonth: FullProjectMonthModel;
}


export const ProjectMonthInboundCell = ({projectMonth}: ProjectMonthInboundCellProps) => {
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const model = useSelector((state: ConfacState) => state.projects.find(c => c._id === props.match.params.id));
  // const [timesheet, setTimesheet] = useState<ProjectMonthTimesheet>(projectMonth.details.timesheet);

  return (
    <>
      INBOUND
    </>
  );
};
