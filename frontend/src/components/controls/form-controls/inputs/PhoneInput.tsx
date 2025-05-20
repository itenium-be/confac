import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';
import {InputGroup} from 'react-bootstrap';

type PhoneInputProps = BaseInputProps<string>;

export const PhoneInput = ({value, onChange, ...props}: PhoneInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <InputGroup.Text>
        <a href={`tel:${(value || '').replace(/[^0-9]/g, '')}`}>
          <Icon fa="fa fa-phone" size={1} />
        </a>
      </InputGroup.Text>
    )}
    suffixOptions={{type: 'button'}}
  />
);
