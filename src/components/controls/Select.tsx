import React, {Component} from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import {t} from '../util';
import {EnhanceInputWithLabel} from '../enhancers/EnhanceInputWithLabel';


type BaseSelect = {
  value: SelectItem | SelectItem[],
  onChange: any,
  options: SelectItem[],
  isClearable?: boolean,
  isMulti?: boolean,
  // className?: string,
}

const BaseSelect = EnhanceInputWithLabel((props: BaseSelect) => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    className={'tst-' + props['data-tst']}
    {...props}
  />
));


type YearsSelectProps = {
  values: number[],
  years: number[],
  onChange: (newYears: number[]) => void,
  label?: string,
}

export const YearsSelect = ({values, years, onChange, ...props}: YearsSelectProps) => {
  return (
    <BaseSelect
      value={values.map(y => ({label: y, value: y}))}
      onChange={(newYears: SelectItem[]) => onChange((newYears || []).map(itm => itm.value as number))}
      options={years.map(y => ({label: y, value: y}))}
      isClearable={true}
      isMulti={true}
      {...props}
    />
  );
};



type SimpleSelectProps = {
  value: any,
  options: string[],
  onChange: Function,
  transFn?: (key: string) => string,
  isClearable: boolean
}

export const SimpleSelect = EnhanceInputWithLabel(class extends Component<SimpleSelectProps> {
  render() {
    const {transFn, options, value, onChange, isClearable, ...props} = this.props;
    const trans = (transKey: string): string => transFn ? transFn(transKey) : transKey;

    const opts: SelectItem[] = options.map(itm => ({
      label: trans(itm),
      value: itm
    }));

    return (
      <BaseSelect
        value={{label: trans(value), value: value}}
        options={opts}
        onChange={(itm: SelectItem) => onChange(itm.value)}
        isClearable={isClearable}
        isMulti={false}
        {...props}
      />
    );
  }
});

// ------------- Creatable Selects:


type SimpleCreatableSelectProps = {
  options: string[],
  value: string,
  onChange: Function,
  isClearable?: boolean,
}


export const SimpleCreatableSelect = ({options, value, onChange, isClearable = false, ...props}: SimpleCreatableSelectProps) => {
  const opts: SelectItem[] = options.map((itm: string) => ({
    label: itm,
    value: itm
  }));

  return (
    <Creatable
      value={{label: value, value: value}}
      options={opts}
      onChange={itm => onChange(itm && (itm as SelectItem).value)}
      isClearable={isClearable}
      multi={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
      className={'tst-' + props['data-tst']}
    />
  );
};


type SelectItem = {
  label: string | number,
  value: string | number,
  className?: string,
}

type PropertiesSelectProps = {
  label: string,
  onChange: (props: SelectItem[]) => void,
  values: SelectItem[],
}



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


type StringsSelectProps = {
  values: string[],
  onChange: Function,
}

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
