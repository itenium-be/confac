import Select from 'react-select';
import {t} from '../../../utils';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {SelectItem} from '../../../../models';


type BaseSelectProps = {
  value: SelectItem | SelectItem[];
  onChange: (value: SelectItem | SelectItem[] | null) => void;
  options: SelectItem[];
  isClearable?: boolean;
  isMulti?: boolean;
  'data-testid'?: string;
}


export const BaseSelect = EnhanceInputWithLabel(({'data-testid': testId, ...props}: BaseSelectProps) => (
  <Select
    noOptionsMessage={() => t('controls.noResultsText')}
    placeholder={t('controls.selectPlaceholder')}
    classNamePrefix="react-select"
    className="react-select-base"
    aria-label={testId}
    {...props}
  />
));
