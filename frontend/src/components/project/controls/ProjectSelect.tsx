import {useSelector} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {SelectItem} from '../../../models';
import {IProjectModel} from '../models/IProjectModel';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {ClientModel} from '../../client/models/ClientModels';


type ProjectSelectProps = {
  /** The project _id */
  value: string | IProjectModel,
  onChange: (projectId: string, project: IProjectModel) => void,
}

const ProjectSelectComponent = (props: ProjectSelectProps) => {
  const projects = useSelector((state: ConfacState) => state.projects);
  const consultants = useSelector((state: ConfacState) => state.consultants);
  const clients = useSelector((state: ConfacState) => state.clients);
  const {value} = props;

  const getProject = (projectId: string): IProjectModel => projects.find(p => p._id === projectId) as IProjectModel;
  const getConsultantFullName = (consultantId: string) => {
    const consultant = consultants.find(c => c._id === consultantId) as ConsultantModel;
    return `${consultant.firstName} ${consultant.name}`;
  };
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c._id === clientId) as ClientModel;
    return client.name;
  };

  const getProjectDesc = (p: IProjectModel) => `${getConsultantFullName(p.consultantId)} - ${getClientName(p.client.clientId)}`;

  const selectedProjectId = value && typeof value === 'object' ? value._id : value;
  const options: SelectItem[] = projects
    .sort((a, b) => getProjectDesc(a).localeCompare(getProjectDesc(b)))
    .map(item => ({value: item._id, label: getProjectDesc(item)} as SelectItem));

  const selectedOption = options.find(o => o.value === selectedProjectId) || null;

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => props.onChange(item && item.value as string, item && getProject(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      classNamePrefix="react-select"
      className="react-select-project"
    />
  );
};

export const ProjectSelect = EnhanceInputWithLabel(ProjectSelectComponent);
