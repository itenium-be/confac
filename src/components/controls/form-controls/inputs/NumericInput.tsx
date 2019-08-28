import React from "react";
import { BaseInput } from "./BaseInput";
import { parseIntOrFloat } from "./input-util";


export const NumericInput = ({ value, onChange, float = false, ...props}) => {
  return (
    <BaseInput
      type="number"
      value={value || ''}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
      {...props}
    />
  );
};
