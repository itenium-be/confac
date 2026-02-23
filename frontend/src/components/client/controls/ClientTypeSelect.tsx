import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ClientTypes} from '../models/ClientModels';
import {t} from '../../utils';
import {BaseSelect} from '../../controls/form-controls/select/BaseSelect';

type ClientTypeSelectProps = BaseInputProps<string[]>

type SelectOption = {value: string; label: string};

export const ClientTypeSelect = ({value, onChange, ...props}: ClientTypeSelectProps) => {
  return (
    <BaseSelect
      value={(value ?? []).map((v: string) => ({value: v, label: t(`client.clienttypes.${v}`)}))}
      onChange={(val: SelectOption[]) => onChange(val.map((v: SelectOption) => v.value))}
      isMulti
      options={[...ClientTypes.map(ct => ({value: ct, label: t(`client.clienttypes.${ct}`)}))]}
      {...props}
    />
  );
};
