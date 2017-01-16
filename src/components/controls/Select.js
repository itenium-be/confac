import React from 'react';
import Select from 'react-select';
import {t} from '../util.js';

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
      promptTextCreator={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
    />
  );
};
