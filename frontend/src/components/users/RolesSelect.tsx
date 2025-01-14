import {useSelector} from 'react-redux';
import {BaseInputProps} from '../controls/form-controls/inputs/BaseInput';
import {ConfacState} from '../../reducers/app-state';
import {StringsSelect} from '../controls/form-controls/select/StringsSelect';

export type RolesSelectProps = BaseInputProps<string[]>

export const RolesSelect = ({value, onChange, ...props}: RolesSelectProps) => {
  const options = useSelector((state: ConfacState) => state.user.roles);

  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={options.map(x => x.name)}
      {...props}
    />
  );
};
