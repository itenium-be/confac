import React from "react";
import { BaseInput } from "./BaseInput";

export const StringInput = ({value, onChange, ...props}) => {
  return (
    <BaseInput
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
};
