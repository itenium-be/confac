import React from "react";
import { BaseInput } from "./BaseInput";

export const TextareaInput = ({value, onChange, ...props}) => {
  return (
    <BaseInput
      type="textarea"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};
