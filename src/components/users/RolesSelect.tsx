import React from 'react';
import {useSelector} from 'react-redux';
import {BaseInputProps} from '../controls/form-controls/inputs/BaseInput';
import {ConfacState} from '../../reducers/app-state';
import {StringsSelect} from '../controls/form-controls/select/StringsSelect';
import {Claim} from './models/UserModel';

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



export type ClaimsSelectProps = BaseInputProps<string[]>

export const ClaimsSelect = ({value, onChange, ...props}: ClaimsSelectProps) => {
  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={Object.values(Claim)}
      {...props}
    />
  );
};
