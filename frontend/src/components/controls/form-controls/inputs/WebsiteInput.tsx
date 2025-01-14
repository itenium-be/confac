import {BaseInput, BaseInputProps} from './BaseInput';
import {Icon} from '../../Icon';
import {InputGroup} from 'react-bootstrap';

type WebsiteInputProps = BaseInputProps<string>;

const addProtocol = (url: string): string => {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};


export const WebsiteInput = ({value, onChange, ...props}: WebsiteInputProps) => (
  <BaseInput
    type="text"
    value={value || ''}
    onChange={e => onChange(e.target.value as string)}
    {...props}
    suffix={(
      <InputGroup.Text>
        <a href={addProtocol(value)} target="_blank" rel="noopener noreferrer">
          <Icon fa="fa fa-globe" size={1} />
        </a>
      </InputGroup.Text>
    )}
    suffixOptions={{type: 'button'}}
  />
);
