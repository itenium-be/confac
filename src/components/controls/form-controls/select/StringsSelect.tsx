import React, { Component } from "react";
import { EnhanceInputWithLabel } from "../../../enhancers/EnhanceInputWithLabel";
import { SelectItem } from "../../../../models";
import Creatable from "react-select/creatable";
import { t } from "../../../util";

export type StringsSelectProps = {
  values: string[];
  onChange: Function;
};


export const StringsSelect = EnhanceInputWithLabel(class extends Component<StringsSelectProps> {
  onChange(values: SelectItem[]): void {
    if (!values) {
      this.props.onChange([]);
      return;
    }
    const strings = values.map(itm => itm.value);
    this.props.onChange(strings);
  }

  render() {
    return (
      <Creatable
        value={this.props.values.map(v => ({label: v, value: v}))}
        onChange={this.onChange.bind(this) as any}
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
