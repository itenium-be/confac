import {Component} from 'react';
import Creatable from 'react-select/creatable';
import {MultiValue} from 'react-select';
import {SelectItem} from '../../../../models';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {t} from '../../../utils';
import {BaseInputProps} from '../inputs/BaseInput';

type CreatableSelectItem = SelectItem & { className?: string; __isNew__?: boolean };

export type PropertiesSelectProps = BaseInputProps<SelectItem[]>;

class PropertiesSelectComponent extends Component<PropertiesSelectProps> {
  onChange(values: MultiValue<CreatableSelectItem>) {
    const properties = (values || []).map(val => {
      const value = {...val};
      if (value.className) {
        delete value.className;
        value.value = '';
      }
      if (value.__isNew__) {
        delete value.__isNew__;
      }
      return value as SelectItem;
    });

    this.props.onChange(properties);
  }

  render() {
    return (
      <Creatable<CreatableSelectItem, true>
        value={this.props.value}
        onChange={this.onChange.bind(this)}
        isClearable
        isMulti
        noOptionsMessage={() => ''}
        formatCreateLabel={(itm: string) => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.propertiesPlaceholder')}
        classNamePrefix="react-select"
        className="react-select-properties"
      />
    );
  }
}

export const PropertiesSelect = EnhanceInputWithLabel(PropertiesSelectComponent);
