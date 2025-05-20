import {useSelector} from 'react-redux';
import Select from 'react-select';
import {t} from '../../utils';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {ConfacState} from '../../../reducers/app-state';
import {ClientModel, ClientType} from '../models/ClientModels';
import {SelectItem} from '../../../models';


type ClientSelectProps = {
  /** The client _id */
  value: string | ClientModel;
  clientType?: ClientType;
  onChange: (clientId: string, client: ClientModel) => void;
}

const ClientSelectComponent = ({value, clientType, onChange}: ClientSelectProps) => {
  const models = useSelector((state: ConfacState) => state.clients);
  const getModel = (consultantId: string): ClientModel => models.find(c => c._id === consultantId) as ClientModel;
  const getModelDesc = (c: ClientModel) => c.name;

  const selectedModelId = value && typeof value === 'object' ? value._id : value;
  const options: SelectItem[] = models
    .filter(x => x.active || x._id === selectedModelId)
    .filter(x => clientType === undefined || x.types.includes(clientType))
    .sort((a, b) => getModelDesc(a).localeCompare(getModelDesc(b)))
    .map(item => ({value: item._id, label: getModelDesc(item)} as SelectItem));

  const selectedOption = options.find(o => o.value === selectedModelId);

  return (
    <Select
      value={selectedOption || ''}
      options={options as any}
      onChange={((itm: SelectItem) => onChange(itm && itm.value as string, itm && getModel(itm.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      className="react-select-client"
      classNamePrefix="react-select"
    />
  );
};

export const ClientSelect = EnhanceInputWithLabel(ClientSelectComponent);
