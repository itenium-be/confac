import {Link} from 'react-router';
import {IProjectModel} from '../models/IProjectModel';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';


export type ProjectProps = {
  project: IProjectModel;
}

/** Text link to project details page */
export const ProjectLink = ({project}: ProjectProps) => {
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === project.consultantId));
  const client = useSelector((state: ConfacState) => state.clients.find(c => c._id === project.client.clientId));

  const displayName = consultant && client
    ? `${consultant.firstName} ${consultant.name} @ ${client.name}`
    : project._id;

  return (
    <Link to={`/projects/${project._id}`}>
      {displayName}
    </Link>
  );
};
