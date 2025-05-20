import { SelectItem } from '../../../models';
import { BaseSelect } from '../../controls/form-controls/select/BaseSelect';


export type FilterValue = string | number;

export type ClientFilterOption = {
  label: string;
  value: FilterValue;
}

export type ClientSearchProps = {
  values: ClientFilterOption[];
  options: ClientFilterOption[];
  onChange: (newOption: FilterValue[]) => void;
  label?: string;
};


export const ClientSearch = ({values, options, onChange, ...props}: ClientSearchProps) => {
  return (
    <BaseSelect
      value={values}
      onChange={(newOptions: SelectItem[]) => onChange((newOptions || []).map(o => o.value))}
      options={options}
      isClearable={false}
      isMulti
      {...props}
    />
  );};
