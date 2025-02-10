import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ClientType, ClientTypes} from '../models/ClientModels';
import {t} from '../../utils';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import { StringArrayInput } from '../../controls/form-controls/inputs/StringArrayInput';
import { CheckboxInput } from '../../controls/form-controls/inputs/CheckboxInput';
import { StringsSelect } from '../../controls/form-controls/select/StringsSelect';

type ClientTypeSelectProps = BaseInputProps<string[]>


export const ClientTypeSelect = ({ value, onChange, ...props}: ClientTypeSelectProps) => {
  
  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={ClientTypes}
      {...props}
    />
  );
};



