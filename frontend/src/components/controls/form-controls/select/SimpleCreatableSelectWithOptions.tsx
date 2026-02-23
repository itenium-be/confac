import Creatable from 'react-select/creatable';
import {SelectItem} from '../../../../models';
import {t} from '../../../utils';

export type Option = {
  label: string;
  value: string;
}

export type SimpleCreatableSelectWithOptionsProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isClearable?: boolean;
  'data-testid'?: string;
};


export const SimpleCreatableSelectWithOptions = ({isClearable = false, 'data-testid': testId, ...props}: SimpleCreatableSelectWithOptionsProps) => {
  const {options, value, onChange} = props;
  const labelFromOptions = options.find(entry => entry.value === value);

  return (
    <Creatable
      value={{label: labelFromOptions ? labelFromOptions.label : value, value}}
      options={options}
      onChange={(itm: SelectItem | null) => onChange(itm ? String(itm.value) : '')}
      isClearable={isClearable}
      isMulti={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={(itm: string) => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
      classNamePrefix="react-select"
      aria-label={testId}
    />
  );
};
