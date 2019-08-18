import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import {t} from '../util';

import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel';

const BaseSelect = EnhanceInputWithLabel(props => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
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
      isClearable={true}
      isMulti={true}
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
    isClearable: PropTypes.bool.isRequired,
  }

  render() {
    const {transFn, options, value, onChange, isClearable, ...props} = this.props;
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
        isClearable={isClearable}
        isMulti={false}
        className={'tst-' + this.props['data-tst']}
        {...props}
      />
    );
  }
});

// ------------- Creatable Selects:



export const SimpleCreatableSelect = ({options, value, onChange, isClearable = false, ...props}) => {
  const opts = options.map(itm => ({
    label: itm,
    value: itm
  }));

  return (
    <Creatable
      value={{label: value, value: value}}
      options={opts}
      onChange={itm => onChange(itm.value)}
      isClearable={isClearable}
      multi={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
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
      <Creatable
        label={label}
        value={this.props.values}
        onChange={this.onChange.bind(this)}
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




export const StringsSelect = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange(values) {
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
        onChange={this.onChange.bind(this)}
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
