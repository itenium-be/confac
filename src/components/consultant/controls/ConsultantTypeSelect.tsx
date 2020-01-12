import React from 'react';
import {SimpleSelect} from '../../controls/form-controls/select/SimpleSelect';
import {t} from '../../utils';
import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';

type ConsultantTypeSelectProps = BaseInputProps<string>

const ConsultantTypes = ['manager', 'consultant', 'freelancer', 'externalConsultant'];

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
