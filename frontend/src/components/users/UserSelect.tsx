import {useSelector} from 'react-redux';
import Select from 'react-select';
import {UserModel} from './models/UserModel';
import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel';
import {SelectItem} from '../../models';
import {ConfacState} from '../../reducers/app-state';
import {t} from '../utils';

type UserSelectProps = {
  value: string | UserModel;
  onChange: (userId: string, user: UserModel) => void;
}

const UserSelectComponent = ({value, onChange}: UserSelectProps) => {
  const selectedModelId = value && typeof value === 'object' ? value._id : value;
  const models = useSelector((state: ConfacState) => state.user.users.filter(x => x.active || x._id === selectedModelId));
  const getModel = (userId: string): UserModel => models.find(c => c._id === userId) as UserModel;

  const options: SelectItem[] = models
    .map(x => ({value: x._id, label: `${x.firstName} ${x.name}`} as SelectItem))
    .sort((a, b) => (a.label as string).localeCompare(b.label as string));

  const selectedOption = options.find(o => o.value === selectedModelId) || null;

  return (
    <Select
      value={selectedOption}
      options={options as any}
      onChange={((item: SelectItem) => onChange(item && item.value as string, item && getModel(item.value as string))) as any}
      isClearable
      placeholder={t('controls.selectPlaceholder')}
      className="react-select-user"
      classNamePrefix="react-select"
    />
  );
};

export const UserSelect = EnhanceInputWithLabel(UserSelectComponent);
