import React from "react";
import { EnhanceInputWithLabel } from "../../../enhancers/EnhanceInputWithLabel";
import Creatable from "react-select/creatable";
import { t } from "../../../util";
import { BaseInputProps } from "../inputs/BaseInput";

export type StringsSelectProps = BaseInputProps<string[]> & {
  options: string[],
}


type OptionType = {
  label: string,
  value: string,
}


const convertToStringArray = (values: OptionType[]): string[] => {
  if (!values) {
    return [];
  }
  const strings = values.map(itm => itm.value);
  return strings;
}

export const StringsSelect = EnhanceInputWithLabel(({value, onChange, options, ...props}: StringsSelectProps) => {
  value = value || [];
  return (
    <Creatable
      value={value.map(v => ({label: v, value: v}))}
      onChange={val => onChange(convertToStringArray(val as OptionType[]))}
      isClearable={false}
      isMulti={true}
      noOptionsMessage={() => t('controls.noOptionsMessage')}
      formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
      className={'tst-' + props['data-tst']}
      options={(options || []).map(o => ({label: o, value: o}))}
      {...props}
    />
  );
});
