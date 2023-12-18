import React from 'react';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel';
import {BaseInputProps} from '../form-controls/inputs/BaseInput';
import {Option, SimpleCreatableSelectWithOptions} from '../form-controls/select/SimpleCreatableSelectWithOptions';

export type CountrySelectProps = BaseInputProps<string>

const countries: Option[] = [
  {label: 'België', value: 'BE'},
  {label: 'Nederland', value: 'NL'},
  {label: 'UK', value: 'GB'},
  {label: 'Duitsland', value: 'DE'},
  {label: 'Frankrijk', value: 'FR'}];

const CountrySelectComponent = ({value, onChange, ...props}: CountrySelectProps) => {
  return (
    <SimpleCreatableSelectWithOptions
      value={value}
      onChange={onChange}
      options={countries}
      isClearable={false}
      {...props}
    />
  );
};

export const CountrySelect = EnhanceInputWithLabel(CountrySelectComponent);
