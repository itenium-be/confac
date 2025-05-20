import { BaseInputProps } from '../controls/form-controls/inputs/BaseInput';
import { StringsSelect } from '../controls/form-controls/select/StringsSelect';
import { Claim } from './models/UserModel';


export type ClaimsSelectProps = BaseInputProps<string[]>;

export const ClaimsSelect = ({ value, onChange, ...props }: ClaimsSelectProps) => {
  return (
    <StringsSelect
      value={value}
      onChange={onChange}
      options={Object.values(Claim)}
      {...props}
    />
  );
};
