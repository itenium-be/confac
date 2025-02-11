import { SelectItem } from '../../../models';
import { BaseSelect } from '../../controls/form-controls/select/BaseSelect';

export type ClientFilterOption = {
    label: string,
    value: string
}

export type ClientSearchProps = {
  values: string[];
  options: ClientFilterOption[];
  onChange: (newOption: string[]) => void;
  label?: string;
};


export const ClientSearch = ({values, options, onChange, ...props}: ClientSearchProps) => 
{
    return (
      <BaseSelect
        value={values.map(y => ({label: y, value: y}))}
        onChange={(newOptions: SelectItem[]) => onChange((newOptions || []).map(o => o.value as string))}
        options={options}
        isClearable={false}
        isMulti
        {...props}
    />
)};
