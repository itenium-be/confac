import React from "react";
import { Icon } from "../../Icon";
import { StringInput } from "./StringInput";
import { BaseInputProps } from "./BaseInput";

type SearchStringInputProps = BaseInputProps & {
  value: string,
  onChange: (str: string) => void,
}

export const SearchStringInput = ({value, onChange, ...props}: SearchStringInputProps) => {
  return (
    <StringInput
      value={value}
      onChange={(e: string) => onChange(e)}
      suffix={<Icon fa="fa fa-search" size={1} />}
      {...props}
    />
  );
};
