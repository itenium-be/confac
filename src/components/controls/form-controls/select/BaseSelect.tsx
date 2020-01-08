import React from 'react';
import Select from 'react-select';
import { t } from '../../../utils';
import { EnhanceInputWithLabel } from '../../../enhancers/EnhanceInputWithLabel';
import { SelectItem } from '../../../../models';


type BaseSelect = {
  value: SelectItem | SelectItem[],
  onChange: any,
  options: SelectItem[],
  isClearable?: boolean,
  isMulti?: boolean,
  // className?: string,
}

export const BaseSelect = EnhanceInputWithLabel((props: BaseSelect) => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    className={'tst-' + props['data-tst']}
    {...props}
  />
));
