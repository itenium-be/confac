import React from 'react';
import Select from 'react-select';
import {t} from '../../../utils';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {SelectItem} from '../../../../models';


type BaseSelectProps = {
  value: SelectItem | SelectItem[],
  onChange: any,
  options: SelectItem[],
  isClearable?: boolean,
  isMulti?: boolean,
}


export const BaseSelect = EnhanceInputWithLabel((props: BaseSelectProps) => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    classNamePrefix="react-select"
    {...props}
  />
));
