import {useSelector} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {SelectItem} from '../../../models';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {projectMonthResolve} from '../../hooks/useProjects';


type ProjectMonthSelectProps = {
  /** The projectModel _id */
  value: string,
  onChange: (fullProjectMonth: FullProjectMonthModel) => void,
  /** Currently selected Invoice */
  invoice?: InvoiceModel;
}



const getProjectMonthDesc = (fpm: FullProjectMonthModel): string => {
  const {consultant, details, client, partner} = fpm;
  return (
    `${details.month.format('YYYY/MM')}: ${consultant.firstName} ${consultant.name} @ ${client.name}${partner ? ` (${partner.name})` : ''}`
  );
};



const ProjectMonthSelectComponent = (props: ProjectMonthSelectProps) => {
  const fullProjectMonths = useSelector((state: ConfacState) => projectMonthResolve(state));

  const getFullProjectMonth = (projectMonthId: string): FullProjectMonthModel => fullProjectMonths
    .find(fpm => fpm._id === projectMonthId) as FullProjectMonthModel;

  const options: SelectItem[] = fullProjectMonths
    .filter(fpm => !fpm.invoice || (props.invoice && props.invoice._id === fpm.invoice._id))
    .sort((a, b) => getProjectMonthDesc(a).localeCompare(getProjectMonthDesc(b)))
    .map(item => ({value: item._id, label: getProjectMonthDesc(item)}));

  const selectedProjectMonthId = props.value;
  const selectedOption = options.find(o => o.value === selectedProjectMonthId) || null;

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => props.onChange(item && getFullProjectMonth(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      classNamePrefix="react-select"
      className="react-select-month"
    />
  );
};

export const ProjectMonthSelect = EnhanceInputWithLabel(ProjectMonthSelectComponent);
