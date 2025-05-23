import {BaseInput, BaseInputProps} from './BaseInput';
import {parseIntOrFloat} from './input-util';

type FloatInputProps = BaseInputProps<number> & {}

export const FloatInput = ({value, onChange, ...props}: FloatInputProps) => (
  <BaseInput
    type="number"
    value={value || ''}
    onChange={e => onChange(parseIntOrFloat(e.target.value, true))}
    {...props}
  />
);



type NullableFloatInputProps = BaseInputProps<number | undefined>

export const NullableFloatInput = ({value, onChange, ...props}: NullableFloatInputProps) => (
  <BaseInput
    type="number"
    value={value || ''}
    onChange={e => onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
    {...props}
  />
);
