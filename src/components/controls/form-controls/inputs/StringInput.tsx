import React from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";

type StringInputProps = BaseInputProps & {
  value: string,
  onChange: (str: string) => void,
}

export const StringInput = ({value, onChange, ...props}: StringInputProps) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};
