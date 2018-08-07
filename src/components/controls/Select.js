import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {t} from '../util.js';

import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel.js';

const BaseSelect = EnhanceInputWithLabel(props => (
  <Select
    clearValueText={t('controls.clearValueText')}
    clearAllText={t('controls.clearAllText')}
    noResultsText={t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    className={'tst-' + props['data-tst']}
    {...props}
  />
));



export const YearsSelect = ({values, years, onChange, ...props}) => {
  return (
    <BaseSelect
      value={values.map(y => ({label: y, value: y}))}
      onChange={newYears => onChange(newYears.map(itm => itm.value))}
      options={years.map(y => ({label: y, value: y}))}
      clearable={true}
      multi={true}
      {...props}
    />
  );
};



export const SimpleSelect = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    value: PropTypes.any,
    options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
    transFn: PropTypes.func,
    clearable: PropTypes.bool.isRequired,
  }

  render() {
    const {transFn, options, value, onChange, clearable, ...props} = this.props;
    const trans = transKey => transFn ? transFn(transKey) : transKey;

    const opts = options.map(itm => ({
      label: trans(itm),
      value: itm
    }));

    return (
      <BaseSelect
        value={{label: trans(value), value: value}}
        options={opts}
        onChange={itm => onChange(itm.value)}
        clearable={clearable}
        multi={false}
        className={'tst-' + this.props['data-tst']}
        {...props}
      />
    );
  }
});

// ------------- Creatable Selects:



export const SimpleCreatableSelect = ({options, value, onChange, clearable = false, ...props}) => {
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
      className={'tst-' + props['data-tst']}
    />
  );
};


export const PropertiesSelect = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
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
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});




export const StringsSelect = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange(values) {
    const strings = values.map(itm => itm.value);
    this.props.onChange(strings);
  }

  render() {
    return (
      <Select.Creatable
        value={this.props.values.map(v => ({label: v, value: v}))}
        onChange={this.onChange.bind(this)}
        clearable={true}
        multi={true}
        clearValueText={t('controls.clearValueText')}
        clearAllText={t('controls.clearAllText')}
        noResultsText={""}
        promptTextCreator={itm => t('controls.addLabelText', {value: itm})}
        placeholder={t('controls.selectPlaceholder')}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
