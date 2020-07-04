import {Moment} from 'moment';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {FullProjectModel} from '../project/models/FullProjectModel';


export function useProjects(month?: Moment): FullProjectModel[] {
  const [projects, clients, consultants] = useSelector((state: ConfacState) => [state.projects, state.clients, state.consultants]);

  return projects.map(project => {
    const consultant = consultants.find(x => x._id === project.consultantId);
    const client = clients.find(x => x._id === project.client.clientId);
    const partner = project.partner && clients.find(x => project.partner && x._id === project.partner.clientId);
    return new FullProjectModel(project, month, consultant, client, partner);
  });
}
