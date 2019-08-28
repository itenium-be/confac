import React, { Component } from 'react';
import Creatable from 'react-select/creatable';
import { SelectItem } from '../../../../models';
import { EnhanceInputWithLabel } from '../../../enhancers/EnhanceInputWithLabel';
import { t } from '../../../util';

export type PropertiesSelectProps = {
  label: string;
  onChange: (props: SelectItem[]) => void;
  values: SelectItem[];
};

export const PropertiesSelect = EnhanceInputWithLabel(class extends Component<PropertiesSelectProps> {
  onChange(values: Array<SelectItem & {className: string}>) {
    const properties = values.map(value => {
      if (value.className) {
        delete value.className;
        value.value = '';
      }
      return value;
    });

    this.props.onChange(properties);
  }

  render() {
    const {label} = this.props;
    return (
      <Creatable
        label={label}
        value={this.props.values as any}
        onChange={this.onChange.bind(this) as any}
        isClearable={true}
        isMulti={true}
        noOptionsMessage={() => ''}
        formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.propertiesPlaceholder')}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
