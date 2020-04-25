import Creatable from 'react-select/creatable';
import React from 'react';
import {SelectItem} from '../../../../models';
import {t} from '../../../utils';


export type SimpleCreatableSelectProps = {
  options: string[];
  value: string;
  onChange: Function;
  isClearable?: boolean;
};


export const SimpleCreatableSelect = ({options, value, onChange, isClearable = false, ...props}: SimpleCreatableSelectProps) => {
  const opts: SelectItem[] = options.map((itm: string) => ({
    label: itm,
    value: itm,
  }));

  return (
    <Creatable
      value={{label: value, value}}
      options={opts}
      onChange={itm => onChange(itm && (itm as SelectItem).value)}
      isClearable={isClearable}
      multi={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};
