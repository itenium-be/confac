import ReactSwitch from 'react-ios-switch';
import {BaseInputProps} from './inputs/BaseInput';

type SwitchProps = BaseInputProps<boolean> & {
  onColor?: string;
}

export const Switch = ({value, onChange, label, style, ...props}: SwitchProps) => (
  <div style={{...style, position: 'relative'}}>
    <ReactSwitch
      checked={value || false}
      onChange={onChange}
      {...props}
    />
    <span style={{position: 'absolute', left: 60, bottom: 10, whiteSpace: 'nowrap'}}>{label}</span>
  </div>
);
