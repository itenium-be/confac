import React from 'react';
import {BaseInputProps} from './form-controls/inputs/BaseInput';
import {Language} from '../../models';
import {SimpleSelect} from './form-controls/select/SimpleSelect';

export type LanguageSelectProps = BaseInputProps<string>

const languages: string[] = Object.keys(Language);

export const LanguageSelect = ({value, onChange, ...props}: LanguageSelectProps) => {
  return (
    <SimpleSelect
      value={value}
      onChange={onChange}
      options={languages}
      isClearable={false}
      {...props}
    />
  );
};
