import React, { Component } from "react";
import { EnhanceInputWithLabel } from "../../../enhancers/EnhanceInputWithLabel";
import Creatable from "react-select/creatable";
import { t } from "../../../util";
import { BaseInputProps } from "../inputs/BaseInput";

export type StringsSelectProps = BaseInputProps<string[]>


type OptionType = {
  label: string,
  value: string,
}


const onChange = (values: OptionType[]): string[] => {
  if (!values) {
    return [];
  }
  const strings = values.map(itm => itm.value);
  return strings;
}

export const StringsSelect = EnhanceInputWithLabel(class extends Component<StringsSelectProps> {
  render() {
    const value = this.props.value || [];
    return (
      <Creatable
        value={value.map(v => ({label: v, value: v}))}
        onChange={val => this.props.onChange(onChange(val as OptionType[]))}
        isClearable={false}
        isMulti={true}
        noOptionsMessage={() => t('controls.noOptionsMessage')}
        formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.selectPlaceholder')}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
