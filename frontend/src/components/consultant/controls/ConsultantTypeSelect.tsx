import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {t} from '../../utils';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {ConsultantTypes, ConsultantType} from '../models/ConsultantModel';

type ConsultantTypeSelectProps = BaseInputProps<ConsultantType>

export const ConsultantTypeSelect = (props: ConsultantTypeSelectProps) => {
  const {value, label, ...rest} = props;

  return (
    <SimpleSelect
      transFn={(key: string) => t(`consultant.types.${key}`)}
      value={value}
      options={ConsultantTypes}
      label={label}
      isClearable={false}
      {...rest}
    />
  );
};
