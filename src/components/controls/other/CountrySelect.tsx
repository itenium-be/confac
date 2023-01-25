import React from 'react';
import { EnhanceInputWithLabel } from '../../enhancers/EnhanceInputWithLabel';
import { BaseInputProps } from '../form-controls/inputs/BaseInput';
import { SimpleCreatableSelect } from '../form-controls/select/SimpleCreatableSelect';

export type CountrySelectProps = BaseInputProps<string>

const countries: string[] = ['België', 'Nederland', 'UK', 'Duitsland', 'Frankrijk'];

const CountrySelectComponent = ({value, onChange, ...props}: CountrySelectProps) => {
  return (
    <SimpleCreatableSelect
      value={value}
      onChange={onChange}
      options={countries}
      isClearable={false}
      {...props}
    />
  );
};

export const CountrySelect = EnhanceInputWithLabel(CountrySelectComponent);
