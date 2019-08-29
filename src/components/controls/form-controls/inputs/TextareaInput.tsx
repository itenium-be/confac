import React from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";

type TextareaInputProps = BaseInputProps<string>;

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
