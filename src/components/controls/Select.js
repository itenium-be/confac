import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import {t} from '../util.js';

import {EnhanceIputWithLabel} from './Inputs.js';

export const SimpleSelect = ({options, value, onChange, clearable = false}) => {
  const opts = options.map(itm => ({
    label: itm,
    value: itm
  }));

  return (
    <Select.Creatable
      value={{label: value, value: value}}
      options={opts}
      onChange={itm => onChange(itm.value)}
      clearable={clearable}
      multi={false}
      clearValueText={t('controls.clearValueText')}
      clearAllText={t('controls.clearAllText')}
      noResultsText={t('controls.noResultsText')}
      promptTextCreator={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};



export const PropertiesSelect = EnhanceIputWithLabel(class extends Component {
  static propTypes = {
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange(values) {
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
      <Select.Creatable
        label={label}
        value={this.props.values}
        onChange={this.onChange.bind(this)}
        clearable={true}
        multi={true}
        clearValueText={t('controls.clearValueText')}
        clearAllText={t('controls.clearAllText')}
        noResultsText={""}
        promptTextCreator={itm => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.propertiesPlaceholder')}
      />
    );
  }
});
