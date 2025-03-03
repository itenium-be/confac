import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import { t } from '../../utils';
import { BaseSelect } from '../../controls/form-controls/select/BaseSelect';
import { ProjectProformaOptions } from '../models/ProjectMonthModel';

type ProjectProformaSelectProps = BaseInputProps<string[]>


export const ProjectProformaSelect = ({ value, onChange, ...props}: ProjectProformaSelectProps) => {
  return (
    <BaseSelect
      value={{value: value, label: t(`project.proforma.${value}`)}}
      onChange={val => onChange(val.value)}
      isMulti={false}
      isClearable={false}
      options={[...ProjectProformaOptions.map(ct => ({value: ct, label: t(`project.proforma.${ct}`)}))]}
      {...props}
    />
  );
};



