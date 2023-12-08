import React, {Component} from 'react';
import Creatable from 'react-select/creatable';
import {SelectItem} from '../../../../models';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {t} from '../../../utils';
import {BaseInputProps} from '../inputs/BaseInput';

export type PropertiesSelectProps = BaseInputProps<SelectItem[]>;

export const PropertiesSelect = EnhanceInputWithLabel(class extends Component<PropertiesSelectProps> {
  onChange(values: Array<SelectItem & { className?: string, __isNew__?: boolean }>) {
    const properties = (values || []).map(val => {
      const value = val;
      if (value.className) {
        delete value.className;
        value.value = '';
      }
      if (value.__isNew__) {
        delete value.__isNew__;
      }
      return value;
    });

    this.props.onChange(properties);
  }

  render() {
    return (
      <Creatable
        value={this.props.value as any}
        onChange={this.onChange.bind(this) as any}
        isClearable
        isMulti
        noOptionsMessage={() => ''}
        formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.propertiesPlaceholder')}
        classNamePrefix="react-select"
        className="react-select-properties"
      />
    );
  }
});
