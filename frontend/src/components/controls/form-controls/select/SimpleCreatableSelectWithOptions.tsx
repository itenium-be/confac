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
  onChange: Function;
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
      onChange={itm => onChange(itm && (itm as SelectItem).value)}
      isClearable={isClearable}
      isMulti={false}
      noOptionsMessage={() => t('controls.noResultsText')}
      formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
      placeholder={t('controls.selectPlaceholder')}
      classNamePrefix="react-select"
      aria-label={testId}
    />
  );
};
