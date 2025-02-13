import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ClientTypes} from '../models/ClientModels';
import { StringsSelect } from '../../controls/form-controls/select/StringsSelect';
import { t } from '../../utils';

type ClientTypeSelectProps = BaseInputProps<string[]>


export const ClientTypeSelect = ({ value, onChange, ...props}: ClientTypeSelectProps) => {

  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={[...ClientTypes.map(ct => t(`client.clienttypes.${ct}`))]}
      {...props}
    />
  );
};



