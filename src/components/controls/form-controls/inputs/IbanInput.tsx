import React from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { Icon } from "../../Icon";
import Iban from 'iban';

type IbanInputProps = BaseInputProps<string>;


export const IbanInput = ({value, onChange, ...props}: IbanInputProps) => {
  const isValid = Iban.isValid(value || '');
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value as string)}
      onBlur={() => onChange(Iban.printFormat(value || '', ' '))}
      {...props}
      suffix={(
        <Icon fa="fa fa-piggy-bank" size={1} className={(isValid ? 'success' : 'danger')} />
      )}
      suffixOptions={{type: 'text'}}
    />
  );
};
