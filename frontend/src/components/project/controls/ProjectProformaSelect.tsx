import {BaseInputProps} from '../../controls/form-controls/inputs/BaseInput';
import {t} from '../../utils';
import {BaseSelect} from '../../controls/form-controls/select/BaseSelect';
import {ProjectProformaOptions} from '../models/IProjectModel';

type ProjectProformaSelectProps = BaseInputProps<string>


export const ProjectProformaSelect = ({value, onChange, ...props}: ProjectProformaSelectProps) => {
  const val = value ?? '';
  return (
    <BaseSelect
      value={{value: val, label: t(`project.proforma.${val || 'no'}`)}}
      onChange={(option: {value: string; label: string}) => onChange(option.value)}
      isMulti={false}
      isClearable={false}
      options={[...ProjectProformaOptions.map(ct => ({value: ct, label: t(`project.proforma.${ct || 'no'}`)}))]}
      {...props}
    />
  );
};
