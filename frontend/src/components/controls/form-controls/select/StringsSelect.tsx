import Creatable from 'react-select/creatable';
import {EnhanceInputWithLabel} from '../../../enhancers/EnhanceInputWithLabel';
import {t} from '../../../utils';
import {BaseInputProps} from '../inputs/BaseInput';

export type StringsSelectProps = BaseInputProps<string[]> & {
  options: string[];
}


type OptionType = {
  label: string;
  value: string;
}


const convertToStringArray = (values: OptionType[]): string[] => {
  if (!values) {
    return [];
  }
  const strings = values.map(itm => itm.value);
  return strings;
};

export const StringsSelect = EnhanceInputWithLabel(({value = [], onChange, options, ...props}: StringsSelectProps) => (
  <Creatable
    value={value.map(v => ({label: v, value: v}))}
    onChange={val => onChange(convertToStringArray(val as OptionType[]))}
    isClearable={false}
    isMulti
    noOptionsMessage={() => t('controls.noOptionsMessage')}
    formatCreateLabel={itm => t('controls.addLabelText', {value: itm})}
    placeholder={t('controls.selectPlaceholder')}
    options={(options || []).map(o => ({label: o, value: o}))}
    classNamePrefix="react-select"
    {...props}
  />
));
