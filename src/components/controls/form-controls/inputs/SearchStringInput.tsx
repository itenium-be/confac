import React from "react";
import { Icon } from "../../Icon";
import { StringInput } from "./StringInput";
import { BaseInputProps } from "./BaseInput";
import { t } from "../../../util";
import { Button } from "react-bootstrap";

type SearchStringInputProps = BaseInputProps<string>;

export const SearchStringInput = ({value, onChange, ...props}: SearchStringInputProps) => {
  return (
    <StringInput
      value={value}
      onChange={(e: string) => onChange(e)}
      suffix={(
        <Button >
          <Icon fa="fa fa-search" size={1} />
        </Button>
      )}
      suffixOptions={{type: 'button'}}
      placeholder={t('search')}
      {...props}
    />
  );
};
