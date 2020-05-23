import React from 'react';
import Select from 'react-select';
import {t} from '../../../utils';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {SelectItem} from '../../../../models';


type BaseSelect = {
  value: SelectItem | SelectItem[],
  onChange: any,
  options: SelectItem[],
  isClearable?: boolean,
  isMulti?: boolean,
}


/**
 * TODO: This fixes input appended icons to appear above the dropdownlist
 * The same fix should be applied to all other <Select> and <Creatable>s.
 * See: https://github.com/JedWatson/react-select/issues/1085
 */
const selectStyles = {
  container: (base, state) => ({
    ...base,
    opacity: state.isDisabled ? '.5' : '1',
    backgroundColor: 'transparent',
    zIndex: '999',
  }),
};



export const BaseSelect = EnhanceInputWithLabel((props: BaseSelect) => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    styles={selectStyles}
    {...props}
  />
));
