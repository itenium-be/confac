import React from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";

type TextareaInputProps = BaseInputProps & {
  value: string | undefined,
  onChange: (str: string) => void,
}

export const TextareaInput = ({value, onChange, ...props}: TextareaInputProps) => {
  return (
    <BaseInput
      type="textarea"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};
