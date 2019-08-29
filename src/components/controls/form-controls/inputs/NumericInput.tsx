import React from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { parseIntOrFloat } from "./input-util";

type NumericInputProps = BaseInputProps<number> & {
  /**
   * Allow decimals
   */
  float?: boolean,
}

export const NumericInput = ({ value, onChange, float = false, ...props}: NumericInputProps) => {
  return (
    <BaseInput
      type="number"
      value={value || ''}
      onChange={e => onChange(parseIntOrFloat(e.target.value, float))}
      {...props}
    />
  );
};
