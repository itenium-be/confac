import {Icon} from '../../Icon';
import {StringInput} from './StringInput';
import {BaseInputProps} from './BaseInput';
import {t} from '../../../utils';

type SearchStringInputProps = BaseInputProps<string>;

export const SearchStringInput = ({value, onChange, ...props}: SearchStringInputProps) => (
  <StringInput
    value={value}
    onChange={(e: string) => onChange(e)}
    suffix={<Icon className="tst-search" fa="fa fa-search" size={1} />}
    placeholder={t('search')}
    autoFocus
    {...props}
  />
);
