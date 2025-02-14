import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ClientTypes} from '../models/ClientModels';
import { t } from '../../utils';
import { BaseSelect } from '../../controls/form-controls/select/BaseSelect';

type ClientTypeSelectProps = BaseInputProps<string[]>


export const ClientTypeSelect = ({ value, onChange, ...props}: ClientTypeSelectProps) => {
  return (
    <BaseSelect
      value={value.map(v => ({value: v, label: t(`client.clienttypes.${v}`)}))}
      onChange={val => onChange(val.map(v => v.value))}
      isMulti={true}
      options={[...ClientTypes.map(ct => ({value: ct, label: t(`client.clienttypes.${ct}`)}))]}
      {...props}
    />
  );
};



